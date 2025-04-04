
import React, { createContext, useContext, useState, useEffect } from 'react';

type AccentColor = 'green' | 'blue' | 'purple' | 'amber' | 'red' | 'pink';

interface AccentColorContextProps {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const AccentColorContext = createContext<AccentColorContextProps>({
  accentColor: 'green',
  setAccentColor: () => {},
});

export const useAccentColor = () => useContext(AccentColorContext);

export const AccentColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColor] = useState<AccentColor>('green');

  useEffect(() => {
    // Load saved preference from local storage
    const savedColor = localStorage.getItem('accentColor') as AccentColor;
    if (savedColor) {
      setAccentColor(savedColor);
    }
  }, []);

  const updateAccentColor = (color: AccentColor) => {
    setAccentColor(color);
    localStorage.setItem('accentColor', color);
    
    // Update CSS variables or class names here if needed
    document.documentElement.setAttribute('data-accent', color);
  };

  return (
    <AccentColorContext.Provider value={{ accentColor, setAccentColor: updateAccentColor }}>
      {children}
    </AccentColorContext.Provider>
  );
};
