
import { registerWidgetModule } from '@/lib/widgetSystem';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';

// Register the Debugging Widget
export const initializeDebuggingWidget = () => {
  // Create and register the widget
  registerWidgetModule({
    name: 'DebuggingWidget',
    displayName: 'Debugging Tools',
    description: 'Monitor system events, log console output, and debug application state',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzE0YjhhNiIgLz48cGF0aCBkPSJNMTggOGwtMiAyLTQtNC00IDRMNiA4IDEwIDQiIHN0cm9rZT0id2hpdGUiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTggMTZsLTItMi00IDQtNC00LTIgMkwxMCAyMCI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIHN0cm9rZT0id2hpdGUiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMS41Ii8+PC9zdmc+',
    category: 'utility',
    version: '1.0.0',
    author: 'Lovable',
    state: {
      activeTab: 'events',
      showFullDetails: false,
      eventCount: 0,
      logCount: 0
    },
    actions: {
      clearLogs: (state) => ({
        ...state,
        logCount: 0
      }),
      clearEvents: (state) => ({
        ...state,
        eventCount: 0
      }),
      setActiveTab: (state, payload) => ({
        ...state,
        activeTab: payload
      }),
      toggleDetails: (state) => ({
        ...state,
        showFullDetails: !state.showFullDetails
      })
    }
  });

  console.log('Debugging Widget initialized and registered');
};
