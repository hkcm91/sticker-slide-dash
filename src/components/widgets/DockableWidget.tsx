
import React, { useState } from 'react';
import { X, Edit, ArrowUpLeft } from 'lucide-react';
import { Sticker as StickerType } from '@/types/stickers';
import { WidgetData } from '@/types/stickers';
import WidgetRenderer from './WidgetRenderer';

interface DockableWidgetProps {
  sticker: StickerType;
  widgetData: WidgetData;
  onClose: () => void;
  onEdit?: () => void;
  onUndock: (sticker: StickerType) => void;
}

const DockableWidget: React.FC<DockableWidgetProps> = ({
  sticker,
  widgetData,
  onClose,
  onEdit,
  onUndock,
}) => {
  const [showControls, setShowControls] = useState(false);

  const handleUndock = () => {
    onUndock(sticker);
  };

  return (
    <div 
      className="relative bg-background/90 backdrop-blur-md rounded-lg overflow-hidden shadow-md border border-border/20 transition-all"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={() => setShowControls(!showControls)}
    >
      {showControls && (
        <div className="absolute top-2 right-2 z-50 flex space-x-1 bg-background/80 backdrop-blur-sm rounded-md shadow-sm p-1">
          {onEdit && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-accent transition-colors"
              title="Edit widget"
            >
              <Edit size={14} />
            </button>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleUndock();
            }}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-accent transition-colors"
            title="Undock widget"
          >
            <ArrowUpLeft size={14} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-accent transition-colors"
            title="Close widget"
          >
            <X size={14} />
          </button>
        </div>
      )}
      
      <div className="p-1">
        <WidgetRenderer 
          sticker={sticker}
          widgetData={widgetData}
          className="border-none shadow-none"
          hideHeader={true}
        />
      </div>
    </div>
  );
};

export default DockableWidget;
