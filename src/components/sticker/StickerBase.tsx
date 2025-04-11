
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { cn } from '@/lib/utils';
import StickerContent from './StickerContent';
import StickerControls from './StickerControls';
import { useStickerInteractions } from '@/hooks/useStickerInteractions';
import { useSafeSelection } from '@/hooks/useSafeSelection';
import { useStickerClickHandlers } from '@/hooks/sticker/useStickerClickHandlers';
import { useStickerDragHandlers } from '@/hooks/sticker/useStickerDragHandlers';
import { useStickerSelectionEffect } from '@/hooks/sticker/useStickerSelectionEffect';
import { useStickerControlHandlers } from '@/hooks/sticker/useStickerControlHandlers';

interface StickerBaseProps {
  /** The sticker data object */
  sticker: StickerType;
  /** Handler for when drag starts - used by parent components */
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  /** Handler for when the sticker is clicked */
  onClick: (sticker: StickerType) => void;
  /** Whether the sticker can be dragged */
  isDraggable: boolean;
  /** Additional CSS classes to apply to the sticker */
  className?: string;
  /** Optional handler for deleting the sticker */
  onDelete?: (sticker: StickerType) => void;
  /** Optional handler for updating the sticker properties */
  onUpdate?: (sticker: StickerType) => void;
  /** Optional handler for toggling the locked state of the sticker */
  onToggleLock?: (sticker: StickerType) => void;
  /** Optional handler for changing the z-index of the sticker */
  onChangeZIndex?: (sticker: StickerType, change: number) => void;
  /** Optional handler for toggling the visibility of the sticker */
  onToggleVisibility?: (sticker: StickerType) => void;
}

/**
 * StickerBase is the core implementation of a sticker component.
 */
const StickerBase = ({
  sticker,
  onDragStart: parentDragStart,
  onClick,
  isDraggable,
  className,
  onDelete,
  onUpdate,
  onToggleLock,
  onChangeZIndex,
  onToggleVisibility
}: StickerBaseProps) => {
  // Use the custom hook to handle sticker interactions like drag, resize, rotate
  const {
    isDragging,
    isHovered,
    size,
    rotation,
    opacity,
    zIndex,
    stickerRef,
    handleDragStart,
    handleDragEnd,
    handleRotate,
    handleResize,
    handleOpacityChange,
    setIsHovered,
    getStickerStyle,
    getStickerTypeClasses
  } = useStickerInteractions({ sticker, onUpdate });

  // Use the safe selection hook that provides fallback values
  const { isMultiSelectMode, isSelected } = useSafeSelection();

  // Track if the sticker is visually hidden (but still in DOM)
  const isVisuallyHidden = sticker.hidden;

  // Use the click handlers hook
  const { handleStickerClick } = useStickerClickHandlers({ sticker, onClick });

  // Use the drag handlers hook
  const { combinedDragStart } = useStickerDragHandlers({
    sticker,
    isSelected,
    isMultiSelectMode,
    parentDragStart,
    handleDragStart,
    handleDragEnd
  });

  // Use the selection effect hook
  useStickerSelectionEffect({ sticker, isSelected, stickerRef });

  // Use the control handlers hook
  const {
    handleDelete,
    handleToggleLock,
    handleChangeZIndex,
    handleToggleVisibility
  } = useStickerControlHandlers({
    sticker,
    onDelete,
    onToggleLock,
    onChangeZIndex,
    onToggleVisibility
  });

  return (
    <div
      ref={stickerRef}
      className={cn(
        'select-none cursor-pointer rounded-full flex items-center justify-center transition-all overflow-visible',
        isDragging ? 'opacity-50' : 'opacity-100',
        isDraggable && !sticker.locked ? 'cursor-grab active:cursor-grabbing' : '',
        sticker.locked ? 'cursor-not-allowed' : '',
        isSelected(sticker.id) && sticker.placed ? 'ring-2 ring-blue-500 ring-offset-2' : '',
        isVisuallyHidden ? 'opacity-30 hover:opacity-60' : '',
        getStickerTypeClasses(className),
        className
      )}
      draggable={(isDraggable || sticker.placed) && !sticker.locked}
      onDragStart={combinedDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleStickerClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={sticker.locked ? undefined : handleResize}
      style={getStickerStyle()}
    >
      <div className="w-full h-full flex items-center justify-center relative">
        {/* Render the sticker's content (image, lottie, etc.) */}
        <StickerContent sticker={sticker} />
        
        {/* Render controls when sticker is hovered or locked */}
        <StickerControls 
          sticker={sticker} 
          isHovered={isHovered} 
          onDelete={onDelete ? handleDelete : undefined}
          onRotate={handleRotate}
          onOpacityChange={handleOpacityChange}
          onToggleLock={onToggleLock ? handleToggleLock : undefined}
          onChangeZIndex={onChangeZIndex ? handleChangeZIndex : undefined}
          onToggleVisibility={onToggleVisibility ? handleToggleVisibility : undefined}
        />
      </div>
    </div>
  );
};

export default StickerBase;
