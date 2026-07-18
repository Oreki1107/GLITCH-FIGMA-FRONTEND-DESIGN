/**
 * MotionUtils
 *
 * Shared utility functions for the GLYCH motion design system.
 */
import type { AnimationSize } from "./types";

/**
 * Resolves the final pixel dimensions for an animation component.
 * `width`/`height` override `size` when provided.
 */
export function resolveSize(
  size: AnimationSize = 64,
  width?: number,
  height?: number
): { width: number; height: number } {
  return {
    width: width ?? size,
    height: height ?? size,
  };
}

/**
 * Resolves final loop and autoplay state, respecting reduced motion.
 * When reducedMotion is true, loop and autoplay are both disabled.
 */
export function resolvePlaybackSettings(
  options: {
    loop?: boolean;
    autoplay?: boolean;
    playOnce?: boolean;
    reducedMotion: boolean;
  }
): { loop: boolean; autoplay: boolean } {
  const { loop = false, autoplay = true, playOnce = false, reducedMotion } = options;

  if (reducedMotion) {
    return { loop: false, autoplay: false };
  }

  if (playOnce) {
    return { loop: false, autoplay };
  }

  return { loop, autoplay };
}

/**
 * Logs animation errors in development only.
 * Never throws — failures are silent in production.
 */
export function logMotionError(component: string, error: unknown): void {
  if (import.meta.env.DEV) {
    console.warn(`[GLYCH Motion] ${component}: Animation failed to load`, error);
  }
}
