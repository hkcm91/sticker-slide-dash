
import { useEffect, RefObject } from 'react';
import { Sticker as StickerType } from '@/types/stickers';

interface UseStickerSelectionEffectProps {
  sticker: StickerType;
  isSelected: (id: string) => boolean;
  stickerRef: RefObject<HTMLDivElement>;
}

export function useStickerSelectionEffect({
  sticker,
  isSelected,
  stickerRef
}: UseStickerSelectionEffectProps) {
  /**
   * Effect to highlight selected stickers
   * Adds a blue ring around selected stickers when they're placed on the dashboard
   */
  useEffect(() => {
    if (isSelected(sticker.id) && sticker.placed) {
      const stickerElement = stickerRef.current;
      if (stickerElement) {
        stickerElement.classList.add('ring-2', 'ring-blue-500');
        
        const timeout = setTimeout(() => {
          if (!isSelected(sticker.id)) {
            stickerElement.classList.remove('ring-2', 'ring-blue-500');
          }
        }, 300);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [isSelected, sticker.id, sticker.placed, stickerRef]);
}
