
import { useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';

export function useStickerState(placedStickers: StickerType[]): { areAllLocked: boolean } {
  const { selectedStickers } = useSelection();
  
  // Check if all selected stickers are locked
  const areAllSelectedLocked = useCallback((): boolean => {
    if (selectedStickers.size === 0) return false;
    
    return [...selectedStickers].every(id => {
      const sticker = placedStickers.find(s => s.id === id);
      // Explicitly convert to boolean using === true to ensure boolean return
      return sticker?.locked === true;
    });
  }, [selectedStickers, placedStickers]);
  
  // Calculate the value once
  const allLocked: boolean = areAllSelectedLocked();
  
  return {
    // Return the strictly typed boolean value
    areAllLocked: allLocked
  };
}
