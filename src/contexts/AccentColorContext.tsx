
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface AccentColorContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const AccentColorContext = createContext<AccentColorContextType>({
  accentColor: 'green',
  setAccentColor: () => { },
});

export const useAccentColor = () => useContext(AccentColorContext);

interface AccentColorProviderProps {
  children: ReactNode;
}

export const AccentColorProvider: React.FC<AccentColorProviderProps> = ({ children }) => {
  const [accentColor, setAccentColorState] = useState<string>(() => {
    return localStorage.getItem('accentColor') || 'green';
  });

  // Update localStorage and body class on accentColor change
  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    // Remove previous accent-* classes
    document.body.classList.remove(
      'accent-green', 'accent-blue', 'accent-purple', 'accent-orange', 'accent-red', 'accent-teal'
    );
    document.body.classList.add(`accent-${accentColor}`);
  }, [accentColor]);

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
  };

  return (
    <AccentColorContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </AccentColorContext.Provider>
  );
};
