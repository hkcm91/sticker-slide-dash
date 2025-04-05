
export interface Sticker {
  id: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
  placed: boolean;
}

export interface WidgetData {
  title: string;
  content: string;
}
