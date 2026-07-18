/**
 * AnimationProvider
 * Initializes GSAP and registers all plugins once at application startup.
 * Exposes { ready, gsap, registerTimeline } via GSAPContext.
 *
 * Positioned as the outermost provider in AppProviders so GSAP is
 * available before any child animation consumers mount.
 */
import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { gsap } from "gsap";
import { GSAPContext } from "@/animations/gsap/context";
import type { GSAPContextValue } from "@/animations/gsap/context";
import { registerGsapPlugins } from "@/animations/gsap/plugins";
import { registerGsapTimeline } from "@/animations/gsap/registry";
import { animationConfig } from "@/config/animation.config";

export function AnimationProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!animationConfig.enabled) {
      setReady(false);
      return;
    }

    // Register all GSAP plugins (ScrollTrigger, CustomEase).
    // This must happen before any ScrollTrigger or CustomEase usage.
    registerGsapPlugins();

    // Set GSAP global defaults aligned with the GLYCH motion language.
    // Components can override per-tween, but this sets the baseline.
    gsap.defaults({
      ease: animationConfig.easing.smooth,
      duration: animationConfig.duration.normal,
    });

    // Respect prefers-reduced-motion at the GSAP level.
    // When reduced motion is active, globalTimeScale(0) collapses all animations to instant.
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionPreference = (e: MediaQueryListEvent | MediaQueryList) => {
      gsap.globalTimeline.timeScale(e.matches ? 0 : 1);
    };

    applyMotionPreference(mediaQuery);
    mediaQuery.addEventListener("change", applyMotionPreference);

    setReady(true);

    return () => {
      mediaQuery.removeEventListener("change", applyMotionPreference);
    };
  }, []);

  const contextValue = useMemo<GSAPContextValue>(
    () => ({
      ready,
      gsap,
      registerTimeline: registerGsapTimeline,
    }),
    [ready],
  );

  return (
    <GSAPContext.Provider value={contextValue}>
      {children}
    </GSAPContext.Provider>
  );
}
