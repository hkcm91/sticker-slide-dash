
import { Sticker as StickerType } from '@/types/stickers';
import { useToast } from '@/hooks/use-toast';

export function useStickerWidgetHandlers() {
  const { toast } = useToast();

  const handleStickerClick = (
    sticker: StickerType, 
    setOpenWidgets: React.Dispatch<React.SetStateAction<Map<string, { sticker: StickerType, isOpen: boolean }>>>
  ) => {
    // Debug information
    console.log("Widget click handler called for sticker:", sticker.id, sticker.name);
    
    // FIXED: Don't modify the sticker's placement, just handle widget opening
    // Only open widget if the sticker is placed
    if (sticker.placed) {
      setOpenWidgets(prev => {
        const newMap = new Map(prev);
        
        // If widget is already open, don't change anything
        if (prev.has(sticker.id) && prev.get(sticker.id)?.isOpen) {
          console.log("Widget already open:", sticker.id);
          return prev;
        }
        
        // Show toast for better visual feedback
        toast({
          title: "Opening widget",
          description: `Opening ${sticker.name || "widget"} (ID: ${sticker.id.substring(0, 5)}...)`,
          duration: 2000
        });
        
        console.log("Opening widget for sticker:", sticker.id);
        newMap.set(sticker.id, { sticker, isOpen: true });
        return newMap;
      });
    } else {
      console.log("Sticker not placed, widget not opened");
      
      // Show toast for better visual feedback
      toast({
        title: "Can't open widget",
        description: "Sticker must be placed on dashboard to open widget",
        variant: "destructive",
        duration: 2000
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
    
    toast({
      title: "Widget closed",
      description: `Widget ID: ${stickerId.substring(0, 5)}...`,
      duration: 1500,
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
