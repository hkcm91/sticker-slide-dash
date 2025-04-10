import { v4 as uuidv4 } from 'uuid';
import { Sticker } from '@/types/stickers';
import { createDebuggingWidgetSticker } from '@/widgets/builtin';

// Initial stickers for a new dashboard
export const initialStickers: Sticker[] = [
  {
    id: uuidv4(),
    name: 'Weather Widget',
    description: 'Shows current weather and forecast',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsb3VkLXN1biI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNCIgZmlsbD0iI2ZmYmYwMCIvPjxwYXRoIGQ9Ik0xMiAydjIiLz48cGF0aCBkPSJNMTIgMjB2MiIvPjxwYXRoIGQ9Ik00LjkzIDQuOTNsMS40MSAxLjQxIi8+PHBhdGggZD0iTTE3LjY2IDE3LjY2bDEuNDEgMS40MSIvPjxwYXRoIGQ9Ik0yIDEyaDIiLz48cGF0aCBkPSJNMjAgMTJoMiIvPjxwYXRoIGQ9Ik02LjM0IDE3LjY2bC0xLjQxIDEuNDEiLz48cGF0aCBkPSJNMTkuMDcgNC45M2wtMS40MSAxLjQxIi8+PHBhdGggZD0iTTIgMTVoMiIvPjxwYXRoIGQ9Ik0yMCAxNWgyIi8+PHBhdGggZD0iTTEwIDIwaDQiLz48L3N2Zz4=',
    widgetType: 'WeatherWidget',
    position: { x: 0, y: 0 },
    placed: false,
    size: 60,
    rotation: 0,
    isCustom: false
  },
  {
    id: uuidv4(),
    name: 'Stock Widget',
    description: 'Track stock prices and market trends',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNhbmRsZXN0aWNrLWNoYXJ0Ij48cGF0aCBkPSJNMTMgMTJoOSIvPjxwYXRoIGQ9Ik0yIDEyaDciLz48cGF0aCBkPSJNOSA2djEyIi8+PHBhdGggZD0iTTEzIDEyVjZoNHY2aC00WiIgZmlsbD0iIzBmYzJjMCIvPjxwYXRoIGQ9Ik05IDEydjZoNHYtNkg5WiIgZmlsbD0iI2ZmNDQ0NCIvPjwvc3ZnPg==',
    widgetType: 'StockWidget',
    position: { x: 0, y: 0 },
    placed: false,
    size: 60,
    rotation: 0,
    isCustom: false
  },
  {
    id: uuidv4(),
    name: 'Pomodoro Timer',
    description: 'Stay focused with timed work sessions',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXRpbWVyIj48cGF0aCBkPSJNMTAgMmgyIi8+PHBhdGggZD0iTTEyIDZhOCA4IDAgMSAwIDAgMTYgOCA4IDAgMCAwIDAtMTYiIGZpbGw9IiNmZjYzNDciLz48cGF0aCBkPSJNMTIgNnY2bDQgMiIvPjwvc3ZnPg==',
    widgetType: 'Pomodoro',
    position: { x: 0, y: 0 },
    placed: false,
    size: 60,
    rotation: 0,
    isCustom: false
  },
  {
    id: uuidv4(),
    name: 'Event Log',
    description: 'Track system events and notifications',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxpc3QtZW5kIj48cGF0aCBkPSJNMTYgMTJIOSIvPjxwYXRoIGQ9Ik0xNiA2SDkiLz48cGF0aCBkPSJNMTAgMThoNiIvPjxwYXRoIGQ9Ik04IDZoLjAxIi8+PHBhdGggZD0iTTggMTJoLjAxIi8+PHBhdGggZD0iTTggMThoLjAxIi8+PHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSIzIiByeD0iMiIgZmlsbD0iI2VhNTgwYyIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L3N2Zz4=',
    widgetType: 'EventLog',
    position: { x: 0, y: 0 },
    placed: false,
    size: 60,
    rotation: 0,
    isCustom: false
  },
  {
    id: uuidv4(),
    name: 'Debugging Tools',
    description: 'Monitor system events, log console output, and debug application state',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzE0YjhhNiIgLz48cGF0aCBkPSJNMTggOGwtMiAyLTQtNC00IDRMNiA4IDEwIDQiIHN0cm9rZT0id2hpdGUiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTggMTZsLTItMi00IDQtNC00LTIgMkwxMCAyMCI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIHN0cm9rZT0id2hpdGUiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMS41Ii8+PC9zdmc+',
    widgetType: 'DebuggingWidget',
    position: { x: 0, y: 0 },
    placed: false,
    size: 65,
    rotation: 0,
    isCustom: false
  }
];
