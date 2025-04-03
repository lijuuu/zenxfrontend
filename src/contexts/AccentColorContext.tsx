
import React, { createContext, useContext, ReactNode, useState } from 'react';

// Create a context with a default green accent color
interface AccentColorContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const defaultContext: AccentColorContextType = { 
  accentColor: '#3CE7B2', // Default ZenX green 
  setAccentColor: () => null 
};

const AccentColorContext = createContext<AccentColorContextType>(defaultContext);

export const useAccentColor = () => useContext(AccentColorContext);

interface AccentColorProviderProps {
  children: ReactNode;
  initialColor?: string;
}

export const AccentColorProvider: React.FC<AccentColorProviderProps> = ({ 
  children,
  initialColor = '#3CE7B2' // Default ZenX green
}) => {
  const [accentColor, setAccentColor] = useState(initialColor);

  return (
    <AccentColorContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </AccentColorContext.Provider>
  );
};

export default AccentColorContext;
