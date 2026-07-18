/**
 * GSAP Plugin Registry
 * Registers all GSAP plugins in one place.
 * Called once during AnimationProvider initialization.
 *
 * All plugins imported here are registered globally with GSAP,
 * making them available in every timeline and tween across the app.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

import { useGSAP } from "@gsap/react";

/**
 * registerGsapPlugins()
 * Call this exactly once at application startup.
 */
export function registerGsapPlugins(): void {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);
  }
}

// Call synchronously to avoid race conditions with useGSAP hooks in children
registerGsapPlugins();

/**
 * Export plugin references for use in timeline files.
 * Import from here rather than directly from gsap/* to maintain
 * a single registration point.
 */
export { gsap, ScrollTrigger, CustomEase };

/** Legacy array export — kept for backwards compatibility with placeholder consumers */
export const gsapPlugins = ["ScrollTrigger", "CustomEase"];
