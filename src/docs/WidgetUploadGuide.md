
# Widget Upload Guide

This guide provides detailed instructions for uploading and creating custom widgets for the Sticker Dashboard.

## Table of Contents
1. [Widget Types](#widget-types)
2. [Creating Simple Widgets](#creating-simple-widgets)
3. [Uploading Widget Packages](#uploading-widget-packages)
4. [Widget Package Format](#widget-package-format)
5. [Widget API](#widget-api)
6. [Advanced Customization](#advanced-customization)
7. [Troubleshooting](#troubleshooting)

## Widget Types

The Sticker Dashboard supports several types of widgets:

1. **Built-in Widgets**: Pre-configured widgets like Pomodoro Timer and To-Do List
2. **Simple Custom Widgets**: Basic widgets created through the dashboard interface
3. **Widget Packages**: Advanced widgets uploaded as ZIP packages with custom code 
4. **Code Widgets**: Widgets defined through custom JavaScript functions

## Creating Simple Widgets

To create a basic widget:

1. Click the "Create Sticker" button in the sidebar
2. Enter a name for your widget
3. Upload an icon image
4. Switch to the "Widget" tab in the dialog
5. Enter widget details and any basic configuration
6. Click "Create Widget"

## Uploading Widget Packages

For more advanced widgets:

1. Prepare a ZIP package following the [Widget Package Format](#widget-package-format)
2. Click the "Create Sticker" button in the sidebar
3. Enter a name for your widget
4. Switch to the "Widget" tab
5. Select "Upload Package" and choose your ZIP file
6. Click "Create Widget"

## Widget Package Format

A valid widget package ZIP must contain:

- `manifest.json`: Widget metadata and configuration
- `index.html`: Main widget HTML file
- Optional: CSS, JavaScript, and asset files

### manifest.json Example

```json
{
  "name": "My Custom Widget",
  "version": "1.0.0",
  "description": "A custom widget for the Sticker Dashboard",
  "author": "Your Name",
  "icon": "icon.png", 
  "entry": "index.html",
  "size": {
    "width": 300,
    "height": 200,
    "resizable": true
  },
  "permissions": {
    "storage": true,
    "notifications": false
  }
}
```

### index.html Example

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>My Widget</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 16px; }
    .widget-container { background: white; border-radius: 8px; padding: 16px; }
  </style>
</head>
<body>
  <div class="widget-container">
    <h3>My Custom Widget</h3>
    <p>Current count: <span id="counter">0</span></p>
    <div>
      <button id="increment-button">Increment</button>
      <button id="reset-button">Reset</button>
    </div>
    <div>
      <pre id="widget-state-display"></pre>
    </div>
  </div>
</body>
</html>
```

## Widget API

Widgets communicate with the dashboard using a simple message-based API:

1. The dashboard sends an `INIT_STATE` message when the widget is first opened
2. The widget can send `UPDATE_STATE` messages to update its state
3. The dashboard persists widget state between sessions

### Standard Action Buttons

The dashboard recognizes these standard button IDs:

- `increment-button`: Increment a counter
- `decrement-button`: Decrement a counter
- `reset-button`: Reset widget state
- `toggle-button`: Toggle a boolean state

### JavaScript API Example

```javascript
// Send message to parent dashboard
window.parent.postMessage({ 
  type: 'UPDATE_STATE', 
  payload: { count: 5, active: true } 
}, '*');

// Listen for messages from dashboard
window.addEventListener('message', function(event) {
  const { type, payload } = event.data;
  if (type === 'INIT_STATE' || type === 'CURRENT_STATE') {
    // Update UI with state
    document.getElementById('counter').textContent = payload.count || 0;
  }
});
```

## Advanced Customization

For advanced widgets, you can define custom actions:

1. Edit the widget in the sidebar
2. Click "Edit Code"
3. Define custom action handlers using JavaScript

Example code:

```javascript
{
  customIncrement: (state) => ({ 
    ...state, 
    count: (state.count || 0) + 5 
  }),
  resetWithTimestamp: (state) => ({ 
    ...state, 
    count: 0, 
    lastReset: new Date().toISOString() 
  })
}
```

## Limitations

- Widget file size: Maximum 5MB per ZIP package
- Frameworks: Vanilla JavaScript recommended, no external frameworks included by default
- APIs: Widgets run in a sandboxed iframe with limited access to dashboard APIs
- State: Only simple JSON-serializable state is supported
- No server-side processing: Widgets are client-side only

## Troubleshooting

If your widget isn't functioning correctly:

1. **Widget doesn't appear**: Check manifest.json format and ensure index.html exists
2. **State doesn't update**: Verify you're using the correct message format
3. **Actions don't work**: Make sure button IDs match the expected formats
4. **Widget appears blank**: Check the browser console for errors in your HTML or JS
5. **Package rejected**: Ensure your ZIP file is properly formatted and under 5MB
