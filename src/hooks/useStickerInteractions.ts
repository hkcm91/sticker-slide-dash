
import { useState, useRef, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useStickerEffects } from './useStickerEffects';

interface UseStickerInteractionsProps {
  sticker: StickerType;
  onUpdate?: (sticker: StickerType) => void;
}

interface StickerInteractions {
  isDragging: boolean;
  isHovered: boolean;
  size: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  stickerRef: React.RefObject<HTMLDivElement>;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragEnd: () => void;
  handleRotate: () => void;
  handleResize: (e: React.WheelEvent) => void;
  handleOpacityChange: (opacity: number) => void;
  setIsHovered: (value: boolean) => void;
  getStickerStyle: () => React.CSSProperties;
  getStickerTypeClasses: (className?: string) => string;
}

export const useStickerInteractions = ({ 
  sticker, 
  onUpdate 
}: UseStickerInteractionsProps): StickerInteractions => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [size, setSize] = useState(sticker.size || 60);
  const [rotation, setRotation] = useState(sticker.rotation || 0);
  const [opacity, setOpacity] = useState(sticker.opacity || 1);
  const [zIndex, setZIndex] = useState(sticker.zIndex || 10);
  const stickerRef = useRef<HTMLDivElement>(null);
  
  // Use the extracted effects hook
  const isVisuallyHidden = sticker.hidden;
  const { getStickerStyle, getStickerTypeClasses } = useStickerEffects(
    sticker, 
    size, 
    rotation, 
    zIndex, 
    opacity, 
    isVisuallyHidden
  );
  
  // Update local state when sticker props change
  useEffect(() => {
    setSize(sticker.size || 60);
    setRotation(sticker.rotation || 0);
    setOpacity(sticker.opacity || 1);
    setZIndex(sticker.zIndex || 10);
  }, [sticker.size, sticker.rotation, sticker.opacity, sticker.zIndex]);
  
  // Update the sticker when local state changes
  // FIX: Only call onUpdate when values have actually changed to avoid infinite loop
  useEffect(() => {
    if (sticker.placed && onUpdate && 
        (size !== sticker.size || 
         rotation !== sticker.rotation || 
         opacity !== sticker.opacity || 
         zIndex !== sticker.zIndex)) {
      onUpdate({
        ...sticker,
        size,
        rotation,
        opacity,
        zIndex
      });
    }
  }, [size, rotation, opacity, zIndex, sticker.placed, onUpdate, sticker]);

  // Keyboard shortcuts for sticker manipulation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHovered || sticker.locked) return;
      
      if (e.key.toLowerCase() === 'r') {
        // Rotate sticker with R key
        setRotation((prev) => (prev + 15) % 360);
      } else if (e.key === '[') {
        // Decrease opacity with [ key
        setOpacity((prev) => Math.max(0.1, prev - 0.1));
      } else if (e.key === ']') {
        // Increase opacity with ] key
        setOpacity((prev) => Math.min(1, prev + 0.1));
      } else if (e.key === '-') {
        // Decrease z-index with - key
        setZIndex((prev) => Math.max(1, prev - 1));
      } else if (e.key === '=') {
        // Increase z-index with = key
        setZIndex((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHovered, sticker.locked]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (sticker.locked) return;
    
    setIsDragging(true);
    e.dataTransfer.setData('stickerId', sticker.id);
    
    if (stickerRef.current) {
      const rect = stickerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      e.dataTransfer.setData('offsetX', String(offsetX));
      e.dataTransfer.setData('offsetY', String(offsetY));
      
      // Optionally store the sticker type and properties for specialized drop handling
      if (sticker.type) {
        e.dataTransfer.setData('stickerType', sticker.type);
      }
      
      e.dataTransfer.setDragImage(stickerRef.current, offsetX, offsetY);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    if (sticker.locked) return;
    setRotation((prev) => (prev + 15) % 360);
  };

  const handleResize = (e: React.WheelEvent) => {
    if (sticker.locked || !sticker.placed) return;
    
    e.preventDefault();
    
    // Use Shift key to modify resize behavior
    const resizeFactor = e.shiftKey ? 2 : 5;
    const newSize = e.deltaY < 0 ? size + resizeFactor : size - resizeFactor;
    
    // Get min/max from sticker config or use defaults
    const minSize = sticker.widgetConfig?.size?.minWidth || 30;
    const maxSize = sticker.widgetConfig?.size?.maxWidth || 300;
    
    setSize(Math.max(minSize, Math.min(maxSize, newSize)));
  };

  const handleOpacityChange = (newOpacity: number) => {
    if (sticker.locked) return;
    
    setOpacity(Math.max(0.1, Math.min(1, newOpacity)));
  };

  return {
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
  };
};
