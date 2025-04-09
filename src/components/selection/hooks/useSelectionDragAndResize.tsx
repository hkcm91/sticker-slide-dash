
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useSelectionDragAndResize(
  selectedStickers: Set<string>,
  onMultiMove: (stickerIds: string[], deltaX: number, deltaY: number) => void,
  onMultiResize: (stickerIds: string[], scaleRatio: number) => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const { toast } = useToast();
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedStickers.size === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragStartPos({ x, y });
    
    // Show feedback when starting to drag
    if (selectedStickers.size > 0) {
      document.body.style.cursor = 'grabbing';
    }
  }, [selectedStickers]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    // Prevent text selection while dragging
    e.preventDefault();
    
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const deltaX = x - dragStartPos.x;
    const deltaY = y - dragStartPos.y;
    
    // Only update if we've moved at least 2px (to avoid tiny movements)
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      onMultiMove([...selectedStickers], deltaX, deltaY);
      setDragStartPos({ x, y });
    }
  }, [isDragging, dragStartPos, selectedStickers, onMultiMove]);
  
  const handleMouseUp = useCallback(() => {
    if (isDragging && selectedStickers.size > 0) {
      toast({
        title: "Items repositioned",
        description: `Moved ${selectedStickers.size} item${selectedStickers.size > 1 ? 's' : ''}`,
        duration: 1500,
      });
      
      document.body.style.cursor = 'default';
    }
    setIsDragging(false);
  }, [isDragging, selectedStickers, toast]);
  
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    if (selectedStickers.size === 0) return;
    
    // Scale ratio - increase or decrease size by 5% with Shift key, 2% without
    const scaleRatio = e.deltaY < 0 
      ? (e.shiftKey ? 1.05 : 1.02)  // Zoom in
      : (e.shiftKey ? 0.95 : 0.98); // Zoom out
    
    onMultiResize([...selectedStickers], scaleRatio);
    
    // Show feedback for resize
    if (!isDragging) {
      toast({
        title: `Resizing ${selectedStickers.size} sticker${selectedStickers.size > 1 ? 's' : ''}`,
        description: "Use Shift for larger adjustments",
        duration: 1000,
      });
    }
  }, [selectedStickers, onMultiResize, isDragging, toast]);
  
  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel
  };
}
