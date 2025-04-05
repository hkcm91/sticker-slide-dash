# Widget Integration Guide

This guide explains how to create widgets that integrate with the dashboard system and how to configure custom stickers that link to your widgets.

## Table of Contents
1. [Widget Architecture Overview](#widget-architecture-overview)
2. [Creating a Simple Widget](#creating-a-simple-widget)
3. [Connecting a Widget to a Sticker](#connecting-a-widget-to-a-sticker)
4. [Using Custom Stickers](#using-custom-stickers)
5. [Advanced Widget Development](#advanced-widget-development)

## Widget Architecture Overview

The dashboard uses a widget-based architecture with the following components:

- **Dashboard**: The main application that loads and manages widgets
- **Widget Registry**: API that maintains a list of available widgets
- **Widget API**: Interface that widgets implement to communicate with the dashboard
- **Stickers**: Visual representations of widgets in the dashboard sidebar

## Creating a Simple Widget

Creating a new widget is easy:

1. Create a new file in `src/widgets/` folder (e.g., `MyWidget.ts`)
2. Implement the WidgetAPI interface
3. Register your widget with the system

### Example Widget

```typescript
// src/widgets/MyWidget.ts
import { WidgetAPI } from '@/lib/widgetAPI';

// Define your widget's state
let state = {
  counter: 0,
  lastUpdated: new Date()
};

// Create a widget that implements the WidgetAPI interface
const MyWidget: WidgetAPI = {
  init() {
    console.log('My widget initialized');
    // Initialize your widget here
  },
  
  getState() {
    return state;
  },
  
  setState(newState) {
    state = { ...state, ...newState };
  },
  
  trigger(action, payload) {
    if (action === 'increment') {
      state.counter += 1;
      state.lastUpdated = new Date();
    } else if (action === 'reset') {
      state.counter = 0;
      state.lastUpdated = new Date();
    }
  }
};

export default MyWidget;
```

## Connecting a Widget to a Sticker

To create a sticker for your widget, use the `createWidgetSticker` helper:

```typescript
// src/widgets/MyWidgetSticker.ts
import { createWidgetSticker } from '@/utils/createWidgetSticker';
import MyWidget from './MyWidget';

const myWidgetSticker = createWidgetSticker({
  name: 'MyWidget',
  letter: 'M',  // Letter shown on the sticker
  backgroundColor: '#3B82F6',  // Background color
  widgetAPI: MyWidget,  // Your widget implementation
  title: 'My Custom Widget',  // Title shown in the widget modal
  description: 'This is my awesome custom widget!'  // Description for the widget
});

export default myWidgetSticker;
```

Then, import and add it to the Dashboard:

```typescript
// In Dashboard.tsx
import myWidgetSticker from '@/widgets/MyWidgetSticker';

const initialStickers = [
  // ... other stickers
  myWidgetSticker,
];
```

## Using Custom Stickers

You can create custom stickers directly from the dashboard interface:

1. Click the "Create Sticker" button in the sidebar
2. Enter a name for your sticker
3. Upload an image (PNG, JPG, GIF, SVG) or a Lottie animation file (JSON)
4. Click "Create Sticker"

Your custom sticker will appear in the "Custom" tab of the sidebar. You can then drag it onto the dashboard.

Custom stickers can be deleted by hovering over them in the sidebar and clicking the delete (trash) icon.

## Advanced Widget Development

For more advanced widgets, you can create a custom UI component:

1. Create your widget implementation as shown above
2. Create a React component to display your widget
3. Add your component to the WidgetModal renderer

### Example Custom Widget UI

```tsx
// src/components/widgets/MyWidgetUI.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getWidget } from '@/lib/widgetAPI';

interface MyWidgetUIProps {
  widgetName: string;
}

const MyWidgetUI: React.FC<MyWidgetUIProps> = ({ widgetName }) => {
  const [state, setState] = useState({ counter: 0, lastUpdated: new Date() });
  const widget = getWidget(widgetName);

  useEffect(() => {
    // Initialize the widget
    if (widget) {
      widget.init();
      setState(widget.getState());
      
      // Poll for state changes
      const interval = setInterval(() => {
        setState(widget.getState());
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [widget, widgetName]);

  const handleIncrement = () => {
    widget?.trigger('increment');
  };

  const handleReset = () => {
    widget?.trigger('reset');
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Counter: {state.counter}</h3>
      <p className="text-sm text-gray-500 mb-4">
        Last updated: {new Date(state.lastUpdated).toLocaleTimeString()}
      </p>
      <div className="flex gap-2">
        <Button onClick={handleIncrement}>Increment</Button>
        <Button variant="outline" onClick={handleReset}>Reset</Button>
      </div>
    </div>
  );
};

export default MyWidgetUI;
```

Then add it to the WidgetModal:

```tsx
// In WidgetModal.tsx
import MyWidgetUI from './widgets/MyWidgetUI';

// In your renderWidgetContent function
if (sticker.widgetType === 'MyWidget') {
  return <MyWidgetUI widgetName="MyWidget" />;
}
```
