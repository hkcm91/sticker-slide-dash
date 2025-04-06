
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sticker as StickerType } from '@/types/stickers';
import { WidgetData } from '@/types/stickers';
import PomodoroWidgetUI from './widgets/PomodoroWidget';
import { getWidget } from '@/lib/widgetAPI';
import { Button } from './ui/button';

interface WidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sticker: StickerType | null;
  widgetData: WidgetData | null;
}

const WidgetModal = ({ isOpen, onClose, sticker, widgetData }: WidgetModalProps) => {
  if (!sticker || !widgetData) return null;

  // Initialize the widget if it hasn't been yet
  if (sticker.widgetType) {
    const widget = getWidget(sticker.widgetType);
    if (widget) {
      try {
        widget.init();
      } catch (e) {
        console.error(`Error initializing widget ${sticker.widgetType}:`, e);
      }
    }
  }

  // Determine if we have a custom component for this widget type
  const renderWidgetContent = () => {
    if (sticker.widgetType === 'Pomodoro') {
      return <PomodoroWidgetUI widgetName="Pomodoro" />;
    }
    
    // Check if there's a registered widget for this type
    if (sticker.widgetType && getWidget(sticker.widgetType)) {
      // This is a simple widget with API but no custom UI
      const widget = getWidget(sticker.widgetType);
      const state = widget?.getState() || {};
      
      // Get widget actions to display buttons
      const actions: string[] = [];
      
      // Try to determine available actions by testing common ones
      const commonActions = ['start', 'stop', 'reset', 'refresh', 'increment', 'decrement', 'toggle'];
      commonActions.forEach(action => {
        try {
          // We'll need to check if the trigger method exists before trying to call it
          if (widget?.trigger) {
            // Call the trigger method and store the result
            const result = widget.trigger(action, null);
            // Check if the result is explicitly true
            if (result === true) {
              actions.push(action);
            }
          }
        } catch (e) {
          // Ignore errors as we're just probing for available actions
        }
      });
      
      return (
        <div className="py-4">
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <h3 className="text-sm font-medium mb-2">Widget State:</h3>
            <pre className="text-xs overflow-auto max-h-40">
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
          
          {actions.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Actions:</h3>
              <div className="flex flex-wrap gap-2">
                {actions.map(action => (
                  <Button 
                    key={action}
                    size="sm"
                    variant="outline"
                    onClick={() => widget?.trigger(action)}
                    className="capitalize"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-600">{widgetData.content}</p>
        </div>
      );
    }
    
    // Default content if no special widget is available
    return <div className="py-4">{widgetData.content}</div>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center">
              {sticker.animationType === 'lottie' ? (
                <span className="text-xs">Lottie</span>
              ) : (
                <img src={sticker.icon} alt={sticker.name} className="w-6 h-6" />
              )}
            </div>
            {widgetData.title}
          </DialogTitle>
          <DialogDescription>
            {sticker.widgetType 
              ? `This is a ${sticker.widgetType} widget with special functionality.` 
              : sticker.isCustom
                ? "This is a custom sticker. You can connect it to a widget by updating its widgetType property."
                : "This is a simple widget that will be expanded in the future."}
          </DialogDescription>
        </DialogHeader>
        {renderWidgetContent()}
      </DialogContent>
    </Dialog>
  );
};

export default WidgetModal;
