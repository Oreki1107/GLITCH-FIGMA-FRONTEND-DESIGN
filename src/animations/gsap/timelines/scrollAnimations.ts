/**
 * Scroll Animations
 * Timelines and factories for ScrollTrigger-based animations.
 *
 * Design intent:
 * - Parallax shouldn't just move things at different speeds; it should
 *   create a sense of physical depth between layers.
 * - Used in Hero section to sink the background and float the foreground copy.
 * - Choreographed as a single, connected scene responding to scroll.
 */
import { gsap } from "@/animations/gsap/plugins";
import { animationConfig } from "@/config/animation.config";

export interface HeroParallaxLayers {
  ambient: Element;
  subject: Element;
  productCard?: Element | null;
  typography: Element;
  floatingUI?: Element | null;
  cta?: Element | null;
}

/**
 * Creates a master parallax effect tied to scroll position.
 * The hero exists as a layered physical scene. The camera moves through it.
 * Depth is conveyed by proportional inverse movement, z-axis, scale, and blur.
 */
export function createHeroParallax(
  triggerRef: Element,
  layers: HeroParallaxLayers
): gsap.MatchMedia {
  const mm = gsap.matchMedia();

  mm.add(
    {
      isMobile: "(max-width: 767px)",
      isDesktop: "(min-width: 768px)",
    },
    (context) => {
      const { isMobile } = context.conditions as { isMobile: boolean };

      // Reduce amplitude on mobile, but keep same depth relationships
      const amplitude = isMobile ? 0.6 : 1;
      const d = animationConfig.camera.depth;

      // Ensure elements are pre-positioned in 3D space (Phase 1: 0% scroll)
      gsap.set(layers.ambient, { 
        z: d.ambient.z * amplitude, 
        scale: d.ambient.scale,
        filter: "brightness(0.7) blur(0px)",
      });
      gsap.set(layers.subject, { 
        z: d.subject.z * amplitude, 
        scale: d.subject.scale,
        filter: "brightness(0.85)",
      });
      if (layers.productCard) gsap.set(layers.productCard, { z: d.productCard.z * amplitude, scale: d.productCard.scale });
      gsap.set(layers.typography, { z: d.typography.z * amplitude, scale: d.typography.scale });
      if (layers.floatingUI) gsap.set(layers.floatingUI, { z: d.floating.z * amplitude, scale: d.floating.scale });
      if (layers.cta) gsap.set(layers.cta, { z: d.cta.z * amplitude, scale: d.cta.scale });

      // Master Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef,
          start: "top top",
          end: "bottom top",
          scrub: 1.5, // Heavy, deliberate camera smoothing
        },
      });

      // --- PHASE 2: Early Scroll (0% - 15%) ---
      // Immediate camera push. The user should feel the depth instantly.
      tl.to(layers.subject, { z: d.subject.z * amplitude + 100, scale: 1.08, filter: "brightness(1)", duration: 0.15, ease: "power2.out" }, 0);
      tl.to(layers.typography, { yPercent: d.typography.y * 100 * 0.4, z: d.typography.z * amplitude + 50, duration: 0.15, ease: "power2.out" }, 0);
      if (layers.productCard) {
        tl.to(layers.productCard, { z: d.productCard.z * amplitude + 40, duration: 0.15, ease: "power2.out" }, 0);
      }
      
      // --- PHASE 3: Mid Scroll (15% - 85%) ---
      // Continuous evolution. Ambient blurs, subject pushes down. 
      // The Hero spends most of its lifetime here.
      tl.to(layers.ambient, { yPercent: d.ambient.y * 100 * amplitude, filter: "brightness(0.5) blur(6px)", duration: 0.7, ease: "none" }, 0.15);
      tl.to(layers.subject, { yPercent: d.subject.y * 100 * amplitude + 10, duration: 0.7, ease: "none" }, 0.15);
      tl.to(layers.typography, { yPercent: d.typography.y * 100 * amplitude, duration: 0.7, ease: "none" }, 0.15);
      
      if (layers.productCard) {
        tl.to(layers.productCard, { yPercent: d.productCard.y * 100 * amplitude, duration: 0.7, ease: "none" }, 0.15);
      }
      if (layers.floatingUI) {
        tl.to(layers.floatingUI, { yPercent: d.floating.y * 100 * amplitude, z: d.floating.z * amplitude + 20, duration: 0.85, ease: "none" }, 0);
      }
      if (layers.cta) {
        tl.to(layers.cta, { yPercent: d.cta.y * 100 * amplitude, duration: 0.85, ease: "none" }, 0);
      }

      // --- PHASE 4: Hero Exit (85% - 100%) ---
      // Compression before momentum handoff.
      tl.to(layers.typography, { opacity: 0, yPercent: (d.typography.y * 100 * amplitude) - 20, duration: 0.15, ease: "power1.in" }, 0.85);
      if (layers.productCard) {
        tl.to(layers.productCard, { opacity: 0, duration: 0.15, ease: "power1.in" }, 0.85);
      }
      tl.to(layers.subject, { opacity: 0.5, filter: "brightness(0.3) blur(2px)", z: d.subject.z * amplitude, duration: 0.15, ease: "power2.in" }, 0.85);
    }
  );

  return mm;
}

