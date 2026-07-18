/**
 * LenisProvider
 * Initializes Lenis smooth scroll and integrates it with the GSAP ticker
 * so that ScrollTrigger animations stay in sync with smooth scroll position.
 *
 * Must be nested inside AnimationProvider so GSAP is already initialized.
 * Exposes the Lenis instance via LenisContext for programmatic scroll control.
 */
import { useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LenisContext } from "@/animations/lenis/context";
import type { LenisContextValue } from "@/animations/lenis/context";
import { lenisConfig } from "@/config/lenis.config";

export function LenisProvider({ children }: PropsWithChildren) {
  const lenisRef = useRef<Lenis | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!lenisConfig.enabled) {
      setReady(false);
      return;
    }

    // Initialize Lenis with the project configuration.
    const lenis = new Lenis(lenisConfig.options);
    lenisRef.current = lenis;

    /**
     * Integrate Lenis with GSAP ticker.
     * This ensures Lenis updates on every GSAP animation frame,
     * keeping ScrollTrigger scrub positions in sync with
     * the smoothed scroll position rather than native scroll.
     */
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000); // GSAP time is in seconds; Lenis expects ms
    };

    gsap.ticker.add(tickerCallback);

    /**
     * Disable GSAP's built-in lag smoothing when Lenis is active.
     * Lenis handles its own frame pacing. Lag smoothing from GSAP
     * can cause double-smoothing artifacts.
     */
    gsap.ticker.lagSmoothing(0);

    /**
     * Tell ScrollTrigger to use Lenis's scrollTop as the source of truth
     * rather than window.scrollY. This is critical for scrubbed animations
     * that must follow the smoothed scroll position.
     */
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    // Keep ScrollTrigger in sync with Lenis scroll events
    lenis.on("scroll", ScrollTrigger.update);

    setReady(true);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      setReady(false);
    };
  }, []);

  const contextValue = useMemo<LenisContextValue>(
    () => ({
      ready,
      lenis: lenisRef.current ?? undefined,
    }),
    [ready],
  );

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  );
}
