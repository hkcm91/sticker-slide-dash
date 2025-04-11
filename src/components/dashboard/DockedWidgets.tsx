
import React from 'react';
import { Sticker as StickerType } from '@/types/stickers';
import { Card } from '@/components/ui/card';
import { X, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWidgetDataById } from '@/hooks/dashboard/widgetDataInitializer';
import WidgetRenderer from '@/components/widgets/WidgetRenderer';

interface DockedWidgetsProps {
  dockedWidgets: StickerType[];
  onUndockWidget?: (sticker: StickerType) => void;
  onCloseWidget?: (sticker: StickerType) => void;
  readOnly?: boolean;
}

/**
 * Displays widgets that have been docked to the bottom of the screen
 */
const DockedWidgets: React.FC<DockedWidgetsProps> = ({ 
  dockedWidgets, 
  onUndockWidget, 
  onCloseWidget,
  readOnly = false
}) => {
  if (dockedWidgets.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 flex justify-center gap-4 z-20">
      <div className="flex gap-3 flex-wrap justify-center">
        {dockedWidgets.map(sticker => {
          const widgetData = getWidgetDataById(sticker.widgetType || '');
          
          if (!widgetData) return null;
          
          return (
            <Card 
              key={sticker.id} 
              className="w-72 h-52 shadow-lg relative overflow-hidden flex flex-col border-2 border-primary/20"
            >
              {!readOnly && (
                <div className="absolute top-1 right-1 flex gap-1 z-10">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 rounded-full bg-background/80 hover:bg-background"
                    onClick={() => onUndockWidget && onUndockWidget(sticker)}
                  >
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 rounded-full bg-background/80 hover:bg-background text-destructive hover:text-destructive"
                    onClick={() => onCloseWidget && onCloseWidget(sticker)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              <div className="flex-1 overflow-auto">
                <WidgetRenderer
                  sticker={sticker}
                  widgetData={widgetData}
                  className="h-full"
                  hideHeader={true}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DockedWidgets;
