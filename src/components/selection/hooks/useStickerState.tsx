
import { useState, useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';

export function useStickerState() {
  const isLocked = (sticker: StickerType) => {
    // Handle both boolean and string representation of locked state
    return sticker.locked === true || sticker.locked === "true";
  };

  const isVisible = (sticker: StickerType) => {
    // Handle both boolean and string representation of visible state
    return sticker.visible !== false && sticker.visible !== "false";
  };

  return {
    isLocked,
    isVisible,
  };
}
