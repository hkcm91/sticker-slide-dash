
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';
import { useLayerGroupOperations } from '@/hooks/layers/useLayerGroupOperations';
import { 
  LayerHeader, 
  LayerSelectionControls, 
  LayerFooter,
  LayerPanelContent,
  LayerKeyboardShortcuts
} from './components';

interface LayerPanelProps {
  placedStickers: StickerType[];
  onStickerUpdate: (sticker: StickerType) => void;
  onGroupStickers: (stickerIds: string[]) => void;
  onUngroupStickers: (groupId: string) => void;
  onMoveLayer: (stickerId: string, change: number) => void;
  onToggleLock?: (sticker: StickerType) => void;
  onToggleVisibility?: (sticker: StickerType) => void;
}

/**
 * Panel for managing layers and sticker ordering
 */
const LayerPanel: React.FC<LayerPanelProps> = ({
  placedStickers,
  onStickerUpdate,
  onGroupStickers,
  onUngroupStickers,
  onMoveLayer,
  onToggleLock,
  onToggleVisibility
}) => {
  const { 
    selectedStickers, 
    isMultiSelectMode, 
    toggleMultiSelectMode,
    selectAll,
    clearSelection 
  } = useSelection();

  // Custom hook for layer group operations
  const {
    expandedGroups,
    handleGroupClick,
    handleUngroupClick,
    toggleGroupExpansion,
    hasSelectedGroup,
    isAllSameGroup
  } = useLayerGroupOperations(placedStickers, onGroupStickers, onUngroupStickers);

  // Sort stickers by z-index (highest first)
  const sortedStickers = [...placedStickers].sort((a, b) => 
    (b.zIndex || 0) - (a.zIndex || 0)
  );

  const handleToggleLock = (sticker: StickerType) => {
    if (onToggleLock) {
      onToggleLock(sticker);
    }
  };
  
  const handleToggleVisibility = (sticker: StickerType) => {
    if (onToggleVisibility) {
      onToggleVisibility(sticker);
    }
  };

  // Group stickers by groupId
  const groupedStickers = sortedStickers.reduce((acc, sticker) => {
    if (!sticker.groupId) {
      acc.push(sticker);
      return acc;
    }
    
    // Find if we already added the group
    const groupIndex = acc.findIndex(item => 
      typeof item !== 'string' && 
      Array.isArray(item) && 
      item.length > 0 && 
      item[0].groupId === sticker.groupId
    );
    
    if (groupIndex >= 0) {
      (acc[groupIndex] as StickerType[]).push(sticker);
    } else {
      acc.push([sticker]);
    }
    
    return acc;
  }, [] as (StickerType | StickerType[])[]);

  // Check if we can create a group from the selection
  const canGroup = selectedStickers.size > 1;

  return (
    <div className="w-64 h-full border-l border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-950 shadow-lg">
      <LayerHeader 
        isMultiSelectMode={isMultiSelectMode}
        totalStickers={sortedStickers.length}
        toggleMultiSelectMode={toggleMultiSelectMode}
      />
      
      {isMultiSelectMode && (
        <LayerSelectionControls 
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
          onGroupSelected={handleGroupClick}
          onUngroupSelected={handleUngroupClick}
          canGroup={canGroup}
          hasGroupSelected={hasSelectedGroup}
        />
      )}
      
      <LayerPanelContent
        stickers={sortedStickers}
        groupedStickers={groupedStickers}
        expandedGroups={expandedGroups}
        onToggleExpand={toggleGroupExpansion}
        onToggleLock={handleToggleLock}
        onMoveLayer={onMoveLayer}
        onToggleVisibility={handleToggleVisibility}
      />
      
      <LayerFooter selectedCount={selectedStickers.size} />
      
      <LayerKeyboardShortcuts />
    </div>
  );
};

export default LayerPanel;
