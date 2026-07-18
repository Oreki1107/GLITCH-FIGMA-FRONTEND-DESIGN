/**
 * Page Transition Animations
 * Defines enter and exit timeline factories for view transitions in App.tsx.
 *
 * Design intent:
 * - Enter: content fades in + rises 8px — feels like it's surfacing.
 * - Exit: content fades out + sinks 4px — steps back to give way.
 * - Duration: fast enough to feel snappy, slow enough to feel deliberate.
 * - Interruptible: timelines can be killed and reversed mid-flight.
 *
 * GLYCH motion language: physical, directional, never decorative.
 */
import { gsap } from "@/animations/gsap/plugins";
import { animationConfig } from "@/config/animation.config";

const { duration, easing } = animationConfig;

/**
 * enterPage
 * Animates a view container into its resting state.
 * Called after the view state has updated and the new content is mounted.
 *
 * @param el - The view wrapper element to animate
 * @returns A GSAP timeline (can be killed for interruptibility)
 */
export function enterPage(el: Element): gsap.core.Timeline {
  return gsap
    .timeline()
    .fromTo(
      el,
      {
        opacity: 0,
        y: 10,
        // Start slightly scaled down for a subtle "zoom-in" feel
        scale: 0.995,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: duration.moderate,
        ease: easing.enter,
        clearProps: "transform,opacity,scale",
      },
    );
}

/**
 * exitPage
 * Animates the current view container out before a new view mounts.
 * Called before view state updates — content must still be in DOM.
 *
 * @param el - The view wrapper element to animate
 * @returns A GSAP timeline (awaited before view swap)
 */
export function exitPage(el: Element): gsap.core.Timeline {
  return gsap
    .timeline()
    .to(el, {
      opacity: 0,
      y: -6,
      scale: 0.997,
      duration: duration.fast,
      ease: easing.exit,
    });
}
