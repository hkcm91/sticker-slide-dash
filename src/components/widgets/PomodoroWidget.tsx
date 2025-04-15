import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { getWidget } from '@/lib/widgetAPI';
import { Timer, RotateCcw, Play, Pause } from 'lucide-react';
import { WidgetState } from '@/lib/widgetAPI';

// Helper function to format seconds into MM:SS
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface PomodoroWidgetProps {
  widgetName: string;
}

// Define the expected state shape for the Pomodoro widget
interface PomodoroWidgetState {
  timeLeft: number;
  isRunning: boolean;
}

const PomodoroWidgetUI: React.FC<PomodoroWidgetProps> = ({ widgetName }) => {
  const [state, setState] = useState<PomodoroWidgetState>({ timeLeft: 1500, isRunning: false });
  const widget = getWidget(widgetName);
  const previousStateRef = useRef<PomodoroWidgetState>({ timeLeft: 1500, isRunning: false });

  useEffect(() => {
    // Initialize the widget if it exists
    if (widget) {
      widget.init();
      
      // Get initial state
      const initialState = widget.getState();
      setState({
        timeLeft: initialState.timeLeft ?? 1500,
        isRunning: initialState.isRunning ?? false
      });
      
      // Keep a reference to the current state to avoid unnecessary updates
      previousStateRef.current = {
        timeLeft: initialState.timeLeft ?? 1500,
        isRunning: initialState.isRunning ?? false
      };
      
      // Setup an interval to poll for state changes
      const stateInterval = setInterval(() => {
        const currentState = widget.getState();
        const newTimeLeft = currentState.timeLeft ?? previousStateRef.current.timeLeft;
        const newIsRunning = currentState.isRunning ?? previousStateRef.current.isRunning;
        
        // Only update state if there's an actual change
        if (newTimeLeft !== previousStateRef.current.timeLeft || 
            newIsRunning !== previousStateRef.current.isRunning) {
          
          setState({
            timeLeft: newTimeLeft,
            isRunning: newIsRunning
          });
          
          // Update the ref with new state
          previousStateRef.current = {
            timeLeft: newTimeLeft,
            isRunning: newIsRunning
          };
        }
      }, 500);
      
      return () => clearInterval(stateInterval);
    }
  }, [widget, widgetName]);

  const handleStart = () => {
    widget?.trigger(state.isRunning ? 'pause' : 'start');
  };

  const handleReset = () => {
    widget?.trigger('reset');
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center justify-center w-full text-3xl font-bold">
        <Timer className="mr-2" />
        <span>{formatTime(state.timeLeft)}</span>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleStart} variant="outline">
          {state.isRunning ? <Pause className="mr-1" /> : <Play className="mr-1" />}
          {state.isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="mr-1" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default PomodoroWidgetUI;
