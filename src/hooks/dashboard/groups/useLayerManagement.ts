
import { useState, useCallback, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing layers and z-index of stickers
 */
export function useLayerManagement(
  stickers: StickerType[],
  updateSticker: (sticker: StickerType) => void
) {
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const { toast } = useToast();

  // Check if we should show a hint about the layer panel
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
    handleMoveLayer,
    toggleLayerPanel
  };
}
