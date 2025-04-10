
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
 * It handles rendering, interactions, and all the UI functionality of stickers.
 * 
 * This component is responsible for:
 * - Rendering the sticker content (image, lottie, etc.)
 * - Handling interactions (drag, click, hover)
 * - Displaying controls for modifying the sticker
 * - Managing selection state
 * - Applying visual styling based on sticker state
 * 
 * @param props - The component props (see StickerBaseProps interface)
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
    setIsHovered
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
   * 
   * @param e - The drag event
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
   * Handles click events on the sticker
   * In multi-select mode, toggles selection
   * Otherwise, triggers the onClick handler
   * 
   * @param e - The click event
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
        getStickerTypeClasses(sticker, className),
        className
      )}
      draggable={(isDraggable || sticker.placed) && !sticker.locked}
      onDragStart={combinedDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleStickerClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={sticker.locked ? undefined : handleResize}
      style={getStickerStyle(sticker, size, rotation, zIndex, opacity, isVisuallyHidden)}
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

/**
 * Helper function to get CSS classes based on sticker type
 * Different sticker types get different visual styles
 * 
 * @param sticker - The sticker object
 * @param className - Optional additional classes
 * @returns The appropriate CSS classes for the sticker type
 */
const getStickerTypeClasses = (sticker: StickerType, className?: string) => {
  switch(sticker.type) {
    case 'image':
      return 'bg-transparent';
    case 'video':
      return 'bg-black/20';
    case 'media':
      return 'bg-blue-50/20';
    case 'custom':
      return 'bg-purple-50/20';
    default:
      return className?.includes('sticker-in-tray') && !sticker.placed ? 
        'border-4 border-white/80 shadow-md hover:shadow-lg transition-all duration-200 bg-white/90' : '';
  }
};

/**
 * Helper function to calculate CSS styles for a sticker
 * Handles positioning, sizing, rotation, and special effects
 * 
 * @param sticker - The sticker object
 * @param size - The size in pixels
 * @param rotation - The rotation in degrees
 * @param zIndex - The z-index value
 * @param opacity - The opacity value (0-1)
 * @param isVisuallyHidden - Whether the sticker is hidden (reduces opacity)
 * @returns React CSS properties object for the sticker
 */
const getStickerStyle = (
  sticker: StickerType, 
  size: number, 
  rotation: number, 
  zIndex: number,
  opacity: number,
  isVisuallyHidden: boolean
): React.CSSProperties => {
  if (!sticker.placed) {
    return {};
  }
  
  const styles: React.CSSProperties = {
    position: 'absolute', 
    left: `${sticker.position.x}px`,
    top: `${sticker.position.y}px`,
    width: `${size}px`,
    height: `${size}px`,
    transform: `rotate(${rotation}deg)${sticker.transformStyle ? ' ' + sticker.transformStyle : ''}`,
    transformOrigin: sticker.transformOrigin || 'center',
    zIndex: zIndex || 10,
    opacity: isVisuallyHidden ? 0.3 : opacity,
    transition: 'transform 0.2s ease, opacity 0.3s ease, box-shadow 0.3s ease',
    pointerEvents: 'auto'
  };

  // Add special effects to the sticker if needed
  if (sticker.placed && sticker.effects) {
    if (sticker.effects.shadow) {
      styles.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    }
    
    if (sticker.effects.glow) {
      styles.boxShadow = `0 0 15px 5px rgba(255, 255, 255, 0.3)${styles.boxShadow ? ', ' + styles.boxShadow : ''}`;
    }
    
    if (sticker.effects.blur) {
      styles.filter = `blur(${sticker.effects.blur}px)`;
    }
    
    if (sticker.effects.grayscale) {
      styles.filter = `${styles.filter ? styles.filter + ' ' : ''}grayscale(1)`;
    }
  }
  
  return styles;
};

export default StickerBase;
