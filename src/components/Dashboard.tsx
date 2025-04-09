
import React from 'react';
import StickerSidebar from './sidebar/StickerSidebar';
import ThemeCustomizer from './ThemeCustomizer';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboardState } from '@/hooks/useDashboardState';
import DashboardContainer from './dashboard/DashboardContainer';
import WidgetModals from './dashboard/WidgetModals';

export const addCustomWidget = (name: string, title: string, content: string) => {
  // This function is now imported from useDashboardState
  // We re-export it here to maintain backward compatibility
  return import('@/hooks/useDashboardState').then(module => {
    return module.addCustomWidget(name, title, content);
  });
};

const Dashboard = () => {
  const { theme } = useTheme();
  const {
    stickers,
    background,
    openWidgets,
    hasSeenHint,
    showHint,
    placedStickers,
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleStickerClick,
    handleCloseModal,
    handleBackgroundChange,
    handleStickerDelete,
    handleUpdateSticker,
    handleStickerCreated,
    handleImportStickers
  } = useDashboardState();

  return (
    <div className={`flex h-screen overflow-hidden ${theme.mode === 'dark' ? 'dark' : ''}`}>
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
      
      <DashboardContainer
        background={background}
        showHint={showHint}
        hasSeenHint={hasSeenHint}
        placedStickers={placedStickers}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        onStickerClick={handleStickerClick}
        onStickerDelete={handleStickerDelete}
        onStickerUpdate={handleUpdateSticker}
      />
      
      <ThemeCustomizer 
        onBackgroundChange={handleBackgroundChange} 
        currentBackground={background} 
      />
      
      <WidgetModals 
        openWidgets={openWidgets}
        onCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default Dashboard;
