
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sticker as StickerType } from '@/types/stickers';
import { WidgetData } from '@/types/stickers';
import PomodoroWidgetUI from './widgets/PomodoroWidget';
import { getWidget } from '@/lib/widgetAPI';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { ClipboardCopy, Check, Clipboard, PlusCircle, MinusCircle, RefreshCcw, ToggleLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface WidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sticker: StickerType | null;
  widgetData: WidgetData | null;
}

const WidgetModal = ({ isOpen, onClose, sticker, widgetData }: WidgetModalProps) => {
  const [widgetState, setWidgetState] = useState<any>({});
  const [actionHistory, setActionHistory] = useState<string[]>([]);
  
  // Update widget state periodically
  useEffect(() => {
    if (!sticker || !sticker.widgetType) return;
    
    const widget = getWidget(sticker.widgetType);
    if (!widget) return;
    
    // Initial state fetch
    try {
      const state = widget.getState();
      setWidgetState(state);
    } catch (e) {
      console.error(`Error getting widget state for ${sticker.widgetType}:`, e);
    }
    
    // Set up interval to refresh state
    const interval = setInterval(() => {
      try {
        const state = widget.getState();
        setWidgetState(state);
      } catch (e) {
        console.error(`Error getting widget state for ${sticker.widgetType}:`, e);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sticker]);

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

  // Function to handle widget actions
  const handleWidgetAction = (action: string) => {
    if (!sticker?.widgetType) return;
    
    const widget = getWidget(sticker.widgetType);
    if (!widget) return;
    
    try {
      const result = widget.trigger(action, null);
      
      // Add to action history
      setActionHistory(prev => [
        `${new Date().toLocaleTimeString()}: ${action} - ${result ? 'success' : 'failed'}`, 
        ...prev.slice(0, 9)
      ]);
      
      // Update state immediately
      setWidgetState(widget.getState());
    } catch (e) {
      console.error(`Error triggering action ${action} on widget ${sticker.widgetType}:`, e);
    }
  };

  // Determine if we have a custom component for this widget type
  const renderWidgetContent = () => {
    if (sticker.widgetType === 'Pomodoro') {
      return <PomodoroWidgetUI widgetName="Pomodoro" />;
    }
    
    // Check if there's a registered widget for this type
    if (sticker.widgetType && getWidget(sticker.widgetType)) {
      // Get widget actions to display buttons
      const actions: string[] = [];
      
      // Try to determine available actions by testing common ones
      const commonActions = ['increment', 'decrement', 'reset', 'toggle'];
      commonActions.forEach(action => {
        try {
          const widget = getWidget(sticker.widgetType!);
          if (widget?.trigger) {
            const result = widget.trigger(action, null);
            if (result === true) {
              actions.push(action);
            }
          }
        } catch (e) {
          // Ignore errors as we're just probing for available actions
        }
      });
      
      // Reset state after probing
      const widget = getWidget(sticker.widgetType);
      if (widget) {
        setWidgetState(widget.getState());
      }
      
      return (
        <div className="py-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-2">Widget State:</h3>
              <pre className="text-xs overflow-auto max-h-40 bg-gray-100 p-3 rounded-md">
                {JSON.stringify(widgetState, null, 2)}
              </pre>
            </CardContent>
          </Card>
          
          {actions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Actions:</h3>
              <div className="flex flex-wrap gap-2">
                {actions.includes('increment') && (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleWidgetAction('increment')}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle size={16} />
                    Increment
                  </Button>
                )}
                
                {actions.includes('decrement') && (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleWidgetAction('decrement')}
                    className="flex items-center gap-1"
                  >
                    <MinusCircle size={16} />
                    Decrement
                  </Button>
                )}
                
                {actions.includes('reset') && (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleWidgetAction('reset')}
                    className="flex items-center gap-1"
                  >
                    <RefreshCcw size={16} />
                    Reset
                  </Button>
                )}
                
                {actions.includes('toggle') && (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleWidgetAction('toggle')}
                    className="flex items-center gap-1"
                  >
                    <ToggleLeft size={16} />
                    Toggle
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {actionHistory.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Actions:</h3>
              <div className="bg-gray-50 p-2 rounded-md max-h-32 overflow-y-auto">
                {actionHistory.map((action, i) => (
                  <div key={i} className="text-xs text-gray-600 mb-1">{action}</div>
                ))}
              </div>
            </div>
          )}
          
          <Separator />
          
          <div>
            <p className="text-sm text-gray-600">{widgetData.content}</p>
            {sticker.packageUrl && (
              <p className="text-xs text-gray-500 mt-1">Source: {sticker.packageUrl}</p>
            )}
          </div>
        </div>
      );
    }
    
    // Default content if no special widget is available
    return <div className="py-4">{widgetData.content}</div>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
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
