
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { getWidget } from '@/lib/widgetAPI';
import { Timer, RotateCcw, Play, Pause } from 'lucide-react';
import { widgetEventBus } from '@/lib/widgetEventBus';

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
  const lastEmittedTimeRef = useRef<number | null>(null);

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
          
          // Emit events on significant state changes
          if (newIsRunning !== previousStateRef.current.isRunning) {
            widgetEventBus.emit({
              type: newIsRunning ? 'pomodoro:started' : 'pomodoro:paused',
              source: widgetName,
              payload: { timeLeft: newTimeLeft }
            });
          }
          
          // Emit time milestone events (every 5 minutes and when < 1 minute)
          const timeInMinutes = Math.floor(newTimeLeft / 60);
          if (
            (timeInMinutes % 5 === 0 && timeInMinutes < Math.floor(previousStateRef.current.timeLeft / 60)) ||
            (timeInMinutes === 0 && Math.floor(previousStateRef.current.timeLeft / 60) > 0)
          ) {
            if (lastEmittedTimeRef.current !== timeInMinutes) {
              widgetEventBus.emit({
                type: 'pomodoro:timeMilestone',
                source: widgetName,
                payload: { 
                  timeLeft: newTimeLeft, 
                  minutesLeft: timeInMinutes 
                }
              });
              lastEmittedTimeRef.current = timeInMinutes;
            }
          }
          
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
    
    // Emit event for starting/pausing
    widgetEventBus.emit({
      type: state.isRunning ? 'pomodoro:pauseRequested' : 'pomodoro:startRequested',
      source: widgetName,
      payload: { currentTimeLeft: state.timeLeft }
    });
  };

  const handleReset = () => {
    widget?.trigger('reset');
    
    // Emit event for reset
    widgetEventBus.emit({
      type: 'pomodoro:resetRequested',
      source: widgetName,
      payload: { previousTimeLeft: state.timeLeft }
    });
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
