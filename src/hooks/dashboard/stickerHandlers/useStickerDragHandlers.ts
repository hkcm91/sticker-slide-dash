
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useToast } from '@/hooks/use-toast';

export function useStickerDragHandlers() {
  const [isRepositioning, setIsRepositioning] = useState(false);
  const { toast } = useToast();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => {
    e.dataTransfer.setData('stickerId', sticker.id);
    setIsRepositioning(sticker.placed);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const stickerId = e.dataTransfer.getData('stickerId');
    const offsetX = parseInt(e.dataTransfer.getData('offsetX') || '0', 10);
    const offsetY = parseInt(e.dataTransfer.getData('offsetY') || '0', 10);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;
    
    const updateSticker = (prevStickers: StickerType[]) => 
      prevStickers.map(sticker => 
        sticker.id === stickerId 
          ? { ...sticker, position: { x, y }, placed: true } 
          : sticker
      );
    
    if (isRepositioning) {
      toast({
        title: "Sticker repositioned!",
        description: "Your sticker has been moved to a new position.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Sticker placed!",
        description: "Click on the sticker to open the widget. Scroll to resize, R key to rotate, or return it to tray.",
        duration: 3000,
      });
    }
    
    setIsRepositioning(false);
    
    return updateSticker;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return {
    isRepositioning,
    handleDragStart,
    handleDrop,
    handleDragOver
  };
}
