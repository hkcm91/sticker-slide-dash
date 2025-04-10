
import React, { useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { cn } from '@/lib/utils';
import StickerContent from './StickerContent';
import StickerControls from './StickerControls';
import { useStickerInteractions } from '@/hooks/useStickerInteractions';
import { useSelection } from '@/contexts/SelectionContext';
import { useToast } from '@/hooks/use-toast';

interface StickerBaseProps {
  sticker: StickerType;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onClick: (sticker: StickerType) => void;
  isDraggable: boolean;
  className?: string;
  onDelete?: (sticker: StickerType) => void;
  onUpdate?: (sticker: StickerType) => void;
  onToggleLock?: (sticker: StickerType) => void;
  onChangeZIndex?: (sticker: StickerType, change: number) => void;
  onToggleVisibility?: (sticker: StickerType) => void;
}

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

  const { isMultiSelectMode, isSelected, toggleSelection } = useSelection();
  const { toast } = useToast();

  const isVisuallyHidden = sticker.hidden;

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

  const combinedDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (sticker.locked) {
      e.preventDefault();
      return;
    }
    
    if (isMultiSelectMode && isSelected(sticker.id)) {
      parentDragStart(e, sticker);
      return;
    }

    handleDragStart(e);
    parentDragStart(e, sticker);
  };

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
        <StickerContent sticker={sticker} />
        
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

// Helper function to get the sticker's CSS classes based on its type
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

// Helper function to calculate the sticker's style
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
