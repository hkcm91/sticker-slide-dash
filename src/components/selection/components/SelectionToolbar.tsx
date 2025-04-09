
import React from 'react';
import { Button } from '@/components/ui/button';
import { Group, Ungroup } from 'lucide-react';

interface SelectionToolbarProps {
  onGroupClick: () => void;
  onUngroupClick: () => void;
  canGroup: boolean;
  hasSelectedGroup: boolean;
  isAllSameGroup: boolean;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  onGroupClick,
  onUngroupClick,
  canGroup,
  hasSelectedGroup,
  isAllSameGroup
}) => {
  // Only show group button when we have multiple stickers selected and they're not already grouped
  const showGroupButton = canGroup && !isAllSameGroup;
  
  // Show ungroup when we have a single group selected or multiple stickers from same group
  const showUngroupButton = hasSelectedGroup || isAllSameGroup;
  
  if (!showGroupButton && !showUngroupButton) return null;
  
  return (
    <div className="absolute -top-9 right-0 flex space-x-1">
      {showGroupButton && (
        <Button 
          size="sm" 
          variant="secondary"
          className="h-7 bg-black/85 hover:bg-black text-white text-xs font-medium border-0"
          onClick={onGroupClick}
        >
          <Group className="h-3.5 w-3.5 mr-1" />
          Group
        </Button>
      )}
      
      {showUngroupButton && (
        <Button 
          size="sm" 
          variant="secondary"
          className="h-7 bg-black/85 hover:bg-black text-white text-xs font-medium border-0"
          onClick={onUngroupClick}
        >
          <Ungroup className="h-3.5 w-3.5 mr-1" />
          Ungroup
        </Button>
      )}
    </div>
  );
};

export default SelectionToolbar;
