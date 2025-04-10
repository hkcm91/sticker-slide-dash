
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { 
  useStickerDragHandlers, 
  useStickerWidgetHandlers, 
  useStickerManagementHandlers 
} from './stickerHandlers';
import { useBackgroundAndHints } from './useBackgroundAndHints';
import { addCustomWidget } from './widgetDataInitializer';
import { useToast } from '@/hooks/use-toast';

export function useStickerHandlers(
  stickers: StickerType[],
  setStickers: React.Dispatch<React.SetStateAction<StickerType[]>>,
  setOpenWidgets: React.Dispatch<React.SetStateAction<Map<string, { sticker: StickerType, isOpen: boolean }>>>
) {
  const { toast } = useToast();
  
  // Get handlers from separated hooks
  const {
    isRepositioning,
    handleDragStart: dragStartHandler,
    handleDrop: dropHandler,
    handleDragOver
  } = useStickerDragHandlers();

  const {
    handleStickerClick: stickerClickHandler,
    handleCloseModal: closeModalHandler,
    handleDockWidget: dockWidgetHandler,
    handleUndockWidget: undockWidgetHandler
  } = useStickerWidgetHandlers();

  const {
    handleStickerDelete: stickerDeleteHandler,
    handleUpdateSticker: updateStickerHandler,
    handleStickerCreated: stickerCreatedHandler,
    handleImportStickers: importStickersHandler
  } = useStickerManagementHandlers();

  // Import background and hints
  const {
    background,
    hasSeenHint,
    showHint,
    handleBackgroundChange
  } = useBackgroundAndHints();

  const updateLastUsedTimestamp = (stickerId: string) => {
    setStickers(prevStickers => 
      prevStickers.map(sticker => 
        sticker.id === stickerId
          ? { ...sticker, lastUsed: new Date().toISOString() }
          : sticker
      )
    );
  };
  
  const handleStickerClick = (sticker: StickerType) => {
    // Show debug toast for each sticker click
    toast({
      title: "Sticker Clicked",
      description: `Sticker: ${sticker.name || 'Unnamed'} (ID: ${sticker.id.substr(0, 5)}...)`,
      duration: 1500,
    });
    
    // Update timestamp but don't modify position/placement state
    updateLastUsedTimestamp(sticker.id);
    
    // Call widget handlers without modifying the sticker placement state
    stickerClickHandler(sticker, setOpenWidgets);
  };

  // Create wrapper functions that provide the required dependencies
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => {
    dragStartHandler(e, sticker);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const updateFunction = dropHandler(e);
    setStickers(updateFunction);
  };

  const handleCloseModal = (stickerId: string) => {
    closeModalHandler(stickerId, setOpenWidgets);
  };

  const handleDockWidget = (sticker: StickerType) => {
    dockWidgetHandler(sticker, setOpenWidgets, setStickers);
  };

  const handleUndockWidget = (sticker: StickerType) => {
    undockWidgetHandler(sticker, setStickers);
  };

  const handleStickerDelete = (sticker: StickerType) => {
    stickerDeleteHandler(sticker, setStickers, setOpenWidgets);
  };

  const handleUpdateSticker = (updatedSticker: StickerType) => {
    // Add debug toast
    toast({
      title: "Sticker Updated",
      description: `Sticker: ${updatedSticker.name || 'Unnamed'} (ID: ${updatedSticker.id.substr(0, 5)}...)`,
      duration: 1500,
    });
    
    updateStickerHandler(updatedSticker, setStickers, setOpenWidgets);
  };

  const handleStickerCreated = (newSticker: StickerType) => {
    stickerCreatedHandler(newSticker, setStickers);
  };

  const handleImportStickers = (importedStickers: StickerType[]) => {
    importStickersHandler(importedStickers, setStickers);
  };

  const enhancedHandlers = {
    handleStickerClick: (sticker: StickerType) => {
      updateLastUsedTimestamp(sticker.id);
      handleStickerClick(sticker);
    },
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => {
      updateLastUsedTimestamp(sticker.id);
      dragStartHandler(e, sticker);
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
    placedStickers,
    dockedStickers,
    background,
    hasSeenHint,
    showHint,
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
