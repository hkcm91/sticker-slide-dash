
import { useState, useEffect } from 'react';

export function useBackgroundAndHints() {
  const [background, setBackground] = useState<string | null>(null);
  const [hasSeenHint, setHasSeenHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Initialize background and hints on mount
  useEffect(() => {
    const savedBackground = localStorage.getItem('background');
    if (savedBackground) {
      setBackground(savedBackground);
    }

    const hasSeenHintBefore = localStorage.getItem('hasSeenHint');
    if (hasSeenHintBefore) {
      setHasSeenHint(true);
    } else {
      const timer = setTimeout(() => {
        setShowHint(true);
        setTimeout(() => {
          setShowHint(false);
          setHasSeenHint(true);
          localStorage.setItem('hasSeenHint', 'true');
        }, 5000);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Save background to localStorage
  useEffect(() => {
    if (background) {
      localStorage.setItem('background', background);
    } else {
      localStorage.removeItem('background');
    }
  }, [background]);
  
  const handleBackgroundChange = (url: string | null) => {
    setBackground(url);
  };

  return {
    background,
    hasSeenHint,
    showHint,
    handleBackgroundChange
  };
}
