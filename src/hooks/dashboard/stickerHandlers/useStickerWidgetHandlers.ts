
import { Sticker as StickerType } from '@/types/stickers';
import { useToast } from '@/hooks/use-toast';

export function useStickerWidgetHandlers() {
  const { toast } = useToast();

  const handleStickerClick = (
    sticker: StickerType, 
    setOpenWidgets: React.Dispatch<React.SetStateAction<Map<string, { sticker: StickerType, isOpen: boolean }>>>
  ) => {
    if (sticker.placed) {
      setOpenWidgets(prev => {
        const newMap = new Map(prev);
        newMap.set(sticker.id, { sticker, isOpen: true });
        return newMap;
      });
    }
  };

  const handleCloseModal = (
    stickerId: string,
    setOpenWidgets: React.Dispatch<React.SetStateAction<Map<string, { sticker: StickerType, isOpen: boolean }>>>
  ) => {
    setOpenWidgets(prev => {
      const newMap = new Map(prev);
      newMap.delete(stickerId);
      return newMap;
    });
  };

  const handleDockWidget = (
    sticker: StickerType,
    setOpenWidgets: React.Dispatch<React.SetStateAction<Map<string, { sticker: StickerType, isOpen: boolean }>>>,
    setStickers: React.Dispatch<React.SetStateAction<StickerType[]>>
  ) => {
    // Close the modal if it's open
    setOpenWidgets(prev => {
      const newMap = new Map(prev);
      newMap.delete(sticker.id);
      return newMap;
    });
    
    // Update the sticker to be docked
    setStickers(prevStickers => 
      prevStickers.map(s => 
        s.id === sticker.id 
          ? { ...s, docked: true }
          : s
      )
    );
    
    toast({
      title: "Widget docked!",
      description: "The widget has been docked to the bottom of the dashboard.",
      duration: 3000,
    });
  };

  const handleUndockWidget = (
    sticker: StickerType,
    setStickers: React.Dispatch<React.SetStateAction<StickerType[]>>
  ) => {
    // Update the sticker to be undocked
    setStickers(prevStickers => 
      prevStickers.map(s => 
        s.id === sticker.id 
          ? { ...s, docked: false }
          : s
      )
    );
    
    toast({
      title: "Widget undocked!",
      description: "The widget has been undocked from the dashboard.",
      duration: 3000,
    });
  };

  return {
    handleStickerClick,
    handleCloseModal,
    handleDockWidget,
    handleUndockWidget
  };
}
