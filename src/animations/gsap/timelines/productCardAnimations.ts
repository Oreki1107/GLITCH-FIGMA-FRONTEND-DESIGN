/**
 * Product Card Animations
 * Stagger entrance animation factory for product grids, scroll inertia,
 * and ambient behaviors.
 *
 * Design intent:
 * - Cards establish weight and rhythm when entering.
 * - The grid reacts physically to scroll momentum.
 * - Cards possess ambient presence (breathing) when resting, but only
 *   when receiving attention (e.g., expanded/featured).
 */
import { gsap, ScrollTrigger } from "@/animations/gsap/plugins";
import { animationConfig } from "@/config/animation.config";

const { duration, easing, stagger } = animationConfig;

/**
 * cardEnter
 * Asynchronous viewport-revealed staggered entry.
 * Cards unfold (rotationX) and surface from below.
 *
 * @param elements - Array or NodeList of card article elements
 */
export function cardEnter(elements: Element[] | NodeListOf<Element>) {
  // Clear any existing scroll triggers on these elements to prevent duplicates
  // since useGSAP might run multiple times in dev
  elements.forEach(el => gsap.killTweensOf(el));

  // Use fromTo inside batch for safe React strict-mode mounting
  ScrollTrigger.batch(elements, {
    interval: 0.1, // time window to batch elements entering together
    batchMax: 4, // max items per batch
    onEnter: (batch) =>
      gsap.fromTo(batch, 
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
          rotationX: -10,
          transformPerspective: 1000,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: duration.slow,
          ease: easing.smooth,
          stagger: stagger.card,
          clearProps: "transform,opacity,scale",
          overwrite: true,
        }
      ),
    start: "top 90%", // Trigger slightly before it hits the bottom
    once: true,
  });
}

/**
 * cardExit
 * Quick collapse when grid content is replaced (e.g. filter change).
 */
export function cardExit(elements: Element[] | NodeListOf<Element>): gsap.core.Timeline {
  return gsap
    .timeline()
    .to(elements, {
      opacity: 0,
      y: -8,
      duration: duration.fast,
      ease: easing.exit,
      stagger: stagger.card * 0.5,
    });
}

/**
 * createGridInertia
 * Ties grid skew to scroll velocity.
 * 
 * @param gridRef Grid container element
 */
export function createGridInertia(gridRef: Element) {
  // Use a proxy object to smooth the velocity value
  const proxy = { skew: 0 };
  const setter = gsap.quickSetter(gridRef, "skewY", "deg");
  
  // Create a scroll trigger just to track velocity
  ScrollTrigger.create({
    trigger: document.body,
    start: 0,
    end: "max",
    onUpdate: (self) => {
      let skew = self.getVelocity() / -200; // clamp and map velocity
      // Cap the maximum skew to keep it subtle
      if (skew > 2) skew = 2;
      if (skew < -2) skew = -2;
      
      // Animate the proxy to the target skew to smooth it out
      gsap.to(proxy, {
        skew: skew,
        duration: 0.4,
        ease: easing.inertia,
        overwrite: true,
        onUpdate: () => setter(proxy.skew)
      });
    }
  });

  // Ensure it resets to 0 when scrolling stops
  ScrollTrigger.addEventListener("scrollEnd", () => {
    gsap.to(proxy, {
      skew: 0,
      duration: 0.6,
      ease: easing.elastic,
      overwrite: true,
      onUpdate: () => setter(proxy.skew)
    });
  });
}

/**
 * createAmbientBreathing
 * Applies a micro-float loop to a target.
 * Only applied to high-attention cards to prevent visual noise.
 */
export function createAmbientBreathing(target: Element): gsap.core.Tween {
  // Set initial state
  gsap.set(target, { y: 0 });
  
  return gsap.to(target, {
    y: -3,
    duration: 3,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
}