/**
 * Creates cinematic transitions between Homepage sections based on emotional pacing.
 * Instead of uniform bouncing, we use combinations of multiple physical cues:
 * timing, perspective, camera momentum, scale, and brightness.
 */
export function createSceneTransitions(
  elements: Element[] | NodeListOf<Element>
): void {
  const { scenes } = animationConfig.camera.momentum;

  elements.forEach((el) => {
    const sceneType = el.getAttribute("data-scene") || "tactile";
    const align = el.getAttribute("data-scene-align") || "top";
    const isArrival = sceneType === "arrival";

    // Fallback to tactile if config is missing
    const config = scenes[sceneType as keyof typeof scenes] || scenes.tactile;

    // We apply z-index dynamically so incoming sections overlap gracefully.
    gsap.set(el, { position: "relative", transformOrigin: "center top", zIndex: isArrival ? 1 : 2 });

    // ── INITIAL STATE (Before entering viewport) ──
    if (sceneType === "confident") {
      gsap.set(el, { y: config.yOffset, scale: 0.94, filter: "brightness(0.5) contrast(1.1)" });
    } else if (sceneType === "tactile") {
      gsap.set(el, { y: config.yOffset, scale: 0.98, filter: "brightness(0.8)" });
    } else if (sceneType === "slow") {
      gsap.set(el, { y: config.yOffset, scale: 1.05, filter: "brightness(0.9) blur(4px)" }); // Starts close/blurred
    } else if (sceneType === "reflective") {
      gsap.set(el, { y: config.yOffset, opacity: 0.5, filter: "brightness(0.3)" });
    } else if (sceneType === "arrival") {
      gsap.set(el, { y: config.yOffset, scale: 0.95, filter: "brightness(0.2)" });
    }

    // ── ENTER PHASE (Camera approaching and settling) ──
    // The end position is determined by the anchor alignment, breaking free from pure DOM top borders.
    const enterTl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: align === "center" ? "center center" : "top top",
        scrub: config.scrub,
      },
    });

    // Implement physical resistance curves (compression -> micro overshoot -> release)
    if (sceneType === "confident") {
      // Confident: Strong movement, rapid compression, crisp micro release
      enterTl.to(el, { y: 15, scale: 0.98, filter: "brightness(1) contrast(1.05)", duration: 0.5, ease: "power1.out" })
             .to(el, { y: config.overshootY, scale: 1.01, filter: "brightness(1.05) contrast(1)", duration: 0.3, ease: "power2.inOut" })
             .to(el, { y: 0, scale: 1, filter: "brightness(1) contrast(1)", duration: 0.2, ease: "power2.out" });
    } else if (sceneType === "tactile") {
      // Tactile: Heavier, more resistant compression
      enterTl.to(el, { y: 20, scale: 0.99, duration: 0.6, ease: "power1.out" })
             .to(el, { y: config.overshootY, scale: 1, filter: "brightness(1)", duration: 0.25, ease: "power3.inOut" })
             .to(el, { y: 0, duration: 0.15, ease: "power2.out" });
    } else if (sceneType === "slow") {
      // Slow: Gradually dissipates, never bounces, heavy momentum absorption
      enterTl.to(el, { y: 10, scale: 1.01, filter: "brightness(0.95) blur(1px)", duration: 0.7, ease: "power1.out" })
             .to(el, { y: 0, scale: 1, filter: "brightness(1) blur(0px)", duration: 0.3, ease: "power2.out" });
    } else if (sceneType === "reflective") {
      // Reflective: Fades in from shadows, soft settle
      enterTl.to(el, { y: config.overshootY, opacity: 1, filter: "brightness(1)", duration: 0.8, ease: "power2.out" })
             .to(el, { y: 0, duration: 0.2, ease: "power1.inOut" });
    } else if (sceneType === "arrival") {
      // Arrival: Heavy drop, deep compression, minimal release
      enterTl.to(el, { y: 10, scale: 1.01, filter: "brightness(0.8)", duration: 0.6, ease: "power2.out" })
             .to(el, { y: config.overshootY, scale: 1.01, filter: "brightness(1)", duration: 0.25, ease: "power3.inOut" })
             .to(el, { y: 0, scale: 1, duration: 0.15, ease: "power2.out" });
    }

    // ── EXIT PHASE (Camera pushing past/releasing) ──
    // Arrival (footer) doesn't have an exit phase.
    if (!isArrival) {
      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: align === "center" ? "center center" : "top top",
          end: "bottom top",
          scrub: config.scrub,
        },
      });

      if (sceneType === "confident") {
        // Pushed back sharply as next section confidently overlaps.
        exitTl.to(el, { y: -config.yOffset * 0.5, scale: 0.95, filter: "brightness(0.4)", ease: "none" });
      } else if (sceneType === "tactile") {
        // Moves up gracefully, retaining tactility.
        exitTl.to(el, { y: -config.yOffset * 0.3, scale: 0.98, filter: "brightness(0.7)", ease: "none" });
      } else if (sceneType === "slow") {
        // Sinks into blur.
        exitTl.to(el, { y: -config.yOffset * 0.6, scale: 0.9, filter: "brightness(0.3) blur(6px)", ease: "none" });
      } else if (sceneType === "reflective") {
        // Melts into the shadows.
        exitTl.to(el, { y: -config.yOffset * 0.4, opacity: 0, filter: "brightness(0)", ease: "none" });
      }
    }
  });
}
