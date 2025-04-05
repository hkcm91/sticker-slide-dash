
export interface Sticker {
  id: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
  placed: boolean;
  size?: number;
  rotation?: number;
  widgetType?: string; // Maps to a registered widget name
}

export interface WidgetData {
  title: string;
  content: string;
  component?: React.ComponentType<any>;
}
