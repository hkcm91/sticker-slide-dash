
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';

export function useStickerState(placedStickers: StickerType[]): { areAllLocked: boolean } {
  const { selectedStickers } = useSelection();
  
  // Rename function to avoid shadowing
  const checkIfAllLocked = (): boolean => {
    if (selectedStickers.size === 0) return false;
    
    return [...selectedStickers].every(id => {
      const sticker = placedStickers.find(s => s.id === id);
      return sticker?.locked === true;
    });
  };
  
  // Return the boolean directly without wrapping in Boolean()
  return { areAllLocked: checkIfAllLocked() };
}
