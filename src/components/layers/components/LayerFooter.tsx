
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface LayerFooterProps {
  selectedCount: number;
}

const LayerFooter: React.FC<LayerFooterProps> = ({ selectedCount }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 p-2 bg-blue-50 dark:bg-blue-950">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Selected</span>
        <Badge variant="secondary">{selectedCount}</Badge>
      </div>
    </div>
  );
};

export default LayerFooter;
