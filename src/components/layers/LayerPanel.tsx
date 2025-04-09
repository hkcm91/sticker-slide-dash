
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSelection } from '@/contexts/SelectionContext';
import { useToast } from '@/hooks/use-toast';
import {
  LayerItem,
  LayerGroup,
  LayerHeader,
  LayerSelectionControls,
  LayerFooter,
  LayerNoContent
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
  const { toast } = useToast();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

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

  const handleGroupSelected = () => {
    if (selectedStickers.size > 1) {
      onGroupStickers([...selectedStickers]);
      clearSelection();
      
      toast({
        title: "Stickers grouped",
        description: `${selectedStickers.size} stickers have been grouped together.`,
        duration: 2000,
      });
    }
  };

  const handleUngroupSelected = () => {
    const selectedArray = [...selectedStickers];
    if (selectedArray.length === 1) {
      const sticker = placedStickers.find(s => s.id === selectedArray[0]);
      if (sticker && sticker.groupId) {
        onUngroupStickers(sticker.groupId);
        clearSelection();
        
        toast({
          title: "Group disbanded",
          description: "The stickers have been ungrouped.",
          duration: 2000,
        });
      }
    }
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
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

  // Check if any selected stickers are part of a group
  const hasGroupSelected = [...selectedStickers].some(id => {
    const sticker = placedStickers.find(s => s.id === id);
    return sticker && sticker.groupId;
  });

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
          onGroupSelected={handleGroupSelected}
          onUngroupSelected={handleUngroupSelected}
          canGroup={canGroup}
          hasGroupSelected={hasGroupSelected}
        />
      )}
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sortedStickers.length === 0 ? (
            <LayerNoContent />
          ) : (
            <div className="space-y-1">
              {groupedStickers.map((item, index) => {
                if (Array.isArray(item)) {
                  // This is a group
                  const groupId = item[0].groupId;
                  const isExpanded = expandedGroups.has(groupId!);
                  
                  return (
                    <LayerGroup 
                      key={`group-${groupId}`}
                      groupId={groupId!}
                      items={item}
                      isExpanded={isExpanded}
                      onToggleExpand={toggleGroupExpansion}
                      onToggleLock={handleToggleLock}
                      onMoveLayer={onMoveLayer}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  );
                } else {
                  // This is an individual sticker
                  return (
                    <LayerItem 
                      key={item.id}
                      sticker={item}
                      onToggleLock={handleToggleLock}
                      onMoveUp={() => onMoveLayer(item.id, 1)}
                      onMoveDown={() => onMoveLayer(item.id, -1)}
                      onToggleVisibility={() => handleToggleVisibility(item)}
                    />
                  );
                }
              })}
            </div>
          )}
        </div>
      </ScrollArea>
      
      <LayerFooter selectedCount={selectedStickers.size} />
    </div>
  );
};

export default LayerPanel;
