
import { useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';
import { useToast } from '@/hooks/use-toast';

export function useGroupOperations(
  placedStickers: StickerType[],
  onGroupStickers?: (stickerIds: string[]) => void,
  onUngroupStickers?: (groupId: string) => void
) {
  const { selectedStickers, clearSelection } = useSelection();
  const { toast } = useToast();
  
  const handleGroupClick = useCallback(() => {
    if (onGroupStickers && selectedStickers.size > 1) {
      onGroupStickers([...selectedStickers]);
      clearSelection();
      
      toast({
        title: "Items grouped",
        description: `${selectedStickers.size} items have been grouped together`,
        duration: 2000,
      });
    }
  }, [selectedStickers, onGroupStickers, clearSelection, toast]);
  
  const handleUngroupClick = useCallback(() => {
    if (!onUngroupStickers || selectedStickers.size !== 1) return;
    
    const stickerId = [...selectedStickers][0];
    const sticker = placedStickers.find(s => s.id === stickerId);
    
    if (sticker && sticker.groupId) {
      onUngroupStickers(sticker.groupId);
      clearSelection();
      
      toast({
        title: "Group disbanded",
        description: "The stickers have been ungrouped",
        duration: 2000,
      });
    }
  }, [selectedStickers, placedStickers, onUngroupStickers, clearSelection, toast]);

  // Check if the selected sticker is part of a group
  const hasSelectedGroup = useCallback(() => {
    if (selectedStickers.size !== 1) return false;
    
    const stickerId = [...selectedStickers][0];
    const sticker = placedStickers.find(s => s.id === stickerId);
    
    return sticker && sticker.groupId;
  }, [selectedStickers, placedStickers]);
  
  // Is selection all from the same group
  const isAllSameGroup = useCallback(() => {
    if (selectedStickers.size <= 1) return false;
    
    let groupId: string | undefined;
    
    for (const id of selectedStickers) {
      const sticker = placedStickers.find(s => s.id === id);
      
      if (!sticker || !sticker.groupId) return false;
      
      if (groupId === undefined) {
        groupId = sticker.groupId;
      } else if (sticker.groupId !== groupId) {
        return false;
      }
    }
    
    return true;
  }, [selectedStickers, placedStickers]);
  
  return {
    handleGroupClick,
    handleUngroupClick,
    hasSelectedGroup: hasSelectedGroup(),
    isAllSameGroup: isAllSameGroup()
  };
}
