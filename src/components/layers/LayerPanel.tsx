
import React, { useState } from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
  Group, 
  Ungroup,
  Square,
  SquareCheck
} from 'lucide-react';
import { useSelection } from '@/contexts/SelectionContext';
import LayerItem from './LayerItem';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Sort stickers by z-index (highest first)
  const sortedStickers = [...placedStickers].sort((a, b) => 
    (b.zIndex || 0) - (a.zIndex || 0)
  );

  const handleToggleLock = (sticker: StickerType) => {
    onStickerUpdate({
      ...sticker,
      locked: !sticker.locked
    });
    
    toast({
      title: sticker.locked ? "Sticker unlocked" : "Sticker locked",
      description: sticker.locked ? "The sticker can now be moved and edited." : "The sticker is now locked in place.",
      duration: 2000,
    });
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
      <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span>Layers</span>
          {sortedStickers.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {sortedStickers.length}
            </Badge>
          )}
        </h3>
        
        <div className="flex items-center gap-1">
          <Button 
            size="sm" 
            variant={isMultiSelectMode ? "default" : "outline"}
            onClick={toggleMultiSelectMode}
            className="text-xs h-8"
          >
            {isMultiSelectMode ? (
              <>
                <SquareCheck className="h-3.5 w-3.5 mr-1" />
                Done
              </>
            ) : (
              <>
                <Square className="h-3.5 w-3.5 mr-1" />
                Select
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isMultiSelectMode && (
        <div className="p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-wrap items-center gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={selectAll}
            className="text-xs h-7"
          >
            Select All
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={clearSelection}
            className="text-xs h-7"
          >
            Clear
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleGroupSelected}
            disabled={!canGroup}
            className="text-xs h-7"
          >
            <Group className="h-3.5 w-3.5 mr-1" />
            Group
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleUngroupSelected}
            disabled={!hasGroupSelected}
            className="text-xs h-7"
          >
            <Ungroup className="h-3.5 w-3.5 mr-1" />
            Ungroup
          </Button>
        </div>
      )}
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sortedStickers.length === 0 ? (
            <div className="text-center p-4 text-sm text-gray-500">
              No stickers placed on the dashboard
            </div>
          ) : (
            <div className="space-y-1">
              {groupedStickers.map((item, index) => {
                if (Array.isArray(item)) {
                  // This is a group
                  const groupId = item[0].groupId;
                  const isExpanded = expandedGroups.has(groupId!);
                  
                  return (
                    <div key={`group-${groupId}`} className="border border-gray-200 dark:border-gray-800 rounded-md mb-2">
                      <div 
                        className="bg-gray-100 dark:bg-gray-800 p-2 cursor-pointer flex items-center justify-between"
                        onClick={() => toggleGroupExpansion(groupId!)}
                      >
                        <div className="flex items-center">
                          <Group className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Group</span>
                        </div>
                        <span className="text-xs text-gray-500">{item.length} items</span>
                      </div>
                      
                      {isExpanded && (
                        <div className="pl-2">
                          {item.map(sticker => (
                            <LayerItem 
                              key={sticker.id}
                              sticker={sticker}
                              onToggleLock={handleToggleLock}
                              onMoveUp={() => onMoveLayer(sticker.id, 1)}
                              onMoveDown={() => onMoveLayer(sticker.id, -1)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
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
                    />
                  );
                }
              })}
            </div>
          )}
        </div>
      </ScrollArea>
      
      {selectedStickers.size > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-800 p-2 bg-blue-50 dark:bg-blue-950">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Selected</span>
            <Badge variant="secondary">{selectedStickers.size}</Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerPanel;
