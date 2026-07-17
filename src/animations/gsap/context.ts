import { createContext, useContext } from 'react';

export interface GSAPContextValue {
  ready: boolean;
  registerTimeline?: (id: string, timeline: unknown) => void;
}

const GSAPContext = createContext<GSAPContextValue>({ ready: false });

export function useGSAPContext() {
  return useContext(GSAPContext);
}

export { GSAPContext };
