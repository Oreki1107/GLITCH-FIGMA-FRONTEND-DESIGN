import { createContext, useContext } from "react";
import type { gsap as GsapType } from "gsap";

export interface GSAPContextValue {
  /** true once GSAP plugins are registered and ready */
  ready: boolean;
  /** Reference to the global gsap instance */
  gsap?: typeof GsapType;
  /** Register a timeline in the global registry for debugging */
  registerTimeline?: (id: string, timeline: unknown) => void;
}

const GSAPContext = createContext<GSAPContextValue>({ ready: false });

export function useGSAPContext() {
  return useContext(GSAPContext);
}

export { GSAPContext };
