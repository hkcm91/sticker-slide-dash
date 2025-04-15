
// Icons for built-in stickers
const heartIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>');
const homeIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>');
const coffeeIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>');
const sunIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>');
const starIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>');
const bookIcon = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>');

import { Sticker as StickerType } from '@/types/stickers';
import pomodoroSticker from '@/widgets/PomodoroSticker';
import { toDoListSticker } from '@/widgets/ToDoListWidget';
import { builtInWidgets } from '@/widgets/builtin';

const builtInWidgetStickers = builtInWidgets.map(widget => widget.sticker);

export const initialStickers: StickerType[] = [
  { id: '1', name: 'Heart', icon: heartIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '2', name: 'Home', icon: homeIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '3', name: 'Coffee', icon: coffeeIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '4', name: 'Sun', icon: sunIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '5', name: 'Star', icon: starIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  { id: '6', name: 'Book', icon: bookIcon, position: { x: 0, y: 0 }, placed: false, size: 60, rotation: 0 },
  pomodoroSticker,
  toDoListSticker,
  ...builtInWidgetStickers,
];
