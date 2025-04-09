
import React, { useRef, useState, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';
import { useToast } from '@/hooks/use-toast';
import { Group } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SelectionOverlayProps {
  placedStickers: StickerType[];
  onMultiMove: (stickerIds: string[], deltaX: number, deltaY: number) => void;
  onMultiResize: (stickerIds: string[], scaleRatio: number) => void;
  onGroupStickers?: (stickerIds: string[]) => void;
}

const SelectionOverlay: React.FC<SelectionOverlayProps> = ({
  placedStickers,
  onMultiMove,
  onMultiResize,
  onGroupStickers
}) => {
  const { selectedStickers, isMultiSelectMode, clearSelection } = useSelection();
  const [boundingBox, setBoundingBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [showTools, setShowTools] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Calculate bounding box for selected stickers
  useEffect(() => {
    if (selectedStickers.size === 0) {
      setShowTools(false);
      return;
    }
    
    const selectedStickerObjs = placedStickers.filter(s => selectedStickers.has(s.id));
    
    if (selectedStickerObjs.length === 0) {
      setShowTools(false);
      return;
    }
    
    setShowTools(true);
    
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
    
    // Add padding to the bounding box
    setBoundingBox({
      x: minX - 5,
      y: minY - 5,
      width: maxX - minX + 10,
      height: maxY - minY + 10
    });
  }, [selectedStickers, placedStickers]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedStickers.size === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragStartPos({ x, y });
    
    // Show a toast when starting to drag multiple items
    if (selectedStickers.size > 1) {
      toast({
        title: `Moving ${selectedStickers.size} items`,
        duration: 2000,
      });
    }
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
    
    // Show a toast when resizing multiple items
    if (selectedStickers.size > 1) {
      toast({
        title: `Resizing ${selectedStickers.size} items`,
        duration: 1000,
      });
    }
  };
  
  const handleGroupClick = () => {
    if (onGroupStickers && selectedStickers.size > 1) {
      onGroupStickers([...selectedStickers]);
      clearSelection();
    }
  };
  
  if (selectedStickers.size === 0 || !isMultiSelectMode || !showTools) return null;
  
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
      {/* Selection count badge */}
      <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium">
        {selectedStickers.size} selected
      </div>
      
      {/* Quick tools */}
      <div className="absolute -top-8 right-0 flex space-x-1">
        {onGroupStickers && selectedStickers.size > 1 && (
          <Button 
            size="sm" 
            variant="secondary"
            className="h-7 text-xs font-medium"
            onClick={handleGroupClick}
          >
            <Group className="h-3.5 w-3.5 mr-1" />
            Group
          </Button>
        )}
      </div>
      
      {/* Resize handle */}
      <div 
        className="absolute -right-3 -bottom-3 w-6 h-6 bg-blue-500 rounded-full cursor-se-resize flex items-center justify-center"
        title="Drag to resize or use mouse wheel"
      >
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default SelectionOverlay;
