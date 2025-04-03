
import React, { createContext, useContext } from 'react';

// Simple context that always provides dark theme
interface ThemeContextType {
  theme: string;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'dark' });

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
