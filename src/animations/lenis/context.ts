import { createContext, useContext } from "react";
import type Lenis from "lenis";

export interface LenisContextValue {
  /** true once Lenis is initialized and attached to the GSAP ticker */
  ready: boolean;
  /** The Lenis instance — use for programmatic scroll control */
  lenis?: Lenis;
}

const LenisContext = createContext<LenisContextValue>({ ready: false });

export function useLenisContext() {
  return useContext(LenisContext);
}

export { LenisContext };
