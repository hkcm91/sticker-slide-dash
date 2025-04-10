import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, RefreshCw, Trash, Database, Eye, EyeOff, AlertTriangle, Info, X, Check } from 'lucide-react';
import { useWidgetEvent, useWidgetEventHistory } from '@/hooks/useWidgetEvent';
import { widgetEventBus } from '@/lib/widgetEventBus';
import { useToast } from '@/hooks/use-toast';

interface DebuggingWidgetProps {
  className?: string;
  mode?: 'compact' | 'full';
}

const DebuggingWidget: React.FC<DebuggingWidgetProps> = ({ 
  className = '',
  mode = 'full'
}) => {
  const [activeTab, setActiveTab] = useState('events');
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const eventHistory = useWidgetEventHistory();
  const [logEntries, setLogEntries] = useState<{level: string, message: string, timestamp: number}[]>([]);
  const [stateSnapshots, setStateSnapshots] = useState<{name: string, data: any, timestamp: number}[]>([]);
  const { toast } = useToast();

  // Listen for console logs
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.log = (...args) => {
      originalConsoleLog(...args);
      addLogEntry('info', args.map(arg => formatLogArg(arg)).join(' '));
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      addLogEntry('error', args.map(arg => formatLogArg(arg)).join(' '));
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args);
      addLogEntry('warn', args.map(arg => formatLogArg(arg)).join(' '));
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  // Format log arguments
  const formatLogArg = (arg: any): string => {
    if (typeof arg === 'string') return arg;
    if (arg instanceof Error) return arg.message;
    try {
      return JSON.stringify(arg);
    } catch (e) {
      return String(arg);
    }
  };

  // Add a log entry
  const addLogEntry = (level: string, message: string) => {
    setLogEntries(prev => [...prev.slice(-99), { level, message, timestamp: Date.now() }]);
  };

  // Add a state snapshot
  const addStateSnapshot = (name: string, data: any) => {
    setStateSnapshots(prev => [...prev.slice(-19), { name, data, timestamp: Date.now() }]);
  };

  // Clear logs
  const clearLogs = () => {
    setLogEntries([]);
    toast({
      title: "Logs cleared",
      description: "Debug logs have been cleared",
      duration: 1500,
    });
  };

  // Clear events
  const clearEvents = () => {
    widgetEventBus.clearHistory();
    toast({
      title: "Events cleared",
      description: "Event history has been cleared",
      duration: 1500,
    });
  };

  // Clear snapshots
  const clearSnapshots = () => {
    setStateSnapshots([]);
    toast({
      title: "Snapshots cleared",
      description: "State snapshots have been cleared",
      duration: 1500,
    });
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    const newMode = !debugMode;
    setDebugMode(newMode);
    widgetEventBus.setDebug(newMode);
    
    toast({
      title: newMode ? "Debug mode enabled" : "Debug mode disabled",
      description: newMode ? "Detailed debugging information will be shown" : "Normal operation mode",
      duration: 2000,
    });
  };

  // Format time - Fixed date formatting issue
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  // Get badge color by log level
  const getBadgeVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch(level.toLowerCase()) {
      case 'error': return 'destructive';
      case 'warn': return 'secondary';
      case 'info': return 'default';
      default: return 'outline';
    }
  };

  // Get icon by log level
  const getLevelIcon = (level: string) => {
    switch(level.toLowerCase()) {
      case 'error': return <AlertTriangle className="h-3 w-3" />;
      case 'warn': return <AlertTriangle className="h-3 w-3" />;
      case 'info': return <Info className="h-3 w-3" />;
      case 'success': return <Check className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  // Capture a state snapshot (can be called from console: window.captureDebugState('name', data))
  useEffect(() => {
    (window as any).captureDebugState = (name: string, data: any) => {
      addStateSnapshot(name, data);
      toast({
        title: "State captured",
        description: `Snapshot: ${name}`,
        duration: 1500,
      });
    };
    
    return () => {
      delete (window as any).captureDebugState;
    };
  }, []);

  // Listen for specific events
  useWidgetEvent('sticker-click', (payload) => {
    addLogEntry('info', `Sticker clicked: ${payload?.id || 'unknown'}`);
  }, []);

  useWidgetEvent('sticker-drag', (payload) => {
    addLogEntry('info', `Sticker dragged: ${payload?.id || 'unknown'}`);
  }, []);

  // Render compact mode (simpler UI)
  if (mode === 'compact') {
    return (
      <Card className={`w-full max-w-sm overflow-hidden ${className}`}>
        <CardHeader className="p-3 bg-muted/30 flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bug className="h-4 w-4 text-muted-foreground" />
            Debug Console
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleDebugMode}>
              <Bug className={`h-4 w-4 ${debugMode ? 'text-orange-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearLogs}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-40">
            <div className="p-3 space-y-1">
              {logEntries.length > 0 ? (
                logEntries.map((entry, idx) => (
                  <div key={idx} className="flex items-start text-xs gap-1">
                    <Badge variant={getBadgeVariant(entry.level)} className="shrink-0 h-5">
                      {getLevelIcon(entry.level)}
                    </Badge>
                    <span className="text-xs whitespace-pre-wrap break-all">{entry.message}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-muted-foreground py-6">
                  No debug information yet
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // Render full mode
  return (
    <Card className={`w-full max-w-xl overflow-hidden shadow-md ${className}`}>
      <CardHeader className="p-3 bg-muted/30 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bug className="h-4 w-4 text-muted-foreground" />
          Debugging Tools
        </CardTitle>
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
            onClick={() => setShowFullDetails(!showFullDetails)}
            title={showFullDetails ? "Show less details" : "Show more details"}
          >
            {showFullDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-3 pt-1 border-b">
          <TabsList className="w-full h-8 bg-transparent">
            <TabsTrigger value="events" className="flex-1 h-8 data-[state=active]:shadow-none">
              Events
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex-1 h-8 data-[state=active]:shadow-none">
              Console
            </TabsTrigger>
            <TabsTrigger value="state" className="flex-1 h-8 data-[state=active]:shadow-none">
              State
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="events" className="m-0">
          <div className="p-1 border-b flex justify-between items-center">
            <div className="text-xs text-muted-foreground px-2">
              Event History ({eventHistory.length})
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearEvents}>
                <Trash className="h-3 w-3 mr-1" /> Clear
              </Button>
            </div>
          </div>
          <ScrollArea className="h-60">
            <div className="p-2 space-y-2">
              {eventHistory.length > 0 ? (
                eventHistory.map((event, index) => (
                  <div key={`${event.timestamp}-${index}`} className="text-xs border rounded-md p-2 bg-card/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px]">
                        {event.type}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {formatTime(event.timestamp)}
                      </span>
                    </div>
                    {showFullDetails && event.source && (
                      <div className="text-[10px] text-muted-foreground mb-1">
                        Source: {event.source}
                      </div>
                    )}
                    {showFullDetails && event.payload && (
                      <pre className="text-[10px] bg-muted/30 p-1 rounded overflow-auto max-h-20">
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-muted-foreground py-10">
                  No events recorded yet
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="logs" className="m-0">
          <div className="p-1 border-b flex justify-between items-center">
            <div className="text-xs text-muted-foreground px-2">
              Console Logs ({logEntries.length})
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearLogs}>
                <Trash className="h-3 w-3 mr-1" /> Clear
              </Button>
            </div>
          </div>
          <ScrollArea className="h-60">
            <div className="p-2 space-y-1">
              {logEntries.length > 0 ? (
                logEntries.map((entry, idx) => (
                  <div key={idx} className="flex gap-2 items-start text-xs py-1">
                    <Badge variant={getBadgeVariant(entry.level)} className="shrink-0 h-5">
                      {getLevelIcon(entry.level)}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="whitespace-pre-wrap break-all">{entry.message}</span>
                        {showFullDetails && (
                          <span className="text-[10px] text-muted-foreground ml-2 shrink-0">
                            {formatTime(entry.timestamp)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-muted-foreground py-10">
                  No console logs captured yet
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="state" className="m-0">
          <div className="p-1 border-b flex justify-between items-center">
            <div className="text-xs text-muted-foreground px-2">
              State Snapshots ({stateSnapshots.length})
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearSnapshots}>
                <Trash className="h-3 w-3 mr-1" /> Clear
              </Button>
            </div>
          </div>
          <ScrollArea className="h-60">
            <div className="p-2 space-y-2">
              {stateSnapshots.length > 0 ? (
                stateSnapshots.map((snapshot, idx) => (
                  <div key={idx} className="text-xs border rounded-md p-2 bg-card/30">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{snapshot.name}</span>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {formatTime(snapshot.timestamp)}
                      </span>
                    </div>
                    <pre className="text-[10px] bg-muted/30 p-1 rounded overflow-auto max-h-40">
                      {JSON.stringify(snapshot.data, null, 2)}
                    </pre>
                  </div>
                ))
              ) : (
                <div className="text-center flex flex-col items-center text-xs text-muted-foreground py-6">
                  <Database className="h-8 w-8 mb-2 opacity-20" />
                  <p>No state snapshots yet</p>
                  <p className="text-[10px] mt-1 max-w-xs text-center">
                    Capture state with <code className="bg-muted/50 px-1">window.captureDebugState('name', data)</code>
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DebuggingWidget;
