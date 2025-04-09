
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Group, Ungroup } from 'lucide-react';

interface LayerSelectionControlsProps {
  onSelectAll: () => void;
  onClearSelection: () => void;
  onGroupSelected: () => void;
  onUngroupSelected: () => void;
  canGroup: boolean;
  hasGroupSelected: boolean;
}

const LayerSelectionControls: React.FC<LayerSelectionControlsProps> = ({
  onSelectAll,
  onClearSelection,
  onGroupSelected,
  onUngroupSelected,
  canGroup,
  hasGroupSelected
}) => {
  return (
    <div className="p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-wrap items-center gap-1">
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={onSelectAll}
        className="text-xs h-7"
      >
        Select All
      </Button>
      
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={onClearSelection}
        className="text-xs h-7"
      >
        Clear
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={onGroupSelected}
        disabled={!canGroup}
        className="text-xs h-7"
      >
        <Group className="h-3.5 w-3.5 mr-1" />
        Group
      </Button>
      
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={onUngroupSelected}
        disabled={!hasGroupSelected}
        className="text-xs h-7"
      >
        <Ungroup className="h-3.5 w-3.5 mr-1" />
        Ungroup
      </Button>
    </div>
  );
};

export default LayerSelectionControls;
