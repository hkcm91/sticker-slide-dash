
import React from 'react';
import { Layers, Square, SquareCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LayerHeaderProps {
  isMultiSelectMode: boolean;
  totalStickers: number;
  toggleMultiSelectMode: () => void;
}

const LayerHeader: React.FC<LayerHeaderProps> = ({
  isMultiSelectMode,
  totalStickers,
  toggleMultiSelectMode
}) => {
  return (
    <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Layers className="h-4 w-4" />
        <span>Layers</span>
        {totalStickers > 0 && (
          <Badge variant="secondary" className="ml-2">
            {totalStickers}
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
  );
};

export default LayerHeader;
