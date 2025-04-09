
import { Sticker as StickerType } from '@/types/stickers';
import { useToast } from '@/hooks/use-toast';
import { getWidgetData, registerWidgetData } from '@/utils/widgetRegistry';

export function useStickerManagementHandlers() {
  const { toast } = useToast();

  const handleStickerDelete = (
    sticker: StickerType,
    setStickers: React.Dispatch<React.SetStateAction<StickerType[]>>,
    setOpenWidgets: React.Dispatch<React.SetStateAction<Map<string, { sticker: StickerType, isOpen: boolean }>>>
  ) => {
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
            ? { ...s, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0, docked: false } 
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

  const handleUpdateSticker = (
    updatedSticker: StickerType,
    setStickers: React.Dispatch<React.SetStateAction<StickerType[]>>,
    setOpenWidgets: React.Dispatch<React.SetStateAction<Map<string, { sticker: StickerType, isOpen: boolean }>>>
  ) => {
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

  const handleStickerCreated = (
    newSticker: StickerType,
    setStickers: React.Dispatch<React.SetStateAction<StickerType[]>>
  ) => {
    setStickers(prevStickers => [...prevStickers, newSticker]);
    
    if (!getWidgetData(newSticker.name)) {
      registerWidgetData(newSticker.name, `${newSticker.name}`, 
        `This is a custom sticker you created. You can connect it to a widget by updating the widgetType property.`
      );
    }
  };

  const handleImportStickers = (
    importedStickers: StickerType[],
    setStickers: React.Dispatch<React.SetStateAction<StickerType[]>>
  ) => {
    setStickers(prevStickers => [...prevStickers, ...importedStickers]);
    
    toast({
      title: "Stickers imported!",
      description: `${importedStickers.length} stickers have been added to your collection.`,
      duration: 3000,
    });
  };

  return {
    handleStickerDelete,
    handleUpdateSticker,
    handleStickerCreated,
    handleImportStickers
  };
}
