
import React, { useRef, useState, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';

interface SelectionOverlayProps {
  placedStickers: StickerType[];
  onMultiMove: (stickerIds: string[], deltaX: number, deltaY: number) => void;
  onMultiResize: (stickerIds: string[], scaleRatio: number) => void;
}

const SelectionOverlay: React.FC<SelectionOverlayProps> = ({
  placedStickers,
  onMultiMove,
  onMultiResize
}) => {
  const { selectedStickers, isMultiSelectMode } = useSelection();
  const [boundingBox, setBoundingBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Calculate bounding box for selected stickers
  useEffect(() => {
    if (selectedStickers.size === 0) return;
    
    const selectedStickerObjs = placedStickers.filter(s => selectedStickers.has(s.id));
    
    if (selectedStickerObjs.length === 0) return;
    
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    selectedStickerObjs.forEach(sticker => {
      const size = sticker.size || 60;
      const x = sticker.position.x;
      const y = sticker.position.y;
      
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + size);
      maxY = Math.max(maxY, y + size);
    });
    
    setBoundingBox({
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    });
  }, [selectedStickers, placedStickers]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedStickers.size === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragStartPos({ x, y });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const deltaX = x - dragStartPos.x;
    const deltaY = y - dragStartPos.y;
    
    // Only update if we've moved at least 5px (to avoid tiny movements)
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      onMultiMove([...selectedStickers], deltaX, deltaY);
      setDragStartPos({ x, y });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    if (selectedStickers.size === 0) return;
    
    // Scale ratio - increase or decrease size by 5%
    const scaleRatio = e.deltaY < 0 ? 1.05 : 0.95;
    
    onMultiResize([...selectedStickers], scaleRatio);
  };
  
  if (selectedStickers.size === 0 || !isMultiSelectMode) return null;
  
  return (
    <div 
      ref={overlayRef}
      className="absolute border-2 border-dashed border-blue-500 bg-blue-100/20 z-50 cursor-move"
      style={{
        left: `${boundingBox.x}px`,
        top: `${boundingBox.y}px`,
        width: `${boundingBox.width}px`,
        height: `${boundingBox.height}px`,
        pointerEvents: 'all'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <div className="absolute -right-2 -bottom-2 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize" />
    </div>
  );
};

export default SelectionOverlay;
