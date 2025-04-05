
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
        'select-none cursor-pointer p-3 rounded-md bg-white shadow-md flex flex-col items-center justify-center transition-all',
        isDragging ? 'opacity-50' : 'opacity-100',
        isDraggable ? 'cursor-grab active:cursor-grabbing' : '',
        className
      )}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onClick(sticker)}
      style={
        sticker.placed 
          ? { 
              position: 'absolute', 
              left: `${sticker.position.x}px`,
              top: `${sticker.position.y}px`,
              width: '80px',
              height: '80px',
              zIndex: 10
            } 
          : {}
      }
    >
      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center mb-1">
        <img 
          src={sticker.icon} 
          alt={sticker.name} 
          className="w-6 h-6" 
          draggable={false}
        />
      </div>
      <span className="text-xs font-medium mt-1">{sticker.name}</span>
      <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-sticker-purple text-white text-xs flex items-center justify-center">
        +
      </div>
    </div>
  );
};

export default Sticker;
