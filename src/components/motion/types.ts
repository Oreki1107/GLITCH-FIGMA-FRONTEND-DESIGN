/**
 * Motion System — Shared Types
 *
 * Central type definitions for the GLYCH motion design system.
 * All animation components implement this contract.
 */

/** Standard animation sizes following GLYCH's responsive scale */
export type AnimationSize = 24 | 32 | 48 | 64 | 96 | 128 | 256;

/** Controls how the animation is triggered */
export type AnimationTrigger = "auto" | "hover" | "click" | "view" | "none";

/** Imperative controls exposed via ref for parent-driven interactions */
export interface AnimationControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  reset: () => void;
  restart: () => void;
}

/** Unified prop interface for every animation component in the GLYCH system */
export interface AnimationProps {
  /**
   * Uniform size (width & height) using GLYCH's responsive scale.
   * Use `width`/`height` for custom non-square dimensions.
   */
  size?: AnimationSize;
  /** Custom width in px. Overrides `size`. */
  width?: number;
  /** Custom height in px. Overrides `size`. */
  height?: number;
  /** Whether the animation should loop. Defaults per-component. */
  loop?: boolean;
  /** Whether to begin playing immediately on mount. */
  autoplay?: boolean;
  /** Playback speed multiplier. 1 = normal, 2 = double, 0.5 = half. */
  speed?: number;
  /**
   * Play once and freeze on the final frame.
   * Respects `prefers-reduced-motion` automatically.
   */
  playOnce?: boolean;
  /**
   * Trigger playback when the component enters the viewport.
   * Uses IntersectionObserver. Pairs well with `playOnce`.
   */
  triggerOnView?: boolean;
  /** Delay in ms before the animation starts. */
  delay?: number;
  /** Additional class names applied to the wrapper element. */
  className?: string;
  /** Callback fired when the animation completes. */
  onComplete?: () => void;
  /** Callback fired on click. Also triggers play if triggerOnView is false. */
  onClick?: () => void;
  /** Accessible label for screen readers. */
  ariaLabel?: string;
  /** Ref forwarded for imperative control. */
  controlRef?: React.RefObject<AnimationControls | null>;
  /** Design system color mapping strategy. Defaults to "original". */
  colorMode?: "accent" | "monochrome" | "original";
}
