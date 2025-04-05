
import { createWidgetSticker } from '@/utils/createWidgetSticker';
import PomodoroWidget from './PomodoroWidget';

// Create and export a ready-to-use Pomodoro sticker
const pomodoroSticker = createWidgetSticker({
  name: 'Pomodoro',
  letter: 'P',
  backgroundColor: '#FF5722',
  widgetAPI: PomodoroWidget,
  title: 'Pomodoro Timer',
  description: 'A simple Pomodoro timer to help you stay focused.'
});

export default pomodoroSticker;
