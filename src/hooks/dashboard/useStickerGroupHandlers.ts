
import { useState, useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export function useStickerGroupHandlers(
  stickers: StickerType[],
  setStickers: React.Dispatch<React.SetStateAction<StickerType[]>>
) {
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const { toast } = useToast();

  const handleMultiMove = useCallback((stickerIds: string[], deltaX: number, deltaY: number) => {
    setStickers(prevStickers => 
      prevStickers.map(sticker => {
        if (stickerIds.includes(sticker.id) && !sticker.locked) {
          return {
            ...sticker,
            position: {
              x: sticker.position.x + deltaX,
              y: sticker.position.y + deltaY
            }
          };
        }
        return sticker;
      })
    );
  }, [setStickers]);

  const handleMultiResize = useCallback((stickerIds: string[], scaleRatio: number) => {
    setStickers(prevStickers => 
      prevStickers.map(sticker => {
        if (stickerIds.includes(sticker.id) && !sticker.locked) {
          const currentSize = sticker.size || 60;
          
          // Get min/max from sticker config or use defaults
          const minSize = sticker.widgetConfig?.size?.minWidth || 30;
          const maxSize = sticker.widgetConfig?.size?.maxWidth || 300;
          
          // Apply scale ratio but stay within bounds
          const newSize = Math.max(minSize, Math.min(maxSize, currentSize * scaleRatio));
          
          return {
            ...sticker,
            size: newSize
          };
        }
        return sticker;
      })
    );
  }, [setStickers]);

  const handleGroupStickers = useCallback((stickerIds: string[]) => {
    if (stickerIds.length < 2) return;
    
    const groupId = uuidv4();
    
    setStickers(prevStickers => 
      prevStickers.map(sticker => {
        if (stickerIds.includes(sticker.id)) {
          return {
            ...sticker,
            groupId,
            lastUsed: new Date().toISOString()
          };
        }
        return sticker;
      })
    );
    
    toast({
      title: "Stickers grouped",
      description: `${stickerIds.length} stickers have been grouped together.`,
      duration: 3000,
    });
  }, [setStickers, toast]);

  const handleUngroupStickers = useCallback((groupId: string) => {
    setStickers(prevStickers => 
      prevStickers.map(sticker => {
        if (sticker.groupId === groupId) {
          const { groupId, ...stickerWithoutGroup } = sticker;
          return {
            ...stickerWithoutGroup,
            lastUsed: new Date().toISOString()
          };
        }
        return sticker;
      })
    );
    
    toast({
      title: "Group disbanded",
      description: "The stickers have been ungrouped.",
      duration: 3000,
    });
  }, [setStickers, toast]);

  const handleMoveLayer = useCallback((stickerId: string, change: number) => {
    setStickers(prevStickers => {
      // Find the sticker to update
      const stickerToUpdate = prevStickers.find(s => s.id === stickerId);
      if (!stickerToUpdate) return prevStickers;
      
      // Get current z-index
      const currentZIndex = stickerToUpdate.zIndex || 10;
      const newZIndex = currentZIndex + change;
      
      // Update the sticker
      return prevStickers.map(sticker => {
        if (sticker.id === stickerId) {
          return {
            ...sticker,
            zIndex: newZIndex,
            lastUsed: new Date().toISOString()
          };
        }
        return sticker;
      });
    });
  }, [setStickers]);

  const toggleLayerPanel = useCallback(() => {
    setShowLayerPanel(prev => !prev);
  }, []);

  return {
    showLayerPanel,
    handleMultiMove,
    handleMultiResize,
    handleGroupStickers,
    handleUngroupStickers,
    handleMoveLayer,
    toggleLayerPanel
  };
}
