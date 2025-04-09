
import React, { useState, useEffect } from 'react';
import StickerSidebar from './sidebar/StickerSidebar';
import ThemeCustomizer from './ThemeCustomizer';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboardState } from '@/hooks/useDashboardState';
import DashboardContainer from './dashboard/DashboardContainer';
import WidgetModals from './dashboard/WidgetModals';
import StorageMonitor from './debug/StorageMonitor';
import { SelectionProvider } from '@/contexts/SelectionContext';
import SelectionOverlay from './selection/SelectionOverlay';
import LayerPanel from './layers/LayerPanel';
import { useStickerGroupHandlers } from '@/hooks/dashboard/useStickerGroupHandlers';
import { Button } from './ui/button';
import { Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  
  // Keyboard shortcut for toggle layer panel
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'l' && e.altKey) {
        toggleLayerPanel();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleLayerPanel]);

  return (
    <SelectionProvider stickers={stickers}>
      <div 
        className={`flex h-screen overflow-hidden ${theme.mode === 'dark' ? 'dark' : ''}`}
        onDoubleClick={handleDoubleClick}
      >
        <StickerSidebar 
          stickers={stickers} 
          onDragStart={handleDragStart} 
          onStickerClick={handleStickerClick}
          onStickerCreated={handleStickerCreated}
          onStickerDelete={handleStickerDelete}
          onStickerUpdate={handleUpdateSticker}
          onImportStickers={handleImportStickers}
          sidebarStyle={theme.sidebarStyle}
        />
        
        <div className="flex-1 flex relative">
          <DashboardContainer
            background={background}
            showHint={showHint}
            hasSeenHint={hasSeenHint}
            placedStickers={placedStickers}
            dockedStickers={dockedStickers}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onStickerClick={handleStickerClick}
            onStickerDelete={handleStickerDelete}
            onStickerUpdate={handleUpdateSticker}
            onUndockWidget={handleUndockWidget}
            onCloseDockedWidget={handleStickerDelete}
            onToggleLock={handleToggleLock}
            onChangeZIndex={handleChangeZIndex}
            onToggleVisibility={handleToggleVisibility}
          >
            <SelectionOverlay
              placedStickers={placedStickers}
              onMultiMove={handleMultiMove}
              onMultiResize={handleMultiResize}
              onGroupStickers={handleGroupStickers}
              onUngroupStickers={handleUngroupStickers}
            />
          </DashboardContainer>
          
          {showLayerPanel && (
            <LayerPanel 
              placedStickers={placedStickers}
              onStickerUpdate={handleUpdateSticker}
              onGroupStickers={handleGroupStickers}
              onUngroupStickers={handleUngroupStickers}
              onMoveLayer={handleMoveLayer}
              onToggleLock={handleToggleLock}
              onToggleVisibility={handleToggleVisibility}
            />
          )}
          
          <Button
            className="absolute bottom-4 right-4 z-50 rounded-full w-10 h-10 p-0 shadow-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
            onClick={toggleLayerPanel}
            title={showLayerPanel ? "Close layer panel" : "Open layer panel (Alt+L)"}
          >
            <Layers className="h-5 w-5" />
          </Button>
        </div>
        
        <ThemeCustomizer 
          onBackgroundChange={handleBackgroundChange} 
          currentBackground={background} 
        />
        
        <WidgetModals 
          openWidgets={openWidgets}
          onCloseModal={handleCloseModal}
          onDockWidget={handleDockWidget}
        />
        
        <StorageMonitor 
          visible={showStorageMonitor} 
          stickers={stickers}
          onImportStickers={handleImportStickers}
        />
      </div>
    </SelectionProvider>
  );
};

export default Dashboard;
