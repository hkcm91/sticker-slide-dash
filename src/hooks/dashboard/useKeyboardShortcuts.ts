
import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  toggleLayerPanel: () => void;
}

export function useKeyboardShortcuts({ toggleLayerPanel }: KeyboardShortcutsProps) {
  // Keyboard shortcut for toggle layer panel
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'l' && e.altKey) {
        toggleLayerPanel();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleLayerPanel]);
}
