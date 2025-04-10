import React, { useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { cn } from '@/lib/utils';
import StickerContent from './StickerContent';
import StickerControls from './StickerControls';
import { useStickerInteractions } from '@/hooks/useStickerInteractions';
import { useSelection } from '@/contexts/SelectionContext';
import { useToast } from '@/hooks/use-toast';

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

  // Get selection-related functions from context
  const { isMultiSelectMode, isSelected, toggleSelection } = useSelection();
  const { toast } = useToast();

  // Track if the sticker is visually hidden (but still in DOM)
  const isVisuallyHidden = sticker.hidden;

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

  /**
   * Handles click events on the sticker - FIXED
   * In multi-select mode, toggles selection
   * Otherwise, triggers the onClick handler WITHOUT modifying sticker
   */
  const handleStickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isMultiSelectMode) {
      toggleSelection(sticker.id, e.shiftKey);
      
      if (!isSelected(sticker.id)) {
        toast({
          title: "Sticker selected",
          description: `${sticker.name || 'Sticker'} added to selection`,
          duration: 1500,
        });
      }
    } else {
      // FIXED: Simply pass the sticker to onClick without any state modifications
      // This ensures stickers don't disappear when clicked
      onClick(sticker);
    }
  };

  // Handler functions for various sticker controls
  const handleDelete = () => onDelete?.(sticker);
  const handleToggleLock = () => onToggleLock?.(sticker);
  const handleChangeZIndex = (change: number) => onChangeZIndex?.(sticker, change);
  const handleToggleVisibility = () => onToggleVisibility?.(sticker);

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
