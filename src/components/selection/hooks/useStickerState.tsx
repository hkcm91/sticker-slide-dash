
import { useMemo } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';

// Explicitly return a boolean type
export function useStickerState(placedStickers: StickerType[]): { areAllLocked: boolean } {
  const { selectedStickers } = useSelection();
  
  // Use useMemo to calculate and memoize the boolean result directly
  const areAllLocked = useMemo((): boolean => {
    // Early exit if no stickers are selected
    if (selectedStickers.size === 0) {
      return false;
    }
    
    // Check if every selected sticker ID corresponds to a locked sticker
    return [...selectedStickers].every(id => {
      const sticker = placedStickers.find(s => s.id === id);
      // Return false if sticker doesn't exist, true only if sticker.locked is true
      return sticker?.locked === true;
    });
  }, [selectedStickers, placedStickers]); // Dependencies: re-calculate only if these change
  
  return { areAllLocked };
}
