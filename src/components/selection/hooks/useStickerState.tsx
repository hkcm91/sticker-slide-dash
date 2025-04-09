
import { useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';

export function useStickerState(placedStickers: StickerType[]) {
  const { selectedStickers } = useSelection();
  
  // Check if all selected stickers are locked
  const areAllLocked = useCallback((): boolean => {
    if (selectedStickers.size === 0) return false;
    
    return [...selectedStickers].every(id => {
      const sticker = placedStickers.find(s => s.id === id);
      // Use Boolean conversion to ensure we always return a boolean
      // The strict comparison with true ensures we don't consider undefined, null, or other truthy values
      return sticker?.locked === true;
    });
  }, [selectedStickers, placedStickers]);
  
  return {
    // Call the function to get the boolean value and make sure it's a boolean
    areAllLocked: Boolean(areAllLocked())
  };
}
