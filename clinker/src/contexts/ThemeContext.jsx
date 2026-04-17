import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isPremium) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isPremium]);

  const toggleTheme = () => {
    setIsPremium(!isPremium);
  };

  return (
    <ThemeContext.Provider value={{ isPremium, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};