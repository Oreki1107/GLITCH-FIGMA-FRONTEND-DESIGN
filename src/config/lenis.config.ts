/**
 * GLYCH Lenis Scroll Configuration
 * Controls smooth scroll behavior across the entire application.
 * Tuned for streetwear digital-native feel: responsive but with weight.
 */
import type { LenisOptions } from "lenis";

export interface LenisConfig {
  enabled: boolean;
  smooth: boolean;
  options: LenisOptions;
}

export const lenisConfig: LenisConfig = {
  enabled: true,
  smooth: true,
  options: {
    /**
     * lerp: interpolation factor per frame.
     * Lower = more momentum (heavier). Higher = snappier.
     * 0.05 gives cinematic physical weight without sluggishness, creating a true camera rig feel.
     */
    lerp: 0.05,
    /**
     * wheelMultiplier: adjusts the raw scroll distance.
     * 0.9 makes standard wheel ticks feel controlled but slightly more robust against the heavy lerp.
     */
    wheelMultiplier: 0.9,
    /**
     * duration: scroll duration in seconds (used when lerp is not set).
     * We use lerp, so this is a fallback reference.
     */
    duration: 1.2,
    /**
     * smoothWheel: apply smooth scroll to mouse wheel events.
     */
    smoothWheel: true,
    /**
     * syncTouch: on touch devices, sync the scroll position
     * with Lenis rather than using native scroll.
     * Improves scroll-triggered animation consistency.
     */
    syncTouch: false,
    /**
     * orientation: vertical scroll (default).
     */
    orientation: "vertical",
    /**
     * gestureOrientation: which gesture axis to intercept.
     */
    gestureOrientation: "vertical",
    /**
     * overscroll: allow native overscroll (bounce) on mobile.
     * Setting to false feels more technical/controlled.
     */
    overscroll: false,
  },
};
