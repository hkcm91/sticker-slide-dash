
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleMode } = useTheme();
  const isDarkMode = theme.mode === 'dark';

  return (
    <div className="flex items-center space-x-2">
      <Sun size={16} className={`${!isDarkMode ? 'text-yellow-500' : 'text-gray-400'}`} />
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleMode}
        className={`${isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
      />
      <Moon size={16} className={`${isDarkMode ? 'text-indigo-300' : 'text-gray-400'}`} />
    </div>
  );
};
