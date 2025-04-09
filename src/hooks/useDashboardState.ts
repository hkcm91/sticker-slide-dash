
import { useState, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { initializeWidgets } from '@/widgets/builtin';
import { useBackgroundAndHints } from './dashboard/useBackgroundAndHints';
import { useStickerHandlers } from './dashboard/useStickerHandlers';
import { initialStickers } from './dashboard/initialStickers';
import { initializeWidgetDataMap, addCustomWidget } from './dashboard/widgetDataInitializer';
import { useToast } from '@/hooks/use-toast';

// Helper to compress large sticker data before storage
const compressStickersForStorage = (stickers: StickerType[]): StickerType[] => {
  return stickers.map(sticker => {
    // Create a copy without bulky properties
    const storedSticker = { ...sticker };
    
    // Remove large animation data from storage if it's too big
    if (typeof storedSticker.animation === 'object' && JSON.stringify(storedSticker.animation).length > 10000) {
      storedSticker.animation = "large-animation-data-removed";
    }
    
    // Remove large widget data if it's too big
    if (storedSticker.widgetData && JSON.stringify(storedSticker.widgetData).length > 5000) {
      storedSticker.widgetData = { compressedNote: "Large widget data removed from storage" };
    }

    return storedSticker;
  });
};

export function useDashboardState() {
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const [openWidgets, setOpenWidgets] = useState<Map<string, { sticker: StickerType, isOpen: boolean }>>(new Map());
  const { toast } = useToast();
  
  const {
    background,
    hasSeenHint,
    showHint,
    handleBackgroundChange
  } = useBackgroundAndHints();
  
  const {
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleStickerClick,
    handleCloseModal,
    handleDockWidget,
    handleUndockWidget,
    handleStickerDelete,
    handleUpdateSticker,
    handleStickerCreated,
    handleImportStickers
  } = useStickerHandlers(stickers, setStickers, setOpenWidgets);
  
  // Initialize on mount
  useEffect(() => {
    // Initialize widget data map
    initializeWidgetDataMap();
    // Initialize built-in widgets
    initializeWidgets();
    
    const savedStickers = localStorage.getItem('stickers');
    if (savedStickers) {
      try {
        setStickers(JSON.parse(savedStickers));
      } catch (error) {
        console.error("Failed to parse saved stickers:", error);
        setStickers(initialStickers);
        toast({
          title: "Error loading saved stickers",
          description: "Your saved dashboard couldn't be loaded and has been reset.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } else {
      setStickers(initialStickers);
    }
  }, []);
  
  // Save stickers to localStorage with error handling
  useEffect(() => {
    if (stickers.length > 0) {
      try {
        // Compress stickers before storage
        const compressedStickers = compressStickersForStorage(stickers);
        
        // Try to save with increasing levels of compression if needed
        try {
          localStorage.setItem('stickers', JSON.stringify(compressedStickers));
        } catch (error) {
          if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            // If quota exceeded, try more aggressive compression
            const minimalStickers = compressedStickers.map(sticker => ({
              id: sticker.id,
              name: sticker.name,
              icon: sticker.icon,
              position: sticker.position,
              placed: sticker.placed,
              docked: sticker.docked,
              size: sticker.size,
              rotation: sticker.rotation,
              widgetType: sticker.widgetType,
              isCustom: sticker.isCustom
            }));
            
            localStorage.setItem('stickers', JSON.stringify(minimalStickers));
            console.warn("Using minimal sticker storage due to quota limits");
          } else {
            throw error; // Re-throw if it's not a quota error
          }
        }
      } catch (error) {
        console.error("Failed to save stickers to localStorage:", error);
        // Show user a warning toast
        toast({
          title: "Warning: Couldn't save dashboard state",
          description: "Your dashboard changes may not persist after refresh due to storage limitations.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  }, [stickers]);

  const placedStickers = stickers.filter(sticker => sticker.placed && !sticker.docked);
  const dockedStickers = stickers.filter(sticker => sticker.docked);

  return {
    stickers,
    background,
    openWidgets,
    hasSeenHint,
    showHint,
    placedStickers,
    dockedStickers,
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleStickerClick,
    handleCloseModal,
    handleDockWidget,
    handleUndockWidget,
    handleBackgroundChange,
    handleStickerDelete,
    handleUpdateSticker,
    handleStickerCreated,
    handleImportStickers
  };
}

export { addCustomWidget };
