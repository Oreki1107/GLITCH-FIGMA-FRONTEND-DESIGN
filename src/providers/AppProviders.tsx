import type { PropsWithChildren } from 'react';
import { AnimationProvider } from './AnimationProvider';
import { LenisProvider } from './LenisProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AnimationProvider>
      <LenisProvider>{children}</LenisProvider>
    </AnimationProvider>
  );
}
