
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useToast } from '@/hooks/use-toast';
import { getWidgetData, registerWidgetData } from '@/utils/widgetRegistry';

export function useStickerHandlers(
  stickers: StickerType[],
  setStickers: React.Dispatch<React.SetStateAction<StickerType[]>>,
  setOpenWidgets: React.Dispatch<React.SetStateAction<Map<string, { sticker: StickerType, isOpen: boolean }>>>
) {
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
    
    setStickers(prevStickers => 
      prevStickers.map(sticker => 
        sticker.id === stickerId 
          ? { ...sticker, position: { x, y }, placed: true } 
          : sticker
      )
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
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleStickerClick = (sticker: StickerType) => {
    if (sticker.placed) {
      setOpenWidgets(prev => {
        const newMap = new Map(prev);
        newMap.set(sticker.id, { sticker, isOpen: true });
        return newMap;
      });
    }
  };

  const handleCloseModal = (stickerId: string) => {
    setOpenWidgets(prev => {
      const newMap = new Map(prev);
      newMap.delete(stickerId);
      return newMap;
    });
  };

  const handleStickerDelete = (sticker: StickerType) => {
    if ((sticker as any).permanentDelete) {
      setStickers(prevStickers => 
        prevStickers.filter(s => s.id !== sticker.id)
      );
      
      toast({
        title: "Sticker permanently deleted",
        description: "The sticker has been completely removed from your collection.",
        variant: "destructive",
        duration: 3000,
      });
    } else {
      setStickers(prevStickers => {
        return prevStickers.map(s => 
          s.id === sticker.id 
            ? { ...s, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 } 
            : s
        );
      });
      
      setOpenWidgets(prev => {
        const newMap = new Map(prev);
        newMap.delete(sticker.id);
        return newMap;
      });
      
      toast({
        title: "Sticker returned to tray!",
        description: "The sticker has been returned to your tray and is available for reuse.",
        duration: 3000,
      });
    }
  };

  const handleUpdateSticker = (updatedSticker: StickerType) => {
    setStickers(prevStickers => 
      prevStickers.map(s => 
        s.id === updatedSticker.id ? updatedSticker : s
      )
    );
    
    setOpenWidgets(prev => {
      if (!prev.has(updatedSticker.id)) return prev;
      
      const newMap = new Map(prev);
      newMap.set(updatedSticker.id, { 
        sticker: updatedSticker, 
        isOpen: prev.get(updatedSticker.id)?.isOpen || false 
      });
      return newMap;
    });
  };

  const handleStickerCreated = (newSticker: StickerType) => {
    setStickers(prevStickers => [...prevStickers, newSticker]);
    
    if (!getWidgetData(newSticker.name)) {
      registerWidgetData(newSticker.name, `${newSticker.name}`, 
        `This is a custom sticker you created. You can connect it to a widget by updating the widgetType property.`
      );
    }
  };

  const handleImportStickers = (importedStickers: StickerType[]) => {
    setStickers(prevStickers => [...prevStickers, ...importedStickers]);
    
    toast({
      title: "Stickers imported!",
      description: `${importedStickers.length} stickers have been added to your collection.`,
      duration: 3000,
    });
  };

  return {
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleStickerClick,
    handleCloseModal,
    handleStickerDelete,
    handleUpdateSticker,
    handleStickerCreated,
    handleImportStickers
  };
}
