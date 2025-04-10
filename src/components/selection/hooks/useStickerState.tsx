
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
      return sticker?.locked === true;
    });
  }, [selectedStickers, placedStickers]);
  
  // Ensure we have a boolean value by using double negation
  const allLocked = !!areAllSelectedLocked();
  
  return {
    areAllLocked: allLocked
  };
}
