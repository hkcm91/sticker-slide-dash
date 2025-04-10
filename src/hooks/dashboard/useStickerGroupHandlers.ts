import { useState, useCallback, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export function useStickerGroupHandlers(
  stickers: StickerType[],
  updateSticker: (sticker: StickerType) => void
) {
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasGroups = stickers.some(sticker => sticker.groupId);
    const hasMultipleVisibleStickers = stickers.filter(s => s.placed && !s.hidden && !s.docked).length > 2;
    
    if (hasGroups || hasMultipleVisibleStickers) {
      const hasSeenLayerHint = localStorage.getItem('hasSeenLayerPanelHint');
      
      if (!hasSeenLayerHint && !showLayerPanel) {
        toast({
          title: "Pro Tip: Use the Layer Panel",
          description: "Click the layers button in the bottom right to manage your stickers.",
          duration: 5000,
        });
        
        localStorage.setItem('hasSeenLayerPanelHint', 'true');
      }
    }
  }, [stickers, showLayerPanel, toast]);

  const handleMultiMove = useCallback((stickerIds: string[], deltaX: number, deltaY: number) => {
    const stickerGroups = new Map<string | undefined, StickerType[]>();
    
    stickers.forEach(sticker => {
      if (stickerIds.includes(sticker.id) && !sticker.locked) {
        const key = sticker.groupId || undefined;
        
        if (!stickerGroups.has(key)) {
          stickerGroups.set(key, []);
        }
        
        stickerGroups.get(key)!.push(sticker);
      }
    });
    
    stickerGroups.forEach((groupStickers, groupId) => {
      groupStickers.forEach(sticker => {
        updateSticker({
          ...sticker,
          position: {
            x: sticker.position.x + deltaX,
            y: sticker.position.y + deltaY
          },
          lastUsed: new Date().toISOString()
        });
      });
    });
  }, [stickers, updateSticker]);

  const handleMultiResize = useCallback((stickerIds: string[], scaleRatio: number) => {
    stickers.forEach(sticker => {
      if (stickerIds.includes(sticker.id) && !sticker.locked) {
        const currentSize = sticker.size || 60;
        
        const minSize = sticker.widgetConfig?.size?.minWidth || 30;
        const maxSize = sticker.widgetConfig?.size?.maxWidth || 300;
        
        const newSize = Math.max(minSize, Math.min(maxSize, currentSize * scaleRatio));
        
        updateSticker({
          ...sticker,
          size: newSize,
          lastUsed: new Date().toISOString()
        });
      }
    });
  }, [stickers, updateSticker]);

  const handleGroupStickers = useCallback((stickerIds: string[]) => {
    if (stickerIds.length < 2) return;
    
    const groupId = uuidv4();
    let groupedCount = 0;
    
    const highestZIndex = Math.max(
      ...stickers
        .filter(s => stickerIds.includes(s.id))
        .map(s => s.zIndex || 0)
    );
    
    stickers.forEach(sticker => {
      if (stickerIds.includes(sticker.id)) {
        const updatedSticker = {
          ...sticker,
          groupId,
          zIndex: highestZIndex + Math.floor(Math.random() * 2),
          lastUsed: new Date().toISOString()
        };
        
        updateSticker(updatedSticker);
        groupedCount++;
      }
    });
    
    if (groupedCount > 0) {
      toast({
        title: "Stickers grouped",
        description: `${groupedCount} stickers have been grouped together.`,
        duration: 3000,
      });
    }
  }, [stickers, updateSticker, toast]);

  const handleUngroupStickers = useCallback((groupId: string) => {
    let ungroupedCount = 0;
    
    stickers.forEach(sticker => {
      if (sticker.groupId === groupId) {
        const { groupId, ...stickerWithoutGroup } = sticker;
        updateSticker({
          ...stickerWithoutGroup,
          lastUsed: new Date().toISOString()
        });
        ungroupedCount++;
      }
    });
    
    if (ungroupedCount > 0) {
      toast({
        title: "Group disbanded",
        description: `${ungroupedCount} stickers have been ungrouped.`,
        duration: 3000,
      });
    }
  }, [stickers, updateSticker, toast]);

  const handleMoveLayer = useCallback((stickerId: string, change: number) => {
    const stickerToUpdate = stickers.find(s => s.id === stickerId);
    if (!stickerToUpdate) return;
    
    const currentZIndex = stickerToUpdate.zIndex || 10;
    const newZIndex = currentZIndex + change;
    
    const updates: StickerType[] = [];
    
    if (stickerToUpdate.groupId) {
      const groupId = stickerToUpdate.groupId;
      const groupStickers = stickers.filter(s => s.groupId === groupId);
      
      groupStickers.forEach(sticker => {
        updates.push({
          ...sticker,
          zIndex: (sticker.zIndex || 10) + change,
          lastUsed: new Date().toISOString()
        });
      });
      
      requestAnimationFrame(() => {
        updates.forEach(updatedSticker => {
          updateSticker(updatedSticker);
        });
        
        toast({
          title: change > 0 ? "Group moved forward" : "Group moved backward",
          description: `The entire group of ${groupStickers.length} stickers was moved.`,
          duration: 2000,
        });
      });
    } else {
      requestAnimationFrame(() => {
        updateSticker({
          ...stickerToUpdate,
          zIndex: newZIndex,
          lastUsed: new Date().toISOString()
        });
      });
    }
  }, [stickers, updateSticker, toast]);

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
