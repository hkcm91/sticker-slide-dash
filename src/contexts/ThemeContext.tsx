
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';
type SidebarStyle = 'default' | 'minimal' | 'colorful';
type BackgroundStyle = 'solid' | 'gradient' | 'image';

interface GradientOptions {
  startColor: string;
  endColor: string;
  direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
}

interface ThemeOptions {
  mode: ThemeMode;
  sidebarStyle: SidebarStyle;
  backgroundStyle: BackgroundStyle;
  backgroundColor: string;
  gradientOptions: GradientOptions;
  backgroundOpacity: number;
}

interface ThemeContextType {
  theme: ThemeOptions;
  setTheme: React.Dispatch<React.SetStateAction<ThemeOptions>>;
  toggleMode: () => void;
  updateSidebarStyle: (style: SidebarStyle) => void;
  updateBackgroundStyle: (style: BackgroundStyle) => void;
  updateBackgroundColor: (color: string) => void;
  updateGradientOptions: (options: Partial<GradientOptions>) => void;
  updateBackgroundOpacity: (opacity: number) => void;
}

const defaultTheme: ThemeOptions = {
  mode: 'light',
  sidebarStyle: 'default',
  backgroundStyle: 'solid',
  backgroundColor: '#ffffff',
  gradientOptions: {
    startColor: '#e5deff',
    endColor: '#d3e4fd',
    direction: 'to-r'
  },
  backgroundOpacity: 1
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Make sure React is properly imported
  const [theme, setTheme] = useState<ThemeOptions>(() => {
    const savedTheme = localStorage.getItem('theme-preferences');
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem('theme-preferences', JSON.stringify(theme));
    
    // Apply theme mode to document
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleMode = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light'
    }));
  };

  const updateSidebarStyle = (style: SidebarStyle) => {
    setTheme(prev => ({
      ...prev,
      sidebarStyle: style
    }));
  };

  const updateBackgroundStyle = (style: BackgroundStyle) => {
    setTheme(prev => ({
      ...prev,
      backgroundStyle: style
    }));
  };

  const updateBackgroundColor = (color: string) => {
    setTheme(prev => ({
      ...prev,
      backgroundColor: color
    }));
  };

  const updateGradientOptions = (options: Partial<GradientOptions>) => {
    setTheme(prev => ({
      ...prev,
      gradientOptions: {
        ...prev.gradientOptions,
        ...options
      }
    }));
  };

  const updateBackgroundOpacity = (opacity: number) => {
    setTheme(prev => ({
      ...prev,
      backgroundOpacity: opacity
    }));
  };

  const value = {
    theme,
    setTheme,
    toggleMode,
    updateSidebarStyle,
    updateBackgroundStyle,
    updateBackgroundColor,
    updateGradientOptions,
    updateBackgroundOpacity
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
