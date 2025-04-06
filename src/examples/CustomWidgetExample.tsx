
import { useState } from 'react';
import { WidgetAPI } from '@/lib/widgetAPI';

// This is just an example component that demonstrates how to implement a custom widget

// Custom widget state
let customWidgetState = {
  counter: 0,
  isActive: true,
  lastUpdated: new Date().toISOString()
};

// Example widget implementation
const CustomWidget: WidgetAPI = {
  init() {
    console.log('Custom widget initialized');
  },
  
  getState() {
    return customWidgetState;
  },
  
  setState(newState) {
    customWidgetState = { ...customWidgetState, ...newState };
  },
  
  trigger(action: string, payload: any): boolean {
    console.log(`Custom widget action: ${action}`, payload);
    
    switch (action) {
      case 'increment':
        customWidgetState.counter += 1;
        customWidgetState.lastUpdated = new Date().toISOString();
        return true;
        
      case 'decrement':
        customWidgetState.counter = Math.max(0, customWidgetState.counter - 1);
        customWidgetState.lastUpdated = new Date().toISOString();
        return true;
        
      case 'reset':
        customWidgetState.counter = 0;
        customWidgetState.lastUpdated = new Date().toISOString();
        return true;
        
      case 'toggle':
        customWidgetState.isActive = !customWidgetState.isActive;
        customWidgetState.lastUpdated = new Date().toISOString();
        return true;
        
      default:
        console.warn(`Unknown action: ${action}`);
        return false;
    }
  }
};

// Example React component for the widget UI
const CustomWidgetUI = () => {
  const [state, setState] = useState(CustomWidget.getState());
  
  // In a real implementation, you'd use useEffect to sync state with the widget
  
  const updateState = () => {
    setState({ ...CustomWidget.getState() });
  };
  
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Custom Widget Example</h2>
      <p>Counter: {state.counter}</p>
      <p>Active: {state.isActive ? 'Yes' : 'No'}</p>
      <p>Last Updated: {new Date(state.lastUpdated).toLocaleTimeString()}</p>
      
      <div className="flex gap-2 mt-4">
        <button 
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => {
            CustomWidget.trigger('increment', null);
            updateState();
          }}
        >
          Increment
        </button>
        
        <button 
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={() => {
            CustomWidget.trigger('reset', null);
            updateState();
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export { CustomWidget, CustomWidgetUI };
