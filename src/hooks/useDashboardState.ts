
import { useState, useEffect } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { initializeWidgets } from '@/widgets/builtin';
import { useBackgroundAndHints } from './dashboard/useBackgroundAndHints';
import { useStickerHandlers } from './dashboard/useStickerHandlers';
import { initialStickers } from './dashboard/initialStickers';
import { initializeWidgetDataMap, addCustomWidget } from './dashboard/widgetDataInitializer';

export function useDashboardState() {
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const [openWidgets, setOpenWidgets] = useState<Map<string, { sticker: StickerType, isOpen: boolean }>>(new Map());
  
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
      setStickers(JSON.parse(savedStickers));
    } else {
      setStickers(initialStickers);
    }
  }, []);
  
  // Save stickers to localStorage
  useEffect(() => {
    if (stickers.length > 0) {
      localStorage.setItem('stickers', JSON.stringify(stickers));
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
