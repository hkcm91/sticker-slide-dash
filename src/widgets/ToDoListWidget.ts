
import { WidgetAPI } from '@/lib/widgetAPI';
import { createWidgetSticker } from '@/utils/createWidgetSticker';

// Define our widget's state
interface ToDoListState {
  items: Array<{ id: string; text: string; completed: boolean }>;
  count: number;
  active: boolean;
  lastUpdated: string;
}

// Initialize the state
let state: ToDoListState = {
  items: [
    { id: '1', text: 'Learn about widgets', completed: false },
    { id: '2', text: 'Create a custom widget', completed: false },
    { id: '3', text: 'Share with friends', completed: false },
  ],
  count: 3,
  active: true,
  lastUpdated: new Date().toISOString()
};

// Create the widget implementation
const ToDoListWidget: WidgetAPI = {
  init() {
    console.log('To Do List widget initialized');
  },
  
  getState() {
    return { ...state };
  },
  
  setState(newState) {
    state = { ...state, ...newState };
  },
  
  trigger(action, payload): boolean {
    console.log(`ToDo widget action triggered: ${action}`, payload);
    const now = new Date().toISOString();
    
    switch (action) {
      case 'increment':
        // Add a new todo item
        const newId = String(Date.now());
        state = {
          ...state,
          items: [...state.items, { id: newId, text: `Task ${state.items.length + 1}`, completed: false }],
          count: state.count + 1,
          lastUpdated: now
        };
        return true;
        
      case 'decrement':
        // Remove the last uncompleted item
        if (state.items.length > 0) {
          const filteredItems = [...state.items];
          const lastIndex = filteredItems.length - 1;
          filteredItems.splice(lastIndex, 1);
          
          state = {
            ...state,
            items: filteredItems,
            count: state.count > 0 ? state.count - 1 : 0,
            lastUpdated: now
          };
        }
        return true;
        
      case 'reset':
        // Clear all items
        state = {
          ...state,
          items: [],
          count: 0,
          lastReset: now,
          lastUpdated: now
        };
        return true;
        
      case 'toggle':
        // Toggle active state
        state = {
          ...state,
          active: !state.active,
          lastUpdated: now
        };
        return true;
        
      default:
        console.warn(`Unknown action: ${action}`);
        return false;
    }
  }
};

// Create and export the sticker
export const toDoListSticker = createWidgetSticker({
  name: 'ToDoList',
  letter: '📋',
  backgroundColor: '#6200EA',
  widgetAPI: ToDoListWidget,
  title: 'To Do List',
  description: 'Keep track of your tasks and to-dos'
});

export default ToDoListWidget;
