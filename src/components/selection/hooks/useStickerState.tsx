
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';

export function useStickerState(placedStickers: StickerType[]) {
  const { selectedStickers } = useSelection();
  
  // Check if all selected stickers are locked
  const areAllLocked = (): boolean => {
    if (selectedStickers.size === 0) return false;
    
    return [...selectedStickers].every(id => {
      const sticker = placedStickers.find(s => s.id === id);
      return sticker?.locked === true;
    });
  };
  
  // Return a proper boolean value - explicitly converting to boolean to ensure type safety
  return { areAllLocked: Boolean(areAllLocked()) };
}
