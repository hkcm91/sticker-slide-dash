import React, { useState, useEffect } from 'react';
import { widgetEventBus, WidgetEvent } from '@/lib/widgetEventBus';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash, RefreshCw, Bug, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DebuggingWidget from './DebuggingWidget';

interface EventLogWidgetProps {
  maxEvents?: number;
  className?: string;
  mode?: 'standard' | 'debug';
}

const EventLogWidget: React.FC<EventLogWidgetProps> = ({ 
  maxEvents = 10,
  className = '',
  mode = 'standard'
}) => {
  if (mode === 'debug') {
    return <DebuggingWidget className={className} />;
  }
  
  const [events, setEvents] = useState<WidgetEvent[]>([]);
  const [debugMode, setDebugMode] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const updateEvents = () => {
      setEvents(widgetEventBus.getHistory().slice(0, maxEvents));
    };
    
    updateEvents();
    
    const unsubscribe = widgetEventBus.on('*', () => {
      updateEvents();
    });
    
    return () => {
      unsubscribe();
    };
  }, [maxEvents]);
  
  const handleClearEvents = () => {
    widgetEventBus.clearHistory();
    setEvents([]);
  };
  
  const toggleDebugMode = () => {
    const newMode = !debugMode;
    setDebugMode(newMode);
    widgetEventBus.setDebug(newMode);
    
    toast({
      title: newMode ? "Debug mode enabled" : "Debug mode disabled",
      description: newMode ? "Detailed debugging information will be shown" : "Regular event logging restored",
      duration: 2000,
    });
  };
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  return (
    <div className={`bg-background/80 backdrop-blur-md rounded-lg overflow-hidden shadow-md ${className} w-full max-w-md`}>
      <div className="p-3 bg-muted/50 border-b flex items-center justify-between">
        <h3 className="font-medium text-sm">Widget Event Log</h3>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={toggleDebugMode}
            title={debugMode ? "Disable debug mode" : "Enable debug mode"}
          >
            <Bug className={`h-4 w-4 ${debugMode ? 'text-orange-500' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={() => setEvents(widgetEventBus.getHistory().slice(0, maxEvents))}
            title="Refresh events"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={handleClearEvents}
            title="Clear event history"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-60 w-full">
        {events.length > 0 ? (
          <div className="p-3 space-y-2">
            {events.map((event, index) => (
              <div key={`${event.timestamp}-${index}`} className="text-sm border rounded-md p-2 bg-card/50">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {event.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {event.timestamp ? formatTime(event.timestamp) : 'Unknown time'}
                  </span>
                </div>
                {event.source && (
                  <div className="text-xs text-muted-foreground mb-1">
                    Source: {event.source}
                  </div>
                )}
                {event.payload && (
                  <pre className="text-xs bg-muted/50 p-1 rounded overflow-auto max-h-20">
                    {JSON.stringify(event.payload, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground text-sm">
            No events recorded yet
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default EventLogWidget;
