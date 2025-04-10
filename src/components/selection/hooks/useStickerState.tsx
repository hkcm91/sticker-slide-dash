
import { useState, useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';

export function useStickerState() {
  const isLocked = (sticker: StickerType) => {
    // Handle both boolean and string representation of locked state
    // Convert to string for comparison to ensure consistent handling
    return sticker.locked === true || String(sticker.locked) === "true";
  };

  const isVisible = (sticker: StickerType) => {
    // Handle both boolean and string representation of visible state
    // Convert to string for comparison to ensure consistent handling
    return sticker.visible !== false && String(sticker.visible) !== "false";
  };

  return {
    isLocked,
    isVisible,
  };
}
