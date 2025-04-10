
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sticker as StickerType } from '@/types/stickers';
import StickerSidebar from '../sidebar/StickerSidebar';
import DashboardContainer from './DashboardContainer';
import ThemeCustomizer from '../ThemeCustomizer';
import WidgetModals from './WidgetModals';
import LayerPanel from '../layers/LayerPanel';
import DashboardActions from './DashboardActions';
import SelectionOverlay from '../selection/SelectionOverlay';
import StorageMonitor from '../debug/StorageMonitor';

interface DashboardLayoutProps {
  theme: { mode: string; sidebarStyle: "default" | "minimal" | "colorful" };
  background: string | null;
  showHint: boolean;
  hasSeenHint: boolean;
  stickers: StickerType[];
  placedStickers: StickerType[];
  dockedStickers: StickerType[];
  openWidgets: Map<string, { sticker: StickerType, isOpen: boolean }>;
  showStorageMonitor: boolean;
  showLayerPanel: boolean;
  handlers: {
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, sticker: StickerType) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleStickerClick: (sticker: StickerType) => void;
    handleCloseModal: (stickerId: string) => void;
    handleDockWidget: (sticker: StickerType) => void;
    handleUndockWidget: (sticker: StickerType) => void;
    handleBackgroundChange: (url: string | null) => void;
    handleStickerDelete: (sticker: StickerType) => void;
    handleUpdateSticker: (sticker: StickerType) => void;
    handleStickerCreated: (sticker: StickerType) => void;
    handleImportStickers: (stickers: StickerType[]) => void;
    handleToggleLock: (sticker: StickerType) => void;
    handleChangeZIndex: (sticker: StickerType, change: number) => void;
    handleToggleVisibility: (sticker: StickerType) => void;
    handleMultiMove: (stickerIds: string[], deltaX: number, deltaY: number) => void;
    handleMultiResize: (stickerIds: string[], scaleRatio: number) => void;
    handleGroupStickers: (stickerIds: string[]) => void;
    handleUngroupStickers: (groupId: string) => void;
    handleMoveLayer: (stickerId: string, change: number) => void;
    toggleLayerPanel: () => void;
  };
  handleDoubleClick: (e: React.MouseEvent) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  theme,
  background,
  showHint,
  hasSeenHint,
  stickers,
  placedStickers,
  dockedStickers,
  openWidgets,
  showStorageMonitor,
  showLayerPanel,
  handlers,
  handleDoubleClick
}) => {
  return (
    <div 
      className={`flex h-screen overflow-hidden ${theme.mode === 'dark' ? 'dark' : ''}`}
      onDoubleClick={handleDoubleClick}
    >
      <StickerSidebar 
        stickers={stickers} 
        onDragStart={handlers.handleDragStart} 
        onStickerClick={handlers.handleStickerClick}
        onStickerCreated={handlers.handleStickerCreated}
        onStickerDelete={handlers.handleStickerDelete}
        onStickerUpdate={handlers.handleUpdateSticker}
        onImportStickers={handlers.handleImportStickers}
        sidebarStyle={theme.sidebarStyle}
      />
      
      <div className="flex-1 flex relative">
        <DashboardContainer
          background={background}
          showHint={showHint}
          hasSeenHint={hasSeenHint}
          placedStickers={placedStickers}
          dockedStickers={dockedStickers}
          onDragOver={handlers.handleDragOver}
          onDrop={handlers.handleDrop}
          onDragStart={handlers.handleDragStart}
          onStickerClick={handlers.handleStickerClick}
          onStickerDelete={handlers.handleStickerDelete}
          onStickerUpdate={handlers.handleUpdateSticker}
          onUndockWidget={handlers.handleUndockWidget}
          onCloseDockedWidget={handlers.handleStickerDelete}
          onToggleLock={handlers.handleToggleLock}
          onChangeZIndex={handlers.handleChangeZIndex}
          onToggleVisibility={handlers.handleToggleVisibility}
        >
          <SelectionOverlay
            placedStickers={placedStickers}
            onMultiMove={handlers.handleMultiMove}
            onMultiResize={handlers.handleMultiResize}
            onGroupStickers={handlers.handleGroupStickers}
            onUngroupStickers={handlers.handleUngroupStickers}
          />
        </DashboardContainer>
        
        {showLayerPanel && (
          <LayerPanel 
            placedStickers={placedStickers}
            onStickerUpdate={handlers.handleUpdateSticker}
            onGroupStickers={handlers.handleGroupStickers}
            onUngroupStickers={handlers.handleUngroupStickers}
            onMoveLayer={handlers.handleMoveLayer}
            onToggleLock={handlers.handleToggleLock}
            onToggleVisibility={handlers.handleToggleVisibility}
          />
        )}
        
        <DashboardActions 
          showLayerPanel={showLayerPanel}
          toggleLayerPanel={handlers.toggleLayerPanel}
        />
      </div>
      
      <ThemeCustomizer 
        onBackgroundChange={handlers.handleBackgroundChange} 
        currentBackground={background} 
      />
      
      <WidgetModals 
        openWidgets={openWidgets}
        onCloseModal={handlers.handleCloseModal}
        onDockWidget={handlers.handleDockWidget}
      />
      
      <StorageMonitor 
        visible={showStorageMonitor} 
        stickers={stickers}
        onImportStickers={handlers.handleImportStickers}
      />
    </div>
  );
};

export default DashboardLayout;
