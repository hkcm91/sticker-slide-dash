
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import useWidgetIframe from '@/hooks/useWidgetIframe';

interface WidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sticker: StickerType | null;
  widgetData: WidgetData | null;
}

const WidgetModal = ({ isOpen, onClose, sticker, widgetData }: WidgetModalProps) => {
  const [widgetState, setWidgetState] = useState<any>({});
  const [actionHistory, setActionHistory] = useState<string[]>([]);
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Use our custom hook for iframe widgets
  const { 
    isLoaded: iframeLoaded, 
    widgetState: iframeWidgetState 
  } = useWidgetIframe({
    widgetId: sticker?.widgetType,
    iframeRef
  });
  
  // Initialize the widget when it's opened
  useEffect(() => {
    if (!sticker || !sticker.widgetType || !isOpen) return;
    
    // Skip initialization for ZIP-based widgets as they're handled by the iframe
    if (sticker.packageUrl) return;
    
    const widget = getWidget(sticker.widgetType);
    if (!widget) return;
    
    try {
      // Initialize the widget
      widget.init();
      
      // Initial state fetch
      const state = widget.getState();
      setWidgetState(state);
      
      // Detect available actions without triggering them
      const actions = ['increment', 'decrement', 'reset', 'toggle'].filter(action => {
        try {
          return typeof widget.trigger === 'function';
        } catch (e) {
          return false;
        }
      });
      
      setAvailableActions(actions);
    } catch (e) {
      console.error(`Error initializing widget ${sticker.widgetType}:`, e);
    }
    
    // Set up interval to refresh state
    const interval = setInterval(() => {
      try {
        if (!sticker || !sticker.widgetType) return;
        
        // Skip for ZIP-based widgets
        if (sticker.packageUrl) return;
        
        const widget = getWidget(sticker.widgetType);
        if (!widget) return;
        
        const state = widget.getState();
        setWidgetState(state);
      } catch (e) {
        console.error(`Error getting widget state:`, e);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sticker, isOpen]);

  // Update state from iframe if available
  useEffect(() => {
    if (sticker?.packageUrl && Object.keys(iframeWidgetState).length > 0) {
      setWidgetState(iframeWidgetState);
    }
  }, [sticker, iframeWidgetState]);

  if (!sticker || !widgetData) return null;

  // Function to handle widget actions
  const handleWidgetAction = useCallback((action: string) => {
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
  }, [sticker]);

  // Memoize the renderWidgetContent function to prevent recreation on each render
  const renderWidgetContent = useCallback(() => {
    if (!sticker) return null;
    
    if (sticker.widgetType === 'Pomodoro') {
      return <PomodoroWidgetUI widgetName="Pomodoro" />;
    }
    
    // If this is a ZIP-based widget, show the iframe
    if (sticker.packageUrl) {
      return (
        <div className="py-4 space-y-4">
          <div className="bg-gray-50 rounded-md overflow-hidden" style={{ height: '300px' }}>
            <iframe 
              ref={iframeRef}
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full border-0"
              title={`${sticker.name} Widget`}
            />
          </div>
          
          {/* Widget state display */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-2">Widget State:</h3>
              <pre className="text-xs overflow-auto max-h-40 bg-gray-100 p-3 rounded-md">
                {JSON.stringify(widgetState, null, 2)}
              </pre>
            </CardContent>
          </Card>
          
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
    
    // For traditional widgets with actions
    if (sticker.widgetType && getWidget(sticker.widgetType)) {
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
          
          {availableActions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Actions:</h3>
              <div className="flex flex-wrap gap-2">
                {availableActions.includes('increment') && (
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
                
                {availableActions.includes('decrement') && (
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
                
                {availableActions.includes('reset') && (
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
                
                {availableActions.includes('toggle') && (
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
  }, [sticker, widgetData, widgetState, availableActions, actionHistory, handleWidgetAction]);

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
