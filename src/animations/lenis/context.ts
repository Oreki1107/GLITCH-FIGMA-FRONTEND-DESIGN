import { createContext, useContext } from 'react';

export interface LenisContextValue {
  ready: boolean;
  registerInstance?: (id: string, instance: unknown) => void;
}

const LenisContext = createContext<LenisContextValue>({ ready: false });

export function useLenisContext() {
  return useContext(LenisContext);
}

export { LenisContext };
