
import React, { useState, useEffect } from 'react';
import { WeatherWidgetUI } from '@/widgets/builtin/WeatherWidget';
import { getWidget } from '@/lib/widgetAPI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw } from 'lucide-react';

interface WeatherWidgetProps {
  widgetName: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ widgetName }) => {
  const [state, setState] = useState<any>({
    location: 'New York',
    temperature: 72,
    condition: 'sunny',
    lastUpdated: new Date().toISOString()
  });
  const [newLocation, setNewLocation] = useState('');
  
  const widget = getWidget(widgetName);
  
  useEffect(() => {
    if (widget) {
      setState(widget.getState());
    }
  }, [widget]);
  
  const handleRefresh = () => {
    if (widget) {
      widget.trigger('refreshWeather');
      setState(widget.getState());
    }
  };
  
  const handleUpdateLocation = () => {
    if (widget && newLocation) {
      widget.trigger('updateLocation', newLocation);
      setState(widget.getState());
      setNewLocation('');
    }
  };
  
  return (
    <div className="p-4 w-full max-w-md">
      <WeatherWidgetUI widgetState={state} />
      
      <div className="mt-4 flex gap-2">
        <Input 
          value={newLocation} 
          onChange={(e) => setNewLocation(e.target.value)}
          placeholder="Change location..." 
          className="flex-1"
        />
        <Button onClick={handleUpdateLocation} variant="outline" size="sm">
          Update
        </Button>
        <Button onClick={handleRefresh} size="icon" variant="outline">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WeatherWidget;
