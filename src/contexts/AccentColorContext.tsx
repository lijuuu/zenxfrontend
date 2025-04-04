
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AccentColorContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const AccentColorContext = createContext<AccentColorContextType | undefined>(undefined);

export const AccentColorProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [accentColor, setAccentColor] = useState('green');

  return (
    <AccentColorContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </AccentColorContext.Provider>
  );
};

export const useAccentColor = () => {
  const context = useContext(AccentColorContext);
  if (context === undefined) {
    throw new Error('useAccentColor must be used within an AccentColorProvider');
  }
  return context;
};

export default AccentColorContext;
