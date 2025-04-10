
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
      return sticker?.locked === true;
    });
  }, [selectedStickers, placedStickers]);
  
  // Important: We need to ensure we're returning a strict boolean value
  const allLocked: boolean = areAllLocked();
  
  return {
    areAllLocked: allLocked
  };
}
