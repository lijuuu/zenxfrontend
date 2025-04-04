
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface AccentColorContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const AccentColorContext = createContext<AccentColorContextType>({
  accentColor: 'green',
  setAccentColor: () => {},
});

export const useAccentColor = () => useContext(AccentColorContext);

interface AccentColorProviderProps {
  children: ReactNode;
}

export const AccentColorProvider: React.FC<AccentColorProviderProps> = ({ children }) => {
  const [accentColor, setAccentColor] = useState<string>('green');

  return (
    <AccentColorContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </AccentColorContext.Provider>
  );
};
