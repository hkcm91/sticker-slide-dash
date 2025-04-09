
import { useState, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { initializeWidgets } from '@/widgets/builtin';
import { useBackgroundAndHints } from './dashboard/useBackgroundAndHints';
import { useStickerHandlers } from './dashboard/useStickerHandlers';
import { initialStickers } from './dashboard/initialStickers';
import { initializeWidgetDataMap, addCustomWidget } from './dashboard/widgetDataInitializer';
import { useToast } from '@/hooks/use-toast';
import { saveStickersToStorage, loadStickersFromStorage } from '@/utils/compressionUtils';
import { performScheduledCleanup } from '@/utils/stickerCleanupUtils';

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
    
    // Load stickers from storage with recovery options
    const loadedStickers = loadStickersFromStorage(initialStickers);
    setStickers(loadedStickers);
  }, []);
  
  // Save stickers to localStorage with compression and error handling
  useEffect(() => {
    if (stickers.length > 0) {
      const saved = saveStickersToStorage(stickers);
      
      if (!saved) {
        console.warn("Failed to save stickers to localStorage even with compression");
      }
    }
  }, [stickers]);
  
  // Automatic cleanup effect
  useEffect(() => {
    // Perform scheduled cleanup check
    if (stickers.length > 0) {
      // Run after a short delay to avoid interfering with initial load
      const cleanupTimer = setTimeout(() => {
        const cleaned = performScheduledCleanup(stickers, setStickers);
        
        if (cleaned) {
          console.log("Automatic sticker cleanup performed");
        }
      }, 5000);
      
      return () => clearTimeout(cleanupTimer);
    }
  }, [stickers]);

  // Update lastUsed timestamp when interacting with stickers
  const updateLastUsedTimestamp = (stickerId: string) => {
    setStickers(prevStickers => 
      prevStickers.map(sticker => 
        sticker.id === stickerId
          ? { ...sticker, lastUsed: new Date().toISOString() }
          : sticker
      )
    );
  };

  // Enhance the original handlers with timestamp updates
  const enhancedHandlers = {
    handleStickerClick: (sticker: StickerType) => {
      updateLastUsedTimestamp(sticker.id);
      handleStickerClick(sticker);
    },
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => {
      updateLastUsedTimestamp(sticker.id);
      handleDragStart(e, sticker);
    },
    handleUpdateSticker: (updatedSticker: StickerType) => {
      updatedSticker.lastUsed = new Date().toISOString();
      handleUpdateSticker(updatedSticker);
    }
  };

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
    handleDragStart: enhancedHandlers.handleDragStart,
    handleDrop,
    handleDragOver,
    handleStickerClick: enhancedHandlers.handleStickerClick,
    handleCloseModal,
    handleDockWidget,
    handleUndockWidget,
    handleBackgroundChange,
    handleStickerDelete,
    handleUpdateSticker: enhancedHandlers.handleUpdateSticker,
    handleStickerCreated,
    handleImportStickers
  };
}

export { addCustomWidget };
