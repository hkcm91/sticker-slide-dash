
import React, { useState, useRef } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { cn } from '@/lib/utils';
import { Trash } from 'lucide-react';

interface StickerProps {
  sticker: StickerType;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
  onClick: (sticker: StickerType) => void;
  isDraggable: boolean;
  className?: string;
  onDelete?: (sticker: StickerType) => void;
}

const Sticker = ({ 
  sticker, 
  onDragStart, 
  onClick, 
  isDraggable, 
  className,
  onDelete 
}: StickerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [size, setSize] = useState(60); // Default size for placed stickers
  const stickerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.setData('stickerId', sticker.id);
    
    // Calculate offset from the top-left corner of the sticker
    if (stickerRef.current) {
      const rect = stickerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      // Store these offsets in the dataTransfer object
      e.dataTransfer.setData('offsetX', String(offsetX));
      e.dataTransfer.setData('offsetY', String(offsetY));
      
      // Set the drag image to be the sticker element
      e.dataTransfer.setDragImage(stickerRef.current, offsetX, offsetY);
    }
    
    onDragStart(e, sticker);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the widget when clicking delete
    if (onDelete) {
      onDelete(sticker);
    }
  };

  const handleResize = (e: React.WheelEvent) => {
    if (sticker.placed) {
      // Prevent page scrolling
      e.preventDefault();
      
      // Increase/decrease size based on wheel direction
      const newSize = e.deltaY < 0 ? size + 5 : size - 5;
      
      // Limit size between 30px and 120px
      setSize(Math.max(30, Math.min(120, newSize)));
    }
  };

  return (
    <div
      ref={stickerRef}
      className={cn(
        'select-none cursor-pointer rounded-full flex items-center justify-center transition-all',
        isDragging ? 'opacity-50' : 'opacity-100',
        isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
        className
      )}
      draggable={isDraggable || sticker.placed}  // Make placed stickers draggable too
      onDragStart={handleDragStart}
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
              zIndex: 10
            } 
          : {}
      }
    >
      <div className="w-full h-full flex items-center justify-center relative">
        <img 
          src={sticker.icon} 
          alt={sticker.name} 
          className="w-full h-full p-2" 
          draggable={false}
        />
        
        {/* Delete button - only shown when hovering over placed stickers */}
        {sticker.placed && isHovered && onDelete && (
          <div 
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-600 transition-colors z-20"
            onClick={handleDelete}
          >
            <Trash size={12} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sticker;
