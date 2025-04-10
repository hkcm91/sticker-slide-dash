
import { RefObject, useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';

interface UseResizeProps {
  selection: string[];
  placedStickers: StickerType[];
  onMultiResize: (stickerIds: string[], scaleRatio: number) => void;
  setIsResizing: (isResizing: boolean) => void;
  setInitialMousePosition: (position: { x: number; y: number }) => void;
  resizeRef: RefObject<{ startWidth: number; startHeight: number }>;
}

export function useResize({
  selection,
  placedStickers,
  onMultiResize,
  setIsResizing,
  setInitialMousePosition,
  resizeRef
}: UseResizeProps) {
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (selection.length === 0) return;
    
    setIsResizing(true);
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
    
    // Calculate bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    selection.forEach(stickerId => {
      const sticker = placedStickers.find(s => s.id === stickerId);
      if (sticker) {
        minX = Math.min(minX, sticker.position.x);
        minY = Math.min(minY, sticker.position.y);
        maxX = Math.max(maxX, sticker.position.x + sticker.size);
        maxY = Math.max(maxY, sticker.position.y + sticker.size);
      }
    });
    
    if (resizeRef.current) {
      resizeRef.current.startWidth = maxX - minX;
      resizeRef.current.startHeight = maxY - minY;
    }
  }, [selection, placedStickers, setIsResizing, setInitialMousePosition, resizeRef]);
  
  const handleResizeMove = useCallback((e: React.MouseEvent, initialWidth: number, initialHeight: number, startX: number, startY: number) => {
    if (selection.length === 0 || !resizeRef.current) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    // Calculate scale ratio based on diagonal movement
    const newWidth = initialWidth + deltaX;
    const newHeight = initialHeight + deltaY;
    
    if (newWidth <= 0 || newHeight <= 0) return;
    
    const oldDiagonal = Math.sqrt(initialWidth * initialWidth + initialHeight * initialHeight);
    const newDiagonal = Math.sqrt(newWidth * newWidth + newHeight * newHeight);
    
    const scaleRatio = newDiagonal / oldDiagonal;
    
    onMultiResize(selection, scaleRatio);
  }, [selection, onMultiResize, resizeRef]);
  
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, [setIsResizing]);
  
  return {
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd
  };
}
