import React from 'react';
import { useAccentColor } from '@/contexts/AccentColorContext';

const COLORS = [
  { name: 'Green', value: 'green', className: 'bg-[hsl(var(--accent-green))]' },
  { name: 'Blue', value: 'blue', className: 'bg-[hsl(var(--accent-blue))]' },
  { name: 'Purple', value: 'purple', className: 'bg-[hsl(var(--accent-purple))]' },
  { name: 'Orange', value: 'orange', className: 'bg-[hsl(var(--accent-orange))]' },
  { name: 'Red', value: 'red', className: 'bg-[hsl(var(--accent-red))]' },
  { name: 'Teal', value: 'teal', className: 'bg-[hsl(var(--accent-teal))]' },
];

const ThemeColorTab: React.FC = () => {
  const { accentColor, setAccentColor } = useAccentColor();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Theme & Accent Color</h2>
      <p className="text-zinc-400 text-sm mb-4">Choose your preferred accent color. This will update the primary color used throughout the app.</p>
      <div className="flex gap-4 flex-wrap">
        {COLORS.map((color) => (
          <button
            key={color.value}
            className={`w-12 h-12 rounded-full border-4 transition-all duration-200 focus:outline-none ${color.className} ${accentColor === color.value ? 'border-white scale-110 shadow-lg' : 'border-zinc-700'}`}
            aria-label={`Set accent color to ${color.name}`}
            onClick={() => setAccentColor(color.value)}
          >
            {accentColor === color.value && (
              <span className="block w-full h-full rounded-full border-2 border-white"></span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4 text-sm text-zinc-500">
        Current accent color: <span className="font-semibold capitalize">{accentColor}</span>
      </div>
    </div>
  );
};

export default ThemeColorTab;
