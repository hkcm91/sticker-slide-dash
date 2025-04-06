
# Sticker Dashboard

A customizable dashboard where you can place stickers that expand into interactive widgets. Personalize your workspace with drag-and-drop stickers, custom backgrounds, and expandable widget functionality.

## Features

- **Drag and Drop Interface**: Place stickers anywhere on your dashboard with intuitive drag and drop
- **Customizable Stickers**: Upload your own images or use built-in stickers
- **Widget Integration**: Each sticker can expand into a functional widget
- **Custom Backgrounds**: Personalize your dashboard with custom background images
- **Sticker Manipulation**: Resize, rotate, and delete stickers as needed
- **Widget System**: Support for custom widget development and integration

## Getting Started

### Installation

1. Clone this repository:
```sh
git clone <repository-url>
cd sticker-dashboard
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

4. Open your browser to the local development URL (typically http://localhost:5173)

## Usage Guide

### Dashboard Basics

- **Adding Stickers**: Drag stickers from the sidebar and drop them onto the dashboard
- **Moving Stickers**: Click and drag any placed sticker to reposition it
- **Resizing Stickers**: Use the mouse wheel/scroll while hovering over a sticker to resize it
- **Rotating Stickers**: Press the 'R' key while hovering over a sticker to rotate it
- **Removing Stickers**: Click the "×" button on a sticker to return it to the sidebar
- **Opening Widgets**: Click on any placed sticker to open its associated widget

### Custom Stickers

1. Click the "Create Sticker" button in the sidebar
2. Enter a name for your sticker
3. Upload an image (PNG, JPG, GIF, SVG) or a Lottie animation file (JSON)
4. Click "Create Sticker"

### Custom Backgrounds

1. Click the background icon in the bottom right of the dashboard
2. Upload an image or provide a URL
3. Click "Set Background" to apply

## Widget System

The Sticker Dashboard includes a powerful widget system that allows for extensible functionality. 
See the [Widget Guide](./src/docs/WidgetGuide.md) for detailed information on creating and integrating widgets.

## License

[MIT License](LICENSE)
