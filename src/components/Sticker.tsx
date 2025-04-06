
import React, { useState, useRef, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { cn } from '@/lib/utils';
import { Trash, RotateCw } from 'lucide-react';
import Lottie from 'lottie-react';

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
  onDragStart, 
  onClick, 
  isDraggable, 
  className,
  onDelete,
  onUpdate
}: StickerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [size, setSize] = useState(sticker.size || 60); // Use sticker's size or default
  const [rotation, setRotation] = useState(sticker.rotation || 0); // Use sticker's rotation or default
  const stickerRef = useRef<HTMLDivElement>(null);
  const [lottieData, setLottieData] = useState<any>(null);
  
  // Load Lottie animation if available
  useEffect(() => {
    if (sticker.animation && sticker.animationType === 'lottie') {
      try {
        const animationData = typeof sticker.animation === 'string' && sticker.animation.startsWith('{') 
          ? JSON.parse(sticker.animation) 
          : sticker.animation;
        setLottieData(animationData);
      } catch (e) {
        console.error('Failed to parse Lottie animation:', e);
      }
    }
  }, [sticker.animation, sticker.animationType]);

  // Effect to update the sticker in parent component when size or rotation changes
  useEffect(() => {
    if (sticker.placed && onUpdate) {
      onUpdate({
        ...sticker,
        size,
        rotation
      });
    }
  }, [size, rotation, sticker.placed]);

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

  // Add keyboard event handler for rotation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isHovered && e.key.toLowerCase() === 'r') {
        setRotation((prev) => (prev + 15) % 360);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHovered]);

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the widget
    setRotation((prev) => (prev + 15) % 360);
  };

  // Render the sticker content based on type
  const renderStickerContent = () => {
    if (sticker.animationType === 'lottie' && lottieData) {
      return <Lottie animationData={lottieData} loop={true} className="w-full h-full p-2" />;
    } else {
      return (
        <img 
          src={sticker.icon} 
          alt={sticker.name} 
          className="w-full h-full p-2" 
          draggable={false}
          style={{ backgroundColor: 'transparent' }}
        />
      );
    }
  };

  return (
    <div
      ref={stickerRef}
      className={cn(
        'select-none cursor-pointer rounded-full flex items-center justify-center transition-all',
        isDragging ? 'opacity-50' : 'opacity-100',
        isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
        className?.includes('sticker-in-tray') && !sticker.placed ? 
          'border-4 border-white shadow-md hover:shadow-lg transition-all duration-200 bg-white' : '',
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
              transform: `rotate(${rotation}deg)`,
              zIndex: 10,
              transition: 'transform 0.2s ease'
            } 
          : {}
      }
    >
      <div className="w-full h-full flex items-center justify-center relative">
        {renderStickerContent()}
        
        {/* Controls - only shown when hovering over placed stickers */}
        {sticker.placed && isHovered && (
          <>
            {/* Delete button */}
            {onDelete && (
              <div 
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-600 transition-colors z-20"
                onClick={handleDelete}
                title="Delete sticker"
              >
                <Trash size={12} />
              </div>
            )}
            
            {/* Rotate button */}
            <div 
              className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors z-20"
              onClick={handleRotate}
              title="Rotate sticker (or press R)"
            >
              <RotateCw size={12} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sticker;
