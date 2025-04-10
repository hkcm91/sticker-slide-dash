
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sticker as StickerType } from '@/types/stickers';
import { LayerGroup, LayerItem, LayerNoContent } from './index';

interface LayerPanelContentProps {
  stickers: StickerType[];
  groupedStickers: (StickerType | StickerType[])[];
  expandedGroups: Set<string>;
  onToggleExpand: (groupId: string) => void;
  onToggleLock: (sticker: StickerType) => void;
  onMoveLayer: (stickerId: string, change: number) => void;
  onToggleVisibility?: (sticker: StickerType) => void;
}

/**
 * Content area of the layer panel displaying stickers and groups
 */
const LayerPanelContent: React.FC<LayerPanelContentProps> = ({
  stickers,
  groupedStickers,
  expandedGroups,
  onToggleExpand,
  onToggleLock,
  onMoveLayer,
  onToggleVisibility
}) => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {stickers.length === 0 ? (
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
                    onToggleExpand={onToggleExpand}
                    onToggleLock={onToggleLock}
                    onMoveLayer={onMoveLayer}
                    onToggleVisibility={onToggleVisibility}
                  />
                );
              } else {
                // This is an individual sticker
                return (
                  <LayerItem 
                    key={item.id}
                    sticker={item}
                    onToggleLock={onToggleLock}
                    onMoveUp={() => onMoveLayer(item.id, 1)}
                    onMoveDown={() => onMoveLayer(item.id, -1)}
                    onToggleVisibility={onToggleVisibility ? () => onToggleVisibility(item) : undefined}
                  />
                );
              }
            })}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default LayerPanelContent;
