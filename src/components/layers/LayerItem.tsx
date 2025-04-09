
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { useSelection } from '@/contexts/SelectionContext';
import { MoveUp, MoveDown, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface LayerItemProps {
  sticker: StickerType;
  onToggleLock: (sticker: StickerType) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  sticker,
  onToggleLock,
  onMoveUp,
  onMoveDown
}) => {
  const { isMultiSelectMode, isSelected, toggleSelection } = useSelection();

  const handleClick = (e: React.MouseEvent) => {
    if (isMultiSelectMode) {
      toggleSelection(sticker.id, e.shiftKey);
    }
  };

  return (
    <div 
      className={cn(
        "flex items-center px-2 py-1.5 rounded-md text-sm mb-1",
        isMultiSelectMode && "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
        isSelected(sticker.id) && "bg-blue-100 dark:bg-blue-900 border-l-2 border-blue-500",
        sticker.locked && "opacity-70"
      )}
      onClick={handleClick}
    >
      {isMultiSelectMode ? (
        <Checkbox 
          checked={isSelected(sticker.id)}
          className="mr-2"
          onCheckedChange={() => toggleSelection(sticker.id, false)}
        />
      ) : (
        <div className="w-5 flex justify-center">
          {sticker.type === 'image' ? '🖼️' : sticker.type === 'custom' ? '🧩' : '📝'}
        </div>
      )}
      
      <div className="flex-1 truncate ml-1 font-medium">
        {sticker.name || `Sticker ${sticker.id.slice(0, 4)}`}
      </div>
      
      <div className="flex items-center gap-1">
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-6 w-6"
          onClick={(e) => { e.stopPropagation(); onToggleLock(sticker); }}
        >
          {sticker.locked ? 
            <Lock className="h-3 w-3" /> : 
            <Unlock className="h-3 w-3" />
          }
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-6 w-6"
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
        >
          <MoveUp className="h-3 w-3" />
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-6 w-6"
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
        >
          <MoveDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default LayerItem;
