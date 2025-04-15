
import React, { useState } from 'react';
import { Sticker as StickerType, WidgetData } from '@/types/stickers';
import IframeWidget from '../IframeWidget';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ShieldAlert, Database } from 'lucide-react';

interface IframeWidgetRendererProps {
  sticker: StickerType;
  widgetData: WidgetData;
  className?: string;
  hideHeader?: boolean;
}

const IframeWidgetRenderer: React.FC<IframeWidgetRendererProps> = ({
  sticker,
  widgetData,
  className,
  hideHeader = false
}) => {
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const isAdvancedWidget = sticker.widgetConfig !== undefined;
  
  return (
    <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md ${className}`} style={{ height: '300px', width: '100%', minWidth: '300px' }}>
      {!hideHeader && (
        <div className="widget-header p-2 border-b border-border/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{widgetData.title}</h3>
            
            {isAdvancedWidget && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-purple-50 border-purple-200 text-purple-700">Advanced</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">This is an advanced widget with extended capabilities</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <div className="flex gap-1">
            {sticker.permissions?.includes('storage') && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-4 h-4">
                      <Database className="h-3 w-3 text-blue-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Storage access</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {sticker.permissions?.includes('network') && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-4 h-4">
                      <ShieldAlert className="h-3 w-3 text-orange-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Network access</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      )}
      
      <IframeWidget 
        widgetId={sticker.widgetType} 
        onError={(error) => setWidgetError(error)}
      />
      
      {widgetError && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border-t border-red-200">
          Error: {widgetError}
        </div>
      )}
    </div>
  );
};

export default IframeWidgetRenderer;
