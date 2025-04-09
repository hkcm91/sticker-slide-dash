
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { cn } from '@/lib/utils';
import StickerContent from './sticker/StickerContent';
import StickerControls from './sticker/StickerControls';
import { useStickerInteractions } from '@/hooks/useStickerInteractions';

interface StickerProps {
  sticker: StickerType;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onClick: (sticker: StickerType) => void;
  isDraggable: boolean;
  className?: string;
  onDelete?: (sticker: StickerType) => void;
  onUpdate?: (sticker: StickerType) => void;
}

const Sticker = ({ 
  sticker, 
  onDragStart: parentDragStart, 
  onClick, 
  isDraggable, 
  className,
  onDelete,
  onUpdate
}: StickerProps) => {
  const {
    isDragging,
    isHovered,
    size,
    rotation,
    stickerRef,
    handleDragStart,
    handleDragEnd,
    handleRotate,
    handleResize,
    setIsHovered
  } = useStickerInteractions({ sticker, onUpdate });

  const combinedDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragStart(e);
    parentDragStart(e, sticker);
  };

  return (
    <div
      ref={stickerRef}
      className={cn(
        'select-none cursor-pointer rounded-full flex items-center justify-center transition-all',
        isDragging ? 'opacity-50' : 'opacity-100',
        isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
        className?.includes('sticker-in-tray') && !sticker.placed ? 
          'border-4 border-white/80 shadow-md hover:shadow-lg transition-all duration-200 bg-white/90' : '',
        className
      )}
      draggable={isDraggable || sticker.placed}
      onDragStart={combinedDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onClick(sticker)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleResize}
      style={
        sticker.placed 
          ? { 
              position: 'absolute', 
              left: `${sticker.position.x}px`,
              top: `${sticker.position.y}px`,
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotate(${rotation}deg)`,
              zIndex: 10,
              transition: 'transform 0.2s ease'
            } 
          : {}
      }
    >
      <div className="w-full h-full flex items-center justify-center relative">
        <StickerContent sticker={sticker} />
        
        <StickerControls 
          sticker={sticker} 
          isHovered={isHovered} 
          onDelete={onDelete}
          onRotate={handleRotate}
        />
      </div>
    </div>
  );
};

export default Sticker;
