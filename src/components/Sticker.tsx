import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { cn } from '@/lib/utils';
import StickerContent from './sticker/StickerContent';
import StickerControls from './sticker/StickerControls';
import { useStickerInteractions } from '@/hooks/useStickerInteractions';
import { useSelection } from '@/contexts/SelectionContext';

interface StickerProps {
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

const Sticker = ({ 
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
}: StickerProps) => {
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

  const combinedDragStart = (e: React.DragEvent<HTMLDivElement>) => {
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
    } else {
      onClick(sticker);
    }
  };

  const handleDelete = () => onDelete?.(sticker);
  const handleToggleLock = () => onToggleLock?.(sticker);
  const handleChangeZIndex = (change: number) => onChangeZIndex?.(sticker, change);
  const handleToggleVisibility = () => onToggleVisibility?.(sticker);

  const getStickerTypeClasses = () => {
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

  const shouldApplyEffects = sticker.placed && sticker.effects;
  
  const getEffectsStyle = () => {
    if (!shouldApplyEffects) return {};
    
    const styles: React.CSSProperties = {};
    
    if (sticker.effects?.shadow) {
      styles.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    }
    
    if (sticker.effects?.glow) {
      styles.boxShadow = `0 0 15px 5px rgba(255, 255, 255, 0.3)${styles.boxShadow ? ', ' + styles.boxShadow : ''}`;
    }
    
    if (sticker.effects?.blur) {
      styles.filter = `blur(${sticker.effects.blur}px)`;
    }
    
    if (sticker.effects?.grayscale) {
      styles.filter = `${styles.filter ? styles.filter + ' ' : ''}grayscale(1)`;
    }
    
    return styles;
  };

  return (
    <div
      ref={stickerRef}
      className={cn(
        'select-none cursor-pointer rounded-full flex items-center justify-center transition-all overflow-visible',
        isDragging ? 'opacity-50' : 'opacity-100',
        isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
        sticker.locked ? 'cursor-not-allowed' : '',
        isSelected(sticker.id) && 'ring-2 ring-blue-500 ring-offset-2',
        getStickerTypeClasses(),
        className
      )}
      draggable={(isDraggable || sticker.placed) && !sticker.locked}
      onDragStart={sticker.locked ? undefined : combinedDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleStickerClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={sticker.locked ? undefined : handleResize}
      style={
        sticker.placed 
          ? { 
              position: 'absolute', 
              left: `${sticker.position.x}px`,
              top: `${sticker.position.y}px`,
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotate(${rotation}deg)${sticker.transformStyle ? ' ' + sticker.transformStyle : ''}`,
              transformOrigin: sticker.transformOrigin || 'center',
              zIndex: zIndex || 10,
              opacity: opacity,
              transition: 'transform 0.2s ease, opacity 0.3s ease, box-shadow 0.3s ease',
              ...getEffectsStyle()
            } 
          : {}
      }
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

export default Sticker;
