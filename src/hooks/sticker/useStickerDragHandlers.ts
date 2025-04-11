
import { Sticker as StickerType } from '@/types/stickers';

interface UseStickerDragHandlersProps {
  sticker: StickerType;
  isSelected: (id: string) => boolean;
  isMultiSelectMode: boolean;
  parentDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragEnd: () => void;
}

export function useStickerDragHandlers({
  sticker,
  isSelected,
  isMultiSelectMode,
  parentDragStart,
  handleDragStart,
  handleDragEnd
}: UseStickerDragHandlersProps) {
  /**
   * Handles drag start events, combining the component's internal handler
   * with the parent-provided handler.
   */
  const combinedDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Prevent dragging if sticker is locked
    if (sticker.locked) {
      e.preventDefault();
      return;
    }
    
    // Special handling for multi-select mode
    if (isMultiSelectMode && isSelected(sticker.id)) {
      parentDragStart(e, sticker);
      return;
    }

    // Normal drag handling
    handleDragStart(e);
    parentDragStart(e, sticker);
  };

  return {
    combinedDragStart,
    handleDragEnd
  };
}
