/**
 * Interaction Animations
 * Timeline factories for overlay enter/exit animations.
 *
 * Design intent:
 * - Inventory tray (configure object): Slides up from bottom, like a physical tray.
 *   Feels tactile and grounded — content is pulled up into view.
 * - Nav overlay (index): Fades and scales in from slightly behind.
 *   Feels like a layer surfacing on top of the current experience.
 *
 * Both are interruptible — any running timeline is killed before a new one fires.
 * autoAlpha is used instead of opacity: GSAP sets visibility: hidden when
 * opacity reaches 0, preventing tab-focus on hidden overlays.
 */
import { gsap } from "@/animations/gsap/plugins";
import { animationConfig } from "@/config/animation.config";

const { duration, easing } = animationConfig;

/** Slide up from bottom — used for inventory tray */
export function slideUpOverlay(el: Element): gsap.core.Timeline {
  return gsap
    .timeline()
    .fromTo(
      el,
      { autoAlpha: 0, y: "100%", scale: 1 },
      {
        autoAlpha: 1,
        y: "0%",
        duration: duration.moderate,
        ease: easing.overlayIn,
        clearProps: "transform",
      },
    );
}

/** Slide down to bottom — inventory tray exit */
export function slideDownOverlay(el: Element): gsap.core.Timeline {
  return gsap
    .timeline()
    .to(el, {
      autoAlpha: 0,
      y: "100%",
      duration: duration.normal,
      ease: easing.overlayOut,
    });
}

/** Fade + subtle scale up — used for nav overlay */
export function fadeScaleOverlay(el: Element): gsap.core.Timeline {
  return gsap
    .timeline()
    .fromTo(
      el,
      { autoAlpha: 0, scale: 0.97, y: 6 },
      {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: duration.moderate,
        ease: easing.overlayIn,
        clearProps: "transform",
      },
    );
}

/** Fade + scale down — nav overlay exit */
export function fadeScaleOut(el: Element): gsap.core.Timeline {
  return gsap
    .timeline()
    .to(el, {
      autoAlpha: 0,
      scale: 0.98,
      y: -4,
      duration: duration.fast,
      ease: easing.overlayOut,
    });
}
