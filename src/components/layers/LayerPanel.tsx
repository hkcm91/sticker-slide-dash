
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Layers, 
  MoveUp, 
  MoveDown, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Group,
  Ungroup
} from 'lucide-react';
import { useSelection } from '@/contexts/SelectionContext';
import LayerItem from './LayerItem';

interface LayerPanelProps {
  placedStickers: StickerType[];
  onStickerUpdate: (sticker: StickerType) => void;
  onGroupStickers: (stickerIds: string[]) => void;
  onUngroupStickers: (groupId: string) => void;
  onMoveLayer: (stickerId: string, change: number) => void;
}

const LayerPanel: React.FC<LayerPanelProps> = ({
  placedStickers,
  onStickerUpdate,
  onGroupStickers,
  onUngroupStickers,
  onMoveLayer
}) => {
  const { 
    selectedStickers, 
    isMultiSelectMode, 
    toggleMultiSelectMode,
    selectAll,
    clearSelection 
  } = useSelection();

  // Sort stickers by z-index (highest first)
  const sortedStickers = [...placedStickers].sort((a, b) => 
    (b.zIndex || 0) - (a.zIndex || 0)
  );

  const handleToggleVisibility = (sticker: StickerType) => {
    onStickerUpdate({
      ...sticker,
      visible: sticker.visible === false ? true : false
    });
  };

  const handleToggleLock = (sticker: StickerType) => {
    onStickerUpdate({
      ...sticker,
      locked: !sticker.locked
    });
  };

  const handleGroupSelected = () => {
    if (selectedStickers.size > 1) {
      onGroupStickers([...selectedStickers]);
      clearSelection();
    }
  };

  const handleUngroupSelected = () => {
    const selectedArray = [...selectedStickers];
    if (selectedArray.length === 1) {
      const sticker = placedStickers.find(s => s.id === selectedArray[0]);
      if (sticker && sticker.groupId) {
        onUngroupStickers(sticker.groupId);
        clearSelection();
      }
    }
  };

  // Check if any selected stickers are part of a group
  const hasGroupSelected = [...selectedStickers].some(id => {
    const sticker = placedStickers.find(s => s.id === id);
    return sticker && sticker.groupId;
  });

  // Check if we can create a group from the selection
  const canGroup = selectedStickers.size > 1;

  return (
    <div className="w-64 h-full border-l border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-950">
      <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span>Layers</span>
        </h3>
        
        <div className="flex items-center gap-1">
          <Button 
            size="sm" 
            variant="outline"
            onClick={toggleMultiSelectMode}
            className={isMultiSelectMode ? "bg-blue-100 dark:bg-blue-900" : ""}
          >
            {isMultiSelectMode ? "Done" : "Select"}
          </Button>
        </div>
      </div>
      
      <div className="p-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-1">
        {isMultiSelectMode && (
          <>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={selectAll}
              className="text-xs h-8"
            >
              Select All
            </Button>
            
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={clearSelection}
              className="text-xs h-8"
            >
              Clear
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleGroupSelected}
              disabled={!canGroup}
              className="text-xs h-8"
            >
              <Group className="h-4 w-4 mr-1" />
              Group
            </Button>
            
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleUngroupSelected}
              disabled={!hasGroupSelected}
              className="text-xs h-8"
            >
              <Ungroup className="h-4 w-4 mr-1" />
              Ungroup
            </Button>
          </>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sortedStickers.length === 0 ? (
            <div className="text-center p-4 text-sm text-gray-500">
              No stickers placed on the dashboard
            </div>
          ) : (
            <div className="space-y-1">
              {sortedStickers.map(sticker => (
                <LayerItem 
                  key={sticker.id}
                  sticker={sticker}
                  onToggleLock={handleToggleLock}
                  onToggleVisibility={handleToggleVisibility}
                  onMoveUp={() => onMoveLayer(sticker.id, 1)}
                  onMoveDown={() => onMoveLayer(sticker.id, -1)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LayerPanel;
