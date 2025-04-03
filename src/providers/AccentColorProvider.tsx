
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface AccentColorContextProps {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const AccentColorContext = createContext<AccentColorContextProps>({
  accentColor: '#3CE7B2', // Default green color
  setAccentColor: () => {},
});

export const useAccentColor = () => useContext(AccentColorContext);

interface AccentColorProviderProps {
  children: ReactNode;
}

export const AccentColorProvider: React.FC<AccentColorProviderProps> = ({ children }) => {
  const [accentColor, setAccentColor] = useState('#3CE7B2'); // Default green color

  return (
    <AccentColorContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </AccentColorContext.Provider>
  );
};

export default AccentColorProvider;
