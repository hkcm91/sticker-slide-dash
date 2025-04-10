
import { useState, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook that provides operations for sticker groups in the layer panel
 */
export function useLayerGroupOperations(
  placedStickers: StickerType[],
  onGroupStickers?: (stickerIds: string[]) => void,
  onUngroupStickers?: (groupId: string) => void
) {
  const { selectedStickers, clearSelection } = useSelection();
  const { toast } = useToast();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Auto-expand all groups on first render
  useEffect(() => {
    if (expandedGroups.size === 0) {
      const groupIds = new Set<string>();
      
      placedStickers.forEach(sticker => {
        if (sticker.groupId) {
          groupIds.add(sticker.groupId);
        }
      });
      
      if (groupIds.size > 0) {
        setExpandedGroups(groupIds);
      }
    }
  }, [placedStickers, expandedGroups.size]);

  const handleGroupClick = () => {
    if (selectedStickers.size > 1 && onGroupStickers) {
      onGroupStickers([...selectedStickers]);
      clearSelection();
      
      toast({
        title: "Stickers grouped",
        description: `${selectedStickers.size} stickers have been grouped together.`,
        duration: 2000,
      });
    }
  };

  const handleUngroupClick = () => {
    const selectedArray = [...selectedStickers];
    if (selectedArray.length === 1) {
      const sticker = placedStickers.find(s => s.id === selectedArray[0]);
      if (sticker && sticker.groupId && onUngroupStickers) {
        onUngroupStickers(sticker.groupId);
        clearSelection();
        
        toast({
          title: "Group disbanded",
          description: "The stickers have been ungrouped.",
          duration: 2000,
        });
      }
    }
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Check if any selected stickers are part of a group
  const hasSelectedGroup = [...selectedStickers].some(id => {
    const sticker = placedStickers.find(s => s.id === id);
    return sticker && sticker.groupId;
  });

  // Check if all selected stickers are from the same group
  const isAllSameGroup = (() => {
    const selectedIds = [...selectedStickers];
    if (selectedIds.length <= 1) return false;
    
    const groups = new Set<string>();
    
    for (const id of selectedIds) {
      const sticker = placedStickers.find(s => s.id === id);
      if (sticker?.groupId) {
        groups.add(sticker.groupId);
      } else {
        // If any selected sticker has no group, they're not all from the same group
        return false;
      }
    }
    
    // If all stickers have groups and they're all the same group
    return groups.size === 1;
  })();

  return {
    expandedGroups,
    handleGroupClick,
    handleUngroupClick,
    toggleGroupExpansion,
    hasSelectedGroup,
    isAllSameGroup
  };
}
