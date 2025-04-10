
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcut {
  key: string;
  description: string;
}

const defaultShortcuts: KeyboardShortcut[] = [
  { key: "Shift + Click", description: "Add to selection" },
  { key: "Alt + L", description: "Toggle layer panel" },
  { key: "Shift + Mouse Wheel", description: "Resize selected stickers" },
  { key: "R", description: "Rotate sticker (when hovering)" },
  { key: "[ ]", description: "Adjust opacity (when hovering)" },
  { key: "- =", description: "Adjust z-index (when hovering)" }
];

interface LayerKeyboardShortcutsProps {
  shortcuts?: KeyboardShortcut[];
}

/**
 * Component to display keyboard shortcuts in the layer panel
 */
const LayerKeyboardShortcuts: React.FC<LayerKeyboardShortcutsProps> = ({
  shortcuts = defaultShortcuts
}) => {
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  return (
    <div className="border-t border-gray-200 dark:border-gray-800 p-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
        className="text-xs w-full justify-start"
      >
        <Keyboard className="w-3.5 h-3.5 mr-2" />
        {showKeyboardShortcuts ? "Hide Shortcuts" : "Keyboard Shortcuts"}
      </Button>
      
      {showKeyboardShortcuts && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-md p-2">
          <ul className="space-y-1">
            {shortcuts.map((shortcut, index) => (
              <li key={index} className="flex justify-between">
                <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">{shortcut.key}</span>
                <span>{shortcut.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LayerKeyboardShortcuts;
