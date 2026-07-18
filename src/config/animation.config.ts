/**
 * GLYCH Animation Configuration
 * Single source of truth for all animation settings.
 * Components and timelines must read from this — never hardcode values.
 */

export interface AnimationEasing {
  // GSAP named eases
  smooth: string;
  snappy: string;
  elastic: string;
  spring: string;
  inertia: string;
  // Entry / exit curves
  enter: string;
  exit: string;
  // Overlay curves
  overlayIn: string;
  overlayOut: string;
}

export interface AnimationDuration {
  /** 80ms — micro-feedback (button press, icon pop) */
  micro: number;
  /** 180ms — exit transitions, fast reveals */
  fast: number;
  /** 280ms — overlay exits, state changes */
  normal: number;
  /** 400ms — overlay entries, card reveals */
  moderate: number;
  /** 600ms — page transitions, hero elements */
  slow: number;
  /** 900ms — cinematic reveals */
  cinematic: number;
}

export interface AnimationConfig {
  enabled: boolean;
  debug: boolean;
  easing: AnimationEasing;
  duration: AnimationDuration;
  /** Stagger delay per element in seconds */
  stagger: {
    card: number;
    list: number;
    section: number;
  };
  /** Parallax and depth tokens for the virtual camera */
  camera: {
    depth: {
      ambient: { z: number; scale: number; y: number; brightness?: number };
      subject: { z: number; scale: number; y: number; brightness?: number };
      productCard: { z: number; scale: number; y: number; brightness?: number };
      typography: { z: number; scale: number; y: number; brightness?: number };
      floating: { z: number; scale: number; y: number; brightness?: number };
      cta: { z: number; scale: number; y: number; brightness?: number };
    };
    momentum: {
      sectionOverlap: number; // For section-to-section camera momentum
      scenes: {
        confident: { scrub: number; yOffset: number; overshootY: number };
        tactile: { scrub: number; yOffset: number; overshootY: number };
        slow: { scrub: number; yOffset: number; overshootY: number };
        reflective: { scrub: number; yOffset: number; overshootY: number };
        arrival: { scrub: number; yOffset: number; overshootY: number };
      }
    };
  };
}

export const animationConfig: AnimationConfig = {
  enabled: true,
  debug: false,

  easing: {
    // Core curves
    smooth: "power2.out",
    snappy: "power3.out",
    elastic: "elastic.out(1, 0.5)",
    spring: "elastic.out(1.2, 0.4)",
    inertia: "power4.out",
    // Directional
    enter: "power2.out",
    exit: "power2.in",
    // Overlay
    overlayIn: "power3.out",
    overlayOut: "power3.in",
  },

  duration: {
    micro: 0.08,
    fast: 0.18,
    normal: 0.28,
    moderate: 0.4,
    slow: 0.6,
    cinematic: 0.9,
  },

  stagger: {
    card: 0.055,
    list: 0.04,
    section: 0.12,
  },

  /** Parallax and depth tokens for the virtual camera */
  camera: {
    depth: {
      ambient: { z: -800, scale: 1.6, y: 0.1, brightness: 0.7 }, // Layer 1 (deepest bg, scaled up to fill perspective)
      subject: { z: -300, scale: 1.25, y: 0, brightness: 0.85 }, // Layer 2 (hero imagery, pushed back)
      productCard: { z: -100, scale: 1.05, y: -0.05 }, // Layer 3 (future integration)
      typography: { z: 150, scale: 1, y: -0.15 }, // Layer 4 (closer)
      floating: { z: 50, scale: 1, y: -0.08 }, // Layer 5 (inherits/floats)
      cta: { z: 300, scale: 1, y: -0.25 }, // Layer 6 (closest)
    },
    momentum: {
      sectionOverlap: -0.08, // 8% virtual overlap for section carry-over
      scenes: {
        confident: { scrub: 1.2, yOffset: 120, overshootY: -3 }, // Snappy compression, micro release
        tactile: { scrub: 1.0, yOffset: 90, overshootY: -4 },    // Heavier physical push
        slow: { scrub: 2.2, yOffset: 150, overshootY: 0 },       // Dissipates slowly into 0
        reflective: { scrub: 1.6, yOffset: 80, overshootY: -1 }, // Barely overshoots, rests softly
        arrival: { scrub: 1.4, yOffset: 180, overshootY: -2 },   // Heavy drop, minimal bounce
      }
    },
  },
};
