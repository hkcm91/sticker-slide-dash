
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboardState } from '@/hooks/useDashboardState';
import { SelectionProvider } from '@/contexts/SelectionContext';
import { useStickerGroupHandlers } from '@/hooks/dashboard/useStickerGroupHandlers';
import { useToast } from '@/hooks/use-toast';
import { useKeyboardShortcuts } from '@/hooks/dashboard/useKeyboardShortcuts';
import DashboardLayout from './dashboard/DashboardLayout';

export const addCustomWidget = (name: string, title: string, content: string) => {
  // This function is now imported from useDashboardState
  // We re-export it here to maintain backward compatibility
  return import('@/hooks/useDashboardState').then(module => {
    return module.addCustomWidget(name, title, content);
  });
};

const Dashboard = () => {
  const { theme } = useTheme();
  const [showStorageMonitor, setShowStorageMonitor] = useState(false);
  const { toast } = useToast();
  
  const {
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
  } = useDashboardState();

  const {
    showLayerPanel,
    handleMultiMove,
    handleMultiResize,
    handleGroupStickers,
    handleUngroupStickers,
    handleMoveLayer,
    toggleLayerPanel
  } = useStickerGroupHandlers(stickers, handleUpdateSticker);

  // Use our keyboard shortcuts hook
  useKeyboardShortcuts({ toggleLayerPanel });

  // Double-click handler to toggle storage monitor for debugging
  const handleDoubleClick = (e: React.MouseEvent) => {
    // Only respond to double-clicks in the bottom-right corner
    if (e.clientX > window.innerWidth - 50 && e.clientY > window.innerHeight - 50) {
      setShowStorageMonitor(!showStorageMonitor);
    }
  };

  const handleToggleLock = (sticker: {id: string, locked?: boolean}) => {
    const stickerToUpdate = stickers.find(s => s.id === sticker.id);
    if (stickerToUpdate) {
      handleUpdateSticker({
        ...stickerToUpdate,
        locked: !stickerToUpdate.locked
      });
      
      toast({
        title: stickerToUpdate.locked ? "Sticker unlocked" : "Sticker locked",
        description: stickerToUpdate.locked ? "You can now move this sticker" : "This sticker is now locked in place",
        duration: 2000,
      });
    }
  };

  const handleChangeZIndex = (sticker: {id: string}, change: number) => {
    const stickerToUpdate = stickers.find(s => s.id === sticker.id);
    if (stickerToUpdate) {
      handleUpdateSticker({
        ...stickerToUpdate,
        zIndex: (stickerToUpdate.zIndex || 10) + change
      });
      
      toast({
        title: change > 0 ? "Moved Forward" : "Moved Backward",
        description: "Layer position changed",
        duration: 1500,
      });
    }
  };
  
  const handleToggleVisibility = (sticker: {id: string, hidden?: boolean}) => {
    const stickerToUpdate = stickers.find(s => s.id === sticker.id);
    if (stickerToUpdate) {
      handleUpdateSticker({
        ...stickerToUpdate,
        hidden: !stickerToUpdate.hidden
      });
      
      toast({
        title: stickerToUpdate.hidden ? "Sticker shown" : "Sticker hidden",
        description: stickerToUpdate.hidden ? "Sticker is now visible" : "Sticker is now hidden",
        duration: 2000,
      });
    }
  };

  // Combine all handlers for passing to layout
  const handlers = {
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
    handleImportStickers,
    handleToggleLock,
    handleChangeZIndex,
    handleToggleVisibility,
    handleMultiMove,
    handleMultiResize,
    handleGroupStickers,
    handleUngroupStickers,
    handleMoveLayer,
    toggleLayerPanel
  };

  return (
    <SelectionProvider stickers={stickers}>
      <DashboardLayout
        theme={theme}
        background={background}
        showHint={showHint}
        hasSeenHint={hasSeenHint}
        stickers={stickers}
        placedStickers={placedStickers}
        dockedStickers={dockedStickers}
        openWidgets={openWidgets}
        showStorageMonitor={showStorageMonitor}
        showLayerPanel={showLayerPanel}
        handlers={handlers}
        handleDoubleClick={handleDoubleClick}
      />
    </SelectionProvider>
  );
};

export default Dashboard;
