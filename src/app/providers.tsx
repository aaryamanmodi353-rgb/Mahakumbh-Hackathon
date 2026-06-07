'use client';

import { LocationProvider } from '@/context/LocationContext';
import { ThemeProvider } from '@/context/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocationProvider>{children}</LocationProvider>
    </ThemeProvider>
  );
}
