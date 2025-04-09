
import { useState, useRef, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';

interface UseStickerInteractionsProps {
  sticker: StickerType;
  onUpdate?: (sticker: StickerType) => void;
}

interface StickerInteractions {
  isDragging: boolean;
  isHovered: boolean;
  size: number;
  rotation: number;
  stickerRef: React.RefObject<HTMLDivElement>;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragEnd: () => void;
  handleRotate: (e: React.MouseEvent) => void;
  handleResize: (e: React.WheelEvent) => void;
  setIsHovered: (value: boolean) => void;
}

export const useStickerInteractions = ({ 
  sticker, 
  onUpdate 
}: UseStickerInteractionsProps): StickerInteractions => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [size, setSize] = useState(sticker.size || 60);
  const [rotation, setRotation] = useState(sticker.rotation || 0);
  const stickerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sticker.placed && onUpdate) {
      onUpdate({
        ...sticker,
        size,
        rotation
      });
    }
  }, [size, rotation, sticker.placed]);

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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.setData('stickerId', sticker.id);
    
    if (stickerRef.current) {
      const rect = stickerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      e.dataTransfer.setData('offsetX', String(offsetX));
      e.dataTransfer.setData('offsetY', String(offsetY));
      
      e.dataTransfer.setDragImage(stickerRef.current, offsetX, offsetY);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((prev) => (prev + 15) % 360);
  };

  const handleResize = (e: React.WheelEvent) => {
    if (sticker.placed) {
      e.preventDefault();
      
      const newSize = e.deltaY < 0 ? size + 5 : size - 5;
      setSize(Math.max(30, Math.min(120, newSize)));
    }
  };

  return {
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
  };
};
