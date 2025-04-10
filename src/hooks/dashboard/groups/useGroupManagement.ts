
import { useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing sticker groups - creating and breaking up groups
 */
export function useGroupManagement(
  stickers: StickerType[],
  updateSticker: (sticker: StickerType) => void
) {
  const { toast } = useToast();

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
        // Create a new sticker without the groupId property
        const { groupId: removedGroupId, ...stickerWithoutGroup } = sticker;
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

  return {
    handleGroupStickers,
    handleUngroupStickers
  };
}
