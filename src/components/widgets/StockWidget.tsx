
import React, { useState, useEffect } from 'react';
import { StockWidgetUI } from '@/widgets/builtin/StockWidget';
import { getWidget } from '@/lib/widgetAPI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw } from 'lucide-react';
import { useWidgetEvent } from '@/hooks/useWidgetEvent';
import { toast } from 'sonner';

interface StockWidgetProps {
  widgetName: string;
}

const StockWidget: React.FC<StockWidgetProps> = ({ widgetName }) => {
  const [state, setState] = useState<any>({
    symbol: 'AAPL',
    price: 145.85,
    change: 2.34,
    lastUpdated: new Date().toISOString()
  });
  const [newSymbol, setNewSymbol] = useState('');
  
  const widget = getWidget(widgetName);
  
  useEffect(() => {
    if (widget) {
      setState(widget.getState());
      
      // Auto-refresh the stock data every minute
      const interval = setInterval(() => {
        handleRefresh();
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [widget]);
  
  // Listen for Pomodoro events to demonstrate widget communication
  useWidgetEvent('pomodoro:started', (payload) => {
    toast.info('Focus time started - Markets will auto-refresh less frequently', {
      description: 'Stock widget is now in focus mode'
    });
  }, []);
  
  useWidgetEvent('pomodoro:paused', (payload) => {
    toast.info('Focus time paused - Markets will refresh normally', {
      description: 'Stock widget restored to normal refresh rate'
    });
    // Refresh the data when focus mode ends
    handleRefresh();
  }, []);
  
  useWidgetEvent('pomodoro:timeMilestone', (payload) => {
    if (payload.minutesLeft === 0) {
      toast.info('Focus time almost complete!', {
        description: 'Stock widget will return to normal refresh rate soon'
      });
    }
  }, []);
  
  const handleRefresh = () => {
    if (widget) {
      widget.trigger('refreshStock');
      setState(widget.getState());
    }
  };
  
  const handleUpdateSymbol = () => {
    if (widget && newSymbol) {
      widget.trigger('updateSymbol', newSymbol.toUpperCase());
      setState(widget.getState());
      setNewSymbol('');
    }
  };
  
  return (
    <div className="p-4 w-full max-w-md">
      <StockWidgetUI widgetState={state} />
      
      <div className="mt-4 flex gap-2">
        <Input 
          value={newSymbol} 
          onChange={(e) => setNewSymbol(e.target.value)}
          placeholder="Enter stock symbol..." 
          className="flex-1"
        />
        <Button onClick={handleUpdateSymbol} variant="outline" size="sm">
          Update
        </Button>
        <Button onClick={handleRefresh} size="icon" variant="outline">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StockWidget;
