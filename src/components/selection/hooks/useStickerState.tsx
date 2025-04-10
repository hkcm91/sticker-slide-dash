
import { useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';

export function useStickerState(placedStickers: StickerType[]): { areAllLocked: boolean } {
  const { selectedStickers } = useSelection();
  
  // Check if all selected stickers are locked
  const areAllSelectedLocked = useCallback((): boolean => {
    if (selectedStickers.size === 0) {
      console.log('No stickers selected, returning false');
      return false;
    }
    
    console.log('Selected stickers IDs:', [...selectedStickers]);
    
    const result = [...selectedStickers].every(id => {
      const sticker = placedStickers.find(s => s.id === id);
      console.log('Sticker found:', sticker?.id, 'locked value:', sticker?.locked, 'type:', typeof sticker?.locked);
      // Explicitly check that locked is boolean true, not truthy value
      return sticker?.locked === true;
    });
    
    console.log('Are all selected stickers locked?', result, 'type:', typeof result);
    return result;
  }, [selectedStickers, placedStickers]);
  
  // Explicitly cast to boolean using Boolean constructor
  const allLocked = Boolean(areAllSelectedLocked());
  console.log('Final areAllLocked value:', allLocked, 'type:', typeof allLocked);
  
  return {
    areAllLocked: allLocked
  };
}
