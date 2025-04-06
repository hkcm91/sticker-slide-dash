
import { WidgetAPI } from '@/lib/widgetAPI';

// Define our widget's state interface
interface PomodoroState {
  timeLeft: number;
  isRunning: boolean;
  sessionLength: number;
  breakLength: number;
  isBreak: boolean;
  completedSessions: number;
  lastUpdated: string;
}

// Initialize the state
let state: PomodoroState = {
  timeLeft: 25 * 60, // 25 minutes in seconds
  isRunning: false,
  sessionLength: 25 * 60,
  breakLength: 5 * 60,
  isBreak: false,
  completedSessions: 0,
  lastUpdated: new Date().toISOString()
};

// Timer interval reference
let timerInterval: number | null = null;

// Pomodoro Widget implementation
const PomodoroWidget: WidgetAPI = {
  init() {
    console.log('Pomodoro widget initialized');
    
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    // Initialize a timer if the widget should be running
    if (state.isRunning) {
      this.startTimer();
    }
  },
  
  getState() {
    return { ...state };
  },
  
  setState(newState) {
    state = { ...state, ...newState };
  },
  
  trigger(action, payload): boolean {
    console.log(`Pomodoro action triggered: ${action}`);
    
    switch (action) {
      case 'start':
        if (!state.isRunning) {
          state = { ...state, isRunning: true, lastUpdated: new Date().toISOString() };
          this.startTimer();
          return true;
        }
        return false;
        
      case 'pause':
        if (state.isRunning) {
          state = { ...state, isRunning: false, lastUpdated: new Date().toISOString() };
          if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
          }
          return true;
        }
        return false;
        
      case 'reset':
        state = {
          ...state,
          timeLeft: state.isBreak ? state.breakLength : state.sessionLength,
          isRunning: false,
          lastUpdated: new Date().toISOString()
        };
        
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
        return true;
        
      case 'skip':
        this.switchMode();
        return true;
        
      default:
        console.warn(`Unknown action: ${action}`);
        return false;
    }
  },
  
  // Helper methods
  startTimer() {
    // Clear any existing interval
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // Start a new timer
    timerInterval = window.setInterval(() => {
      if (state.timeLeft > 0) {
        // Decrement the timer
        state = { ...state, timeLeft: state.timeLeft - 1, lastUpdated: new Date().toISOString() };
      } else {
        // Time's up! Switch modes
        this.switchMode();
      }
    }, 1000);
  },
  
  switchMode() {
    const isBreak = !state.isBreak;
    const completedSessions = isBreak ? state.completedSessions : state.completedSessions + 1;
    
    state = {
      ...state,
      isBreak,
      timeLeft: isBreak ? state.breakLength : state.sessionLength,
      completedSessions,
      lastUpdated: new Date().toISOString()
    };
    
    // If we need to restart the timer
    if (state.isRunning && timerInterval) {
      clearInterval(timerInterval);
      this.startTimer();
    }
  }
};

export default PomodoroWidget;
