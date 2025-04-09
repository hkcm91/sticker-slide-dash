
import { useState, useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export function useStickerGroupHandlers(
  stickers: StickerType[],
  updateSticker: (sticker: StickerType) => void
) {
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const { toast } = useToast();

  const handleMultiMove = useCallback((stickerIds: string[], deltaX: number, deltaY: number) => {
    stickers.forEach(sticker => {
      if (stickerIds.includes(sticker.id) && !sticker.locked) {
        updateSticker({
          ...sticker,
          position: {
            x: sticker.position.x + deltaX,
            y: sticker.position.y + deltaY
          },
          lastUsed: new Date().toISOString()
        });
      }
    });
  }, [stickers, updateSticker]);

  const handleMultiResize = useCallback((stickerIds: string[], scaleRatio: number) => {
    stickers.forEach(sticker => {
      if (stickerIds.includes(sticker.id) && !sticker.locked) {
        const currentSize = sticker.size || 60;
        
        // Get min/max from sticker config or use defaults
        const minSize = sticker.widgetConfig?.size?.minWidth || 30;
        const maxSize = sticker.widgetConfig?.size?.maxWidth || 300;
        
        // Apply scale ratio but stay within bounds
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
    
    stickers.forEach(sticker => {
      if (stickerIds.includes(sticker.id)) {
        updateSticker({
          ...sticker,
          groupId,
          lastUsed: new Date().toISOString()
        });
      }
    });
    
    toast({
      title: "Stickers grouped",
      description: `${stickerIds.length} stickers have been grouped together.`,
      duration: 3000,
    });
  }, [stickers, updateSticker, toast]);

  const handleUngroupStickers = useCallback((groupId: string) => {
    stickers.forEach(sticker => {
      if (sticker.groupId === groupId) {
        const { groupId, ...stickerWithoutGroup } = sticker;
        updateSticker({
          ...stickerWithoutGroup,
          lastUsed: new Date().toISOString()
        });
      }
    });
    
    toast({
      title: "Group disbanded",
      description: "The stickers have been ungrouped.",
      duration: 3000,
    });
  }, [stickers, updateSticker, toast]);

  const handleMoveLayer = useCallback((stickerId: string, change: number) => {
    // Find the sticker to update
    const stickerToUpdate = stickers.find(s => s.id === stickerId);
    if (!stickerToUpdate) return;
    
    // Get current z-index
    const currentZIndex = stickerToUpdate.zIndex || 10;
    const newZIndex = currentZIndex + change;
    
    // Update the sticker
    updateSticker({
      ...stickerToUpdate,
      zIndex: newZIndex,
      lastUsed: new Date().toISOString()
    });
  }, [stickers, updateSticker]);

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
