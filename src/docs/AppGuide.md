
# Sticker Dashboard App Guide

## Overview

The Sticker Dashboard is a customizable, widget-based productivity dashboard where you can organize tools and information in a visually appealing way. Think of it as a digital bulletin board where each sticker can expand into a functional widget.

## Core Concepts

### Stickers

Stickers are the visual elements you place on your dashboard. Each sticker:
- Can be dragged and dropped onto the dashboard
- Can be resized using the mouse wheel
- Can be rotated by pressing the 'R' key while hovering
- Opens a widget when clicked
- Can be returned to the tray by clicking the delete button

### Widgets

Widgets are the functional components that open when you click on a sticker. They provide various utilities like:
- Pomodoro timer
- To-do lists
- Custom HTML/JavaScript applications
- Information displays

### Tray

The sidebar tray stores all available stickers that aren't currently placed on your dashboard. When you delete a sticker from the dashboard, it returns to the tray for future use.

## Getting Started

1. **Explore Available Stickers**: Browse the stickers in the sidebar tray
2. **Place Stickers**: Drag stickers from the tray onto the dashboard
3. **Arrange Your Dashboard**: Move, resize, and rotate stickers to your preference
4. **Use Widgets**: Click on stickers to open their associated widgets
5. **Customize**: Upload your own stickers and set a custom background

## Dashboard Features

### Custom Background

1. Click the background icon in the bottom right corner
2. Upload an image or provide a URL
3. Adjust the position and scaling options if needed
4. Click "Set Background" to apply

### Sticker Creation

1. Click "Create Sticker" in the sidebar
2. Name your sticker
3. Upload an image or Lottie animation
4. Click "Create" to add it to your tray

### Widget Interaction

1. Click on any placed sticker to open its widget
2. Interact with the widget according to its functionality
3. Click outside the widget or the close button to close it

## Advanced Usage

### Widget Development

You can create custom widgets for your dashboard:

1. Basic widgets with simple functionality
2. HTML/JavaScript widgets using the Widget API
3. Advanced widgets uploaded as ZIP packages

See the [Widget Upload Guide](./WidgetUploadGuide.md) for detailed instructions.

### Keyboard Shortcuts

- **R**: Rotate the sticker under the cursor
- **Delete/Backspace**: Delete the selected sticker (returns it to the tray)
- **Escape**: Close any open widget or dialog

## Tips and Tricks

- **Organize by Function**: Group related stickers together on your dashboard
- **Size Matters**: Resize important stickers to make them more prominent
- **Color Coding**: Choose stickers with colors that represent different categories
- **Clean Up**: Return unused stickers to the tray to keep your dashboard tidy
- **Regular Backups**: The dashboard state is saved automatically, but consider backing up your custom stickers

## Troubleshooting

- **Stickers won't place**: Ensure you're dragging to a valid area on the dashboard
- **Widget doesn't open**: Try refreshing the page or recreating the sticker
- **Custom sticker doesn't appear**: Check the image format and size
- **Settings don't save**: Make sure local storage is enabled in your browser
- **Widget state resets**: Some widgets may not save state between sessions
