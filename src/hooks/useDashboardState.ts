
import { useState, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { initializeWidgets } from '@/widgets/builtin';
import { useBackgroundAndHints } from './dashboard/useBackgroundAndHints';
import { useStickerHandlers } from './dashboard/useStickerHandlers';
import { initialStickers } from './dashboard/initialStickers';
import { initializeWidgetDataMap, addCustomWidget } from './dashboard/widgetDataInitializer';
import { useToast } from '@/hooks/use-toast';
import { saveStickersToStorage, loadStickersFromStorage } from '@/utils/compressionUtils';

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
