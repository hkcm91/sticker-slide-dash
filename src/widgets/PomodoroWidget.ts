
import { WidgetAPI, WidgetState, registerWidget } from '@/lib/widgetAPI';

interface PomodoroState extends WidgetState {
  timeLeft: number;
  isRunning: boolean;
}

let state: PomodoroState = {
  timeLeft: 1500, // 25 minutes in seconds
  isRunning: false,
};

let interval: number | null = null;

const PomodoroWidget: WidgetAPI = {
  init() {
    console.log('Pomodoro widget initialized');
    // Clear any existing intervals to prevent memory leaks
    if (interval) {
      window.clearInterval(interval);
      interval = null;
    }
  },
  
  getState() {
    return { ...state };
  },
  
  setState(newState: Partial<PomodoroState>) {
    state = { ...state, ...newState };
    
    // Handle timer logic when state changes
    if (state.isRunning && !interval) {
      interval = window.setInterval(() => {
        if (state.timeLeft <= 0) {
          state.isRunning = false;
          if (interval) window.clearInterval(interval);
          interval = null;
        } else {
          state.timeLeft -= 1;
        }
      }, 1000);
    } else if (!state.isRunning && interval) {
      window.clearInterval(interval);
      interval = null;
    }
  },
  
  trigger(action: string, payload?: any): boolean {
    switch(action) {
      case 'start':
        this.setState({ isRunning: true });
        return true;
      case 'pause':
        this.setState({ isRunning: false });
        return true;
      case 'reset':
        this.setState({ timeLeft: 1500, isRunning: false });
        return true;
      case 'set-time':
        if (typeof payload === 'number') {
          this.setState({ timeLeft: payload });
          return true;
        }
        return false;
      default:
        return false;
    }
  },
};

// Auto-register this widget
registerWidget('Pomodoro', PomodoroWidget);

export default PomodoroWidget;
