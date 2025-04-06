
# Widget Upload Guide

## Introduction
Sticker Dashboard allows you to create and upload your own custom widgets. Widgets are powerful components that can provide various functionalities when opened from a sticker on your dashboard.

## Types of Widgets

### 1. Simple Widgets
Simple widgets display static content and basic interactivity. These are great for displaying information, links, or simple controls.

### 2. Custom Code Widgets
You can write custom JavaScript code to create interactive widgets with state management. These widgets can maintain their own state and respond to user interactions.

### 3. Package Widgets
The most powerful option! These are complete web applications packaged as ZIP files that run in their own iframe environment within the dashboard.

## Creating and Uploading Widgets

### Simple Widget Creation
1. Click "Create Sticker" in the sidebar
2. Give your sticker a name
3. Upload an image for the sticker (supports regular images or Lottie animations)
4. Click "Create"

### Custom Code Widget
1. Create a sticker as above
2. Edit the sticker by clicking on it in the sidebar tray
3. In the edit dialog, click "Edit Code"
4. Write your widget code using JavaScript

Example of widget code:
```javascript
{
  increment: (state) => ({ ...state, count: (state.count || 0) + 1 }),
  decrement: (state) => ({ ...state, count: (state.count || 0) - 1 }),
  reset: () => ({ count: 0 })
}
```

### Package Widget (ZIP)
Package widgets give you the most flexibility and power. A widget package is a ZIP file with:

1. **Required Files:**
   - `manifest.json` - Widget configuration file
   - `index.html` - Entry point of your widget
   - `icon.png` (or other image format) - Icon for your widget

2. **manifest.json Structure:**
```json
{
  "id": "unique-widget-id",
  "name": "My Custom Widget",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "Description of your widget",
  "icon": "icon.png",
  "entry": "index.html",
  "size": {
    "width": 400,
    "height": 300,
    "resizable": true,
    "minWidth": 300,
    "minHeight": 200
  },
  "permissions": {
    "storage": true
  }
}
```

## Adding Lottie Animations to Widgets

Widgets can now use Lottie animations for dynamic content:

1. When creating or editing a widget:
   - Upload a Lottie JSON file in the "Widget Lottie Animation" section
   - The animation will be displayed in the widget when opened
   
2. For package widgets:
   - Include Lottie animations in your package
   - Reference them in your HTML using the Lottie web player

3. Lottie benefits:
   - Smooth vector animations that scale beautifully
   - Smaller file sizes than videos or GIFs
   - Interactive animations that can respond to user input

## Technical Specifications

### Package Widget Development

Package widgets run in a sandboxed iframe and have access to:

1. **Local Storage** (if requested in permissions)
2. **Widget API** for communication with the main dashboard

### Widget API

When developing a packaged widget, you can use the Widget API to communicate with the dashboard:

```javascript
// Initialize the API connection
const api = window.WidgetAPI.init();

// Save data to persistent storage
api.storage.set('key', value);

// Retrieve data from storage
const value = await api.storage.get('key');

// Listen for theme changes
api.theme.onChange((theme) => {
  console.log('Theme changed to:', theme);
});

// Get user preferences
const preferences = await api.preferences.get();

// Close the widget
api.actions.close();
```

### Limitations

- Widgets run in a sandboxed environment for security
- Access to external resources may be limited by browser security policies
- Storage is limited to 5MB per widget
- Widgets should be responsive and work in various sizes
- External API calls may require CORS configuration

## Uploading a Widget Package

1. Create a ZIP file containing your widget files
2. Click "Create Sticker" or edit an existing sticker
3. In the edit dialog, browse for your ZIP file in the "Replace Widget Package" section
4. Click "Save Changes"

## Best Practices

1. **Keep it Simple**: Focus on one main functionality per widget
2. **Responsive Design**: Make your widgets responsive to different sizes
3. **Error Handling**: Include proper error handling for a good user experience
4. **Performance**: Optimize your code and asset sizes
5. **Theme Support**: Support both light and dark themes if possible
6. **Accessibility**: Follow accessibility best practices

## Widget Examples

The dashboard comes with several built-in widgets:

1. **Pomodoro Timer**: A simple Pomodoro technique timer
2. **To-Do List**: Task management widget
3. **Calendar**: Schedule and event viewer

Study these examples to understand the widget structure and capabilities.

## Troubleshooting

If your widget doesn't work as expected:

1. Check browser console for errors
2. Verify that your manifest.json is correctly formatted
3. Ensure all required files are included in your ZIP package
4. Test your widget in isolation before packaging

## Advanced Topics

### Communication Between Widgets

Widgets can communicate with each other using the Widget API's event system:

```javascript
// Subscribe to an event
api.events.subscribe('task-completed', (data) => {
  console.log('Task completed:', data);
});

// Publish an event
api.events.publish('task-completed', { taskId: '123', title: 'Learn about widgets' });
```

### Custom Themes

Your widget can detect and adapt to the dashboard's theme:

```javascript
api.theme.getCurrent().then(theme => {
  document.body.classList.add(theme);
});
```

## Resources

- [Widget API Documentation](https://your-dashboard-domain.com/docs/widget-api)
- [Example Widgets Repository](https://github.com/your-dashboard/example-widgets)
- [Widget Development Tools](https://your-dashboard-domain.com/tools)

Happy widget creating! 🎉
