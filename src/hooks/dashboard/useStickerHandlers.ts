
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { 
  useStickerDragHandlers, 
  useStickerWidgetHandlers, 
  useStickerManagementHandlers 
} from './stickerHandlers';

export function useStickerHandlers(
  stickers: StickerType[],
  setStickers: React.Dispatch<React.SetStateAction<StickerType[]>>,
  setOpenWidgets: React.Dispatch<React.SetStateAction<Map<string, { sticker: StickerType, isOpen: boolean }>>>
) {
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

  // Create wrapper functions that provide the required dependencies
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => {
    dragStartHandler(e, sticker);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const updateFunction = dropHandler(e);
    setStickers(updateFunction);
  };

  const handleStickerClick = (sticker: StickerType) => {
    stickerClickHandler(sticker, setOpenWidgets);
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
    updateStickerHandler(updatedSticker, setStickers, setOpenWidgets);
  };

  const handleStickerCreated = (newSticker: StickerType) => {
    stickerCreatedHandler(newSticker, setStickers);
  };

  const handleImportStickers = (importedStickers: StickerType[]) => {
    importStickersHandler(importedStickers, setStickers);
  };

  return {
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
  };
}
