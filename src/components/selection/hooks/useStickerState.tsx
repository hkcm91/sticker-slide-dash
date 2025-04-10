
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
      console.log('[useStickerState] No stickers selected, returning false');
      return false;
    }
    
    console.log('[useStickerState] Calculating locked state for selected IDs:', [...selectedStickers]);
    
    // Check if every selected sticker ID corresponds to a locked sticker
    const result = [...selectedStickers].every(id => {
      const sticker = placedStickers.find(s => s.id === id);
      // Log details for the specific sticker being checked
      console.log(`[useStickerState] Checking sticker ID: ${id}, Found: ${!!sticker}, Locked: ${sticker?.locked}, Type: ${typeof sticker?.locked}`);
      // Ensure the sticker exists and its locked property is explicitly true
      return sticker?.locked === true;
    });
    
    console.log('[useStickerState] Calculation result - areAllLocked:', result, 'type:', typeof result);
    return result;
  }, [selectedStickers, placedStickers]); // Dependencies: re-calculate only if these change
  
  // The value from useMemo is already a boolean
  console.log('[useStickerState] Final memoized areAllLocked value:', areAllLocked, 'type:', typeof areAllLocked);
  
  return {
    areAllLocked // Return the memoized boolean value
  };
}
