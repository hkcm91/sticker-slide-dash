
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { getWidgetData } from '@/utils/widgetRegistry';
import DockableWidget from '../widgets/DockableWidget';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';

interface DockedWidgetsProps {
  dockedWidgets: StickerType[];
  onUndockWidget: (sticker: StickerType) => void;
  onCloseWidget: (sticker: StickerType) => void;
}

const DockedWidgets: React.FC<DockedWidgetsProps> = ({ 
  dockedWidgets,
  onUndockWidget,
  onCloseWidget
}) => {
  if (dockedWidgets.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-background/70 backdrop-blur-md border-t border-border z-10">
      <ResizablePanelGroup direction="horizontal" className="max-h-[300px]">
        {dockedWidgets.map((sticker, index) => {
          const widgetData = getWidgetData(sticker.name);
          if (!widgetData) return null;

          return (
            <React.Fragment key={sticker.id}>
              <ResizablePanel defaultSize={100 / dockedWidgets.length}>
                <div className="h-full p-2">
                  <DockableWidget
                    sticker={sticker}
                    widgetData={widgetData}
                    onClose={() => onCloseWidget(sticker)}
                    onUndock={onUndockWidget}
                  />
                </div>
              </ResizablePanel>
              {index < dockedWidgets.length - 1 && (
                <ResizableHandle withHandle />
              )}
            </React.Fragment>
          );
        })}
      </ResizablePanelGroup>
    </div>
  );
};

export default DockedWidgets;
