
import { useGroupManagement } from './groups/useGroupManagement';
import { useMultiStickerOperations } from './groups/useMultiStickerOperations';
import { useLayerManagement } from './groups/useLayerManagement';
import { Sticker as StickerType } from '@/types/stickers';

/**
 * Main hook that combines all group and multi-selection related functionality
 */
export function useStickerGroupHandlers(
  stickers: StickerType[],
  updateSticker: (sticker: StickerType) => void
) {
  // Use the smaller, focused hooks
  const { handleGroupStickers, handleUngroupStickers } = useGroupManagement(stickers, updateSticker);
  const { handleMultiMove, handleMultiResize } = useMultiStickerOperations(stickers, updateSticker);
  const { showLayerPanel, handleMoveLayer, toggleLayerPanel } = useLayerManagement(stickers, updateSticker);

  return {
    // Group management
    handleGroupStickers,
    handleUngroupStickers,
    
    // Multi-sticker operations
    handleMultiMove,
    handleMultiResize,
    
    // Layer management
    showLayerPanel,
    handleMoveLayer,
    toggleLayerPanel
  };
}
