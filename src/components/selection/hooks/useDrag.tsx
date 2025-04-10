
import { RefObject, useCallback } from 'react';
import { Sticker as StickerType } from '@/types/stickers';

interface UseDragProps {
  selection: string[];
  placedStickers: StickerType[];
  onMultiMove: (stickerIds: string[], deltaX: number, deltaY: number) => void;
  setIsDragging: (isDragging: boolean) => void;
  setInitialMousePosition: (position: { x: number; y: number }) => void;
  dragRef: RefObject<{ startX: number; startY: number }>;
}

export function useDrag({
  selection,
  placedStickers,
  onMultiMove,
  setIsDragging,
  setInitialMousePosition,
  dragRef
}: UseDragProps) {
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (selection.length === 0) return;
    
    setIsDragging(true);
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
    
    if (dragRef.current) {
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    }
  }, [selection, setIsDragging, setInitialMousePosition, dragRef]);
  
  const handleDragMove = useCallback((e: React.MouseEvent) => {
    if (selection.length === 0 || !dragRef.current) return;
    
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      onMultiMove(selection, deltaX, deltaY);
      
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    }
  }, [selection, onMultiMove, dragRef]);
  
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);
  
  return {
    handleDragStart,
    handleDragMove,
    handleDragEnd
  };
}
