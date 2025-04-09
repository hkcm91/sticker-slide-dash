
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { Group } from 'lucide-react';
import LayerItem from './LayerItem';

interface LayerGroupProps {
  groupId: string;
  items: StickerType[];
  isExpanded: boolean;
  onToggleExpand: (groupId: string) => void;
  onToggleLock: (sticker: StickerType) => void;
  onMoveLayer: (stickerId: string, change: number) => void;
}

const LayerGroup: React.FC<LayerGroupProps> = ({
  groupId,
  items,
  isExpanded,
  onToggleExpand,
  onToggleLock,
  onMoveLayer
}) => {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md mb-2">
      <div 
        className="bg-gray-100 dark:bg-gray-800 p-2 cursor-pointer flex items-center justify-between"
        onClick={() => onToggleExpand(groupId)}
      >
        <div className="flex items-center">
          <Group className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Group</span>
        </div>
        <span className="text-xs text-gray-500">{items.length} items</span>
      </div>
      
      {isExpanded && (
        <div className="pl-2">
          {items.map(sticker => (
            <LayerItem 
              key={sticker.id}
              sticker={sticker}
              onToggleLock={onToggleLock}
              onMoveUp={() => onMoveLayer(sticker.id, 1)}
              onMoveDown={() => onMoveLayer(sticker.id, -1)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LayerGroup;
