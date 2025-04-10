
import { useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';

/**
 * Hook for operations on multiple stickers at once
 */
export function useMultiStickerOperations(
  stickers: StickerType[],
  updateSticker: (sticker: StickerType) => void
) {
  const handleMultiMove = useCallback((stickerIds: string[], deltaX: number, deltaY: number) => {
    const stickerGroups = new Map<string | undefined, StickerType[]>();
    
    stickers.forEach(sticker => {
      if (stickerIds.includes(sticker.id) && !sticker.locked) {
        const key = sticker.groupId || undefined;
        
        if (!stickerGroups.has(key)) {
          stickerGroups.set(key, []);
        }
        
        stickerGroups.get(key)!.push(sticker);
      }
    });
    
    stickerGroups.forEach((groupStickers) => {
      groupStickers.forEach(sticker => {
        updateSticker({
          ...sticker,
          position: {
            x: sticker.position.x + deltaX,
            y: sticker.position.y + deltaY
          },
          lastUsed: new Date().toISOString()
        });
      });
    });
  }, [stickers, updateSticker]);

  const handleMultiResize = useCallback((stickerIds: string[], scaleRatio: number) => {
    stickers.forEach(sticker => {
      if (stickerIds.includes(sticker.id) && !sticker.locked) {
        const currentSize = sticker.size || 60;
        
        const minSize = sticker.widgetConfig?.size?.minWidth || 30;
        const maxSize = sticker.widgetConfig?.size?.maxWidth || 300;
        
        const newSize = Math.max(minSize, Math.min(maxSize, currentSize * scaleRatio));
        
        updateSticker({
          ...sticker,
          size: newSize,
          lastUsed: new Date().toISOString()
        });
      }
    });
  }, [stickers, updateSticker]);

  return {
    handleMultiMove,
    handleMultiResize
  };
}
