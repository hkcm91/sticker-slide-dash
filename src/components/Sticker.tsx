
import React, { useState, useRef } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { cn } from '@/lib/utils';

interface StickerProps {
  sticker: StickerType;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onClick: (sticker: StickerType) => void;
  isDraggable: boolean;
  className?: string;
}

const Sticker = ({ sticker, onDragStart, onClick, isDraggable, className }: StickerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const stickerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.setData('stickerId', sticker.id);
    
    // Set the drag image to be the sticker element
    if (stickerRef.current) {
      // Create a clone for the drag image
      const rect = stickerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      e.dataTransfer.setDragImage(stickerRef.current, offsetX, offsetY);
    }
    
    onDragStart(e, sticker);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={stickerRef}
      className={cn(
        'select-none cursor-pointer p-3 rounded-full bg-white shadow-md flex items-center justify-center transition-all',
        isDragging ? 'opacity-50' : 'opacity-100',
        isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
        className
      )}
      draggable={isDraggable || sticker.placed}  // Make placed stickers draggable too
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onClick(sticker)}
      style={
        sticker.placed 
          ? { 
              position: 'absolute', 
              left: `${sticker.position.x}px`,
              top: `${sticker.position.y}px`,
              width: '60px',
              height: '60px',
              zIndex: 10
            } 
          : {}
      }
    >
      <div className="w-full h-full flex items-center justify-center">
        <img 
          src={sticker.icon} 
          alt={sticker.name} 
          className="w-8 h-8" 
          draggable={false}
        />
      </div>
    </div>
  );
};

export default Sticker;
