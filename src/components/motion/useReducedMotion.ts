/**
 * useReducedMotion
 *
 * Reads the user's `prefers-reduced-motion` media preference.
 * When true, all animations in the GLYCH motion system will:
 * - Disable autoplay
 * - Disable looping
 * - Show the final frame statically
 * - Produce no flashing or excessive movement
 */
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
