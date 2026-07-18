# GLYCH — Design Engineering Blueprint
### A mobile-first, interaction-native shopping experience
*This document supersedes all prior direction. It is a creative and interaction specification only — no tasks, no code, no roadmap. It is written to be handed directly to a product design team and, subsequently, to an engineering team implementing GSAP, Lenis, SplitType, and gesture tooling.*

---

## 1. Brand Identity

**Glych** is a streetwear label built on a single idea: *the moment something almost breaks is the most human moment a system has.* A glych isn't a failure — it's the instant the machine's polish slips and something real shows through. The product is for people who move through cities like the feed is still loading around them: quick, alert, a half-step ahead of the rendering.

Glych does not sell "premium." It sells **presence** — the feeling of being early, being in on something, being the one who found the drop before it had a name.

**Brand voice:** short, confident, a little cryptic. Never explains the joke. Talks like a group chat, not a catalogue. Copy is lowercase by default where it reads as attitude ("added to inventory"), capitalized only where it reads as a system label ("SIZE — SELECT").

**The single sentence test:** *"I've never seen a shopping experience like this before."* Every decision in this document is filtered through that sentence. If a pattern already exists on another streetwear site, it is disqualified by default.

---

## 2. Emotional Direction

The target feeling is not luxury calm — it is **alert delight**. Specifically, in this order of priority:

1. **Curiosity** — the interface visibly has more in it than what's shown; the user wants to poke it.
2. **Mischief** — interactions have a small element of surprise or play (a card that flinches when you get close, a product that has to be "caught").
3. **Control** — despite the playfulness, every gesture resolves predictably. Physicality builds trust, not chaos.
4. **Momentum** — nothing sits static; scrolling, dragging, and browsing all carry inertia, so motion never starts or stops abruptly.
5. **Belonging** — the tone (copy, sound-adjacent haptics, glych artifacts) signals "you get it," rewarding people already fluent in internet-native, streetwear-native culture.

Explicitly rejected feelings: prestige, hush, reverence, minimalism-as-restraint. Glych is loud in confidence, not loud in clutter.

---

## 3. Mobile Philosophy

This is a **mobile-native** system, not a responsive one. The build sequence for every decision is: *design the gesture → design the one-handed layout → then let desktop inherit and expand it.* Desktop is never the reference; it is the overflow canvas.

Non-negotiable mobile rules:

- **Thumb zone first.** All primary actions (Inventory Pocket, quick-add, nav trigger, filter trigger) live in the bottom 40% of the viewport, reachable by a single thumb without regrip.
- **One-handed gesture chains.** Any core flow (browse → preview → configure → confirm) must be completable with a single hand, thumb-only, without the other hand stabilizing the device.
- **Vertical drag > horizontal drag** for primary interactions (dragging a product toward the Inventory Pocket in the corner is a diagonal/short-throw gesture — never a full-width swipe that fights natural thumb arcs).
- **No hover-dependent meaning.** Anything communicated by `:hover` on desktop must have a touch-native equivalent (press, long-press, drag) that is the *primary* design, not a fallback.
- **Desktop inherits, it doesn't downgrade.** On desktop, mouse position substitutes for proximity/idle-state triggers, and hover extends (not replaces) the tap/long-press vocabulary already defined for mobile.

---

## 4. UX Philosophy

Do not think in pages. Think in **interaction systems** that happen to be arranged behind routes.

- **Discovery over instruction.** The interface teaches itself through consistent, repeatable physics — once a user learns that cards drag, they know every card drags, everywhere, forever. One-time onboarding is allowed **exactly once**, for the single most signature gesture (hero drag-to-cart), and never repeated as a tutorial elsewhere.
- **Reward exploration, don't gate it.** Long-press, drag, tilt, and proximity interactions should always reveal *something* — never a dead end, never a no-op gesture.
- **Every screen has a "living" layer.** Nothing is ever perfectly static; idle-state micro-motion (breathing, drifting, subtle parallax) signals the environment is alive even when untouched — see Motion Hierarchy Level 0.
- **Friction is spent on delight, not on process.** Checkout mechanics, size selection, and account flows stay fast and low-friction; the *browsing* and *collecting* layer is where physicality and play live.

---

## 5. Interaction Philosophy

The core metaphor: **the interface is a surface you manipulate, not a document you read.** Every product is treated as a physical object with mass, not a rectangle with an href.

Design rules for every interactive element:

- **Objects have inertia.** Motion never starts or stops instantly; everything has a perceptible acceleration/deceleration curve tied to gesture velocity, not a fixed timing curve alone.
- **Objects have state memory.** A dragged card that's released mid-air should settle believably (spring-back or fall-through, contextually), never snap invisibly back to origin.
- **Feedback is spatial, not just visual.** Success/failure/progress is communicated through position, scale, and rotation changes, reinforced (not replaced) by color/opacity changes.
- **Proximity matters.** Elements should be aware of nearby touch/cursor position, not just direct contact — this is what makes the Inventory Pocket feel alive (see §12).
- **Glych artifacts are earned, not decorative.** Chromatic-aberration/RGB-split, scanline, and stutter-frame effects are reserved *exclusively* for feedback moments (success, drop confirmation, page-boundary transitions) — never ambient background noise. If glych-as-texture appears everywhere, it stops meaning anything.

---

## 6. Motion Philosophy

### Motion Hierarchy (four levels — every animation is classified into exactly one)

- **Level 0 — Ambient / Idle.** The environment breathing when untouched: subtle drift on hero imagery, a slow idle "breath" scale on the Inventory Pocket, soft parallax on scroll. Always low-amplitude, always loopable, always the first thing disabled under reduced-motion.
- **Level 1 — Responsive / Proximity.** Motion that reacts to the user being *near* something without touching it: a card tilting slightly toward a moving cursor, the Inventory Pocket waking as a dragged item approaches, nav elements compressing as thumb approaches the bottom zone.
- **Level 2 — Direct Manipulation.** Motion that is a 1:1 physical response to active touch: drag-following, long-press card expansion, pinch/zoom on product imagery, pull-to-reveal filters. This layer must never lag behind the input — perceived latency here breaks the "physical object" illusion instantly.
- **Level 3 — Resolution / Reward.** The payoff moment: absorption into the Inventory Pocket, the glych-flash confirmation, a collection's entrance sequence, hero-to-PDP transition. These are the only moments allowed to use the full glych visual vocabulary (RGB split, stutter-frame, flash-frame) at higher amplitude, because they are rare and earned.

**Governing rule:** amplitude and visual noise scale *up* from Level 0 to Level 3. Nothing at Level 0 or 1 should ever be louder than something at Level 3 — this preserves "alive, not noisy."

---

## 7. Layout Philosophy

- **No default grid.** Product grids are never uniform N-column repeats. Column span, vertical offset, and card scale vary intentionally per collection to avoid the "endless catalogue" feeling explicitly rejected in this brief.
- **Density is a storytelling tool.** A drop-focused collection (one hero item, few SKUs) uses a sparse, oversized, almost-empty layout. A general collection uses tighter, denser rhythm. Density itself communicates what kind of collection the user is in — before they read a word.
- **Controlled asymmetry over symmetry.** Every major layout has at least one deliberately off-balance element (a card breaking the row height, a headline overlapping imagery, a product bleeding off-screen at one edge) to keep the composition feeling shot, not assembled.
- **Cropping is intentional, not accidental.** Hero and lifestyle imagery is frequently cropped tight/off-center in a way that implies movement continuing beyond the frame — nothing feels like a centered product photo on a white seamless.
- **Environments, not templates.** Each collection should feel like walking into a different physical space — different composition rhythm, different dominant color temperature drawn from its own photography, different card density — while remaining unmistakably Glych underneath (shared type system, shared motion physics, shared Inventory Pocket).

---

## 8. Typography Philosophy

Bold, confident, modern, technical. Streetwear-signal, not editorial-luxury-signal — this is a deliberate reversal of any prior serif/editorial direction.

- **Display:** an extended/technical grotesque with hard edges and unconventional weight jumps (blueprint reference: something in the register of Neue Machina / Cash / ABC Monument Grotesk Wide) — used at extreme scale, frequently overlapping imagery, sometimes clipped by the viewport edge on purpose.
- **Body:** a clean, high-legibility grotesque (register of Suisse Int'l / Neue Haas Grotesk) kept small and quiet so the display type and photography carry all the visual weight.
- **Utility/system:** a monospace face (register of Space Mono / PP Neue Montreal Mono) used for all "system" data — SKU, price, stock count, size grid, timestamps — reinforcing the idea that the interface is a live system, not a brochure.
- **Hierarchy through scale jumps, not weight subtlety.** Headline-to-body scale ratio should feel aggressive (large jumps), never a gentle editorial step-down.
- **Type as texture.** Oversized headline type is allowed to bleed off-screen, sit behind product imagery at low opacity, or intentionally misregister (a Level-3 glych moment: a headline briefly RGB-splits on scroll-trigger, then resolves).

---

## 9. Photography Direction

Photography dominates and must never default to white-background catalogue shots as the primary experience (studio/white-background shots are permitted only as a secondary, zoom-detail layer on PDP, never as the lead image).

Directional pillars:
- **Lifestyle over studio.** Real bodies in motion, real environments.
- **Urban, concrete, architecture.** Underpasses, stairwells, rooftops, transit — textured city surfaces that echo the "signal/static" brand world.
- **Night and artificial light.** Streetlight, signage glow, headlights, screen-glow on skin — light sources that feel electric rather than natural/soft.
- **Motion over pose.** Mid-stride, mid-turn, fabric caught in movement, subtle motion blur permitted and encouraged.
- **Attitude over smile.** Direct gaze or looking off-frame with confidence; never generic catalogue-smile energy.
- **Intentional imperfection.** Slight grain, occasional flash-harsh moments, asymmetric framing — photography that looks *captured*, not *produced*.

---

## 10. Navigation System

- **No traditional hamburger-drawer as the primary system.** Navigation is reachable within the bottom thumb zone via a persistent, compact nav trigger that expands into a fullscreen, gesture-driven takeover — large type, real imagery per section, swipeable between top-level destinations rather than a static list.
- **Bottom-anchored persistent elements:** nav trigger, search trigger, and the Inventory Pocket coexist in the thumb zone, visually distinct but rhythmically related (same idle-breathing motion language, same press physics), so the whole bottom zone reads as one connected control surface rather than three unrelated buttons.
- **Scroll-aware compression.** Top wordmark/logo area compresses and fades as the user scrolls into content, restoring instantly on any upward scroll intent (not a fixed distance threshold — tied to gesture velocity/direction).
- **Section-to-section is a swipe, not just a scroll.** Within the fullscreen nav takeover, moving between top-level categories (e.g., New / Men / Collections / Archive) is a horizontal swipe with its own inertia, echoing the physicality of the product cards.

---

## 11. Product Card Behaviour

A product card is a physical object, not a link.

**Idle state (Level 0):** subtle autonomous micro-motion — a slow drift, a barely-perceptible tilt shift, as if resting under light tension. Never fully still, never distracting.

**Approach / proximity (Level 1):** as a cursor (desktop) or the user's scroll-driven attention (mobile, via viewport-center proximity) nears a card, it responds — slight lift (scale/shadow increase), slight tilt toward the trigger point, as if noticing.

**Tap:** opens the Product Detail Page via the shared hero-to-PDP transition (see §13/§14) — the card's own image becomes the PDP's hero image, continuous, never a hard cut.

**Short long-press (Level 2):** the card *transforms in place* without navigating away. It expands just enough, within the current layout, to reveal:
- price
- available colorways (as small physical swatch chips, not text)
- rating (as a compact visual mark, not a star-row cliché)
- one or two quick specs (fabric/fit)

The rest of the surrounding grid stays visible and interactive — this is a peek, not a takeover.

**Post-long-press, the card becomes draggable.** Its visual weight increases slightly (subtle scale-up, shadow deepens) to communicate "this is now a physical object you're holding." It follows the finger/cursor with a light lag (mass simulation, not 1:1 rigid tracking) so it feels like it has inertia.

**Release:**
- Released over the Inventory Pocket → absorption sequence (§12).
- Released elsewhere → settles back into its grid position with a believable overshoot-and-settle, not a snap.

**Differentiated color/size states:** unavailable sizes/colors are communicated with a distinct visual treatment during the configuration step (§12), never a flat grayed-out disabled look with no explanation.

---

## 12. Inventory Pocket Behaviour (Cart, reimagined)

The cart is not a cart. It is the **Inventory Pocket** — a permanent, lower-right-anchored presence, present on every screen.

**Idle:** visually calm, occasionally "breathing" (slow scale pulse, long period, low amplitude) — alive but not attention-seeking. Never shakes or bounces to demand attention.

**Wake (Level 1):** as a dragged product enters its proximity radius, the Pocket visibly wakes — brightens, scales slightly, and exerts a gentle magnetic pull that subtly nudges the dragged card's trajectory toward it as it gets close (an assist, not an auto-snap from a distance — the user must still choose to release near it).

**Absorption (Level 3, the signature reward moment):** on release near/over the Pocket, the product card doesn't simply disappear into an icon. It compresses toward the Pocket's center with an accelerating motion, accompanied by a brief, contained glych-flash (RGB-split micro-frame + stutter) exactly at the moment of contact — the interface's most concentrated visual reward, reserved for this and equivalent Level-3 moments only.

**Configuration panel:** absorption does *not* immediately finalize the add. A compact floating panel surfaces adjacent to the Pocket (not a full-screen modal, not a separate page) requesting:
- size
- quantity
- color (if applicable)

The panel is dismissible and thumb-reachable, styled as a small physical control surface (system/mono type for the data fields) rather than a generic form. Confirming visibly increments the Pocket's state (a compact counter/indicator, understated, part of the Pocket object itself rather than a separate badge bolted on).

**Persistent presence:** the Pocket never fully leaves the viewport across the site — it may recede in prominence (lower opacity, smaller idle scale) on immersive full-bleed moments (hero, collection entrances) but never disappears, preserving the "always able to grab and drop" mental model.

---

## 13. Hero Behaviour

The homepage hero establishes the entire brand in one cinematic, interactive moment, built around **one signature product from the current collection.**

- **Cinematic first frame:** a model wearing the signature product, shot per the Photography Direction (urban/night/motion) — full-bleed, sound-off-cinematic in feel (implied motion, not necessarily literal video, though a short ambient loop is appropriate here specifically).
- **The product itself is interactive**, not just background: a floating annotation is anchored to the garment (e.g., near the jacket, the sneaker), displaying price and, for first-time visitors only, a subtle **"Drag to Cart"** guide.
- **One-time onboarding rule:** this guidance appears exactly once per new visitor and never again, anywhere on the site — every other interaction must be discoverable through consistent physics alone.
- **The drag-to-cart gesture from the hero uses the exact same physics as a Product Card long-press-drag** (§11/§12) — the hero is the *teaching moment* for a mechanic used everywhere, not a bespoke one-off.
- **Successful hero drag-to-cart** triggers the full Inventory Pocket absorption sequence (§12) — the very first thing a new visitor does on the site should already be the signature reward moment.

---

## 14. Collection Behaviour

- **Every collection has its own personality**, expressed through: dominant color temperature (drawn from that collection's own photography), grid density/rhythm (§7), and entrance sequence pacing — never a shared, interchangeable template.
- **Entering a collection is a continuation, not a reload.** Arriving from a homepage category or a product card uses a shared-element transition (the source image/type becomes part of the collection's opening composition) so the environment change feels like walking into a room, not loading a URL.
- **Rhythm varies within a collection**, not just between collections — hero product, then a dense cluster, then a sparse full-bleed editorial break, then another cluster — so scrolling through a collection has its own internal pacing rather than a flat repeating scroll.
- **No infinite identical grid.** If a collection is large, it's broken into rhythmic sections (as above) rather than presented as one long undifferentiated scroll of same-size cards.

---

## 15. Search Behaviour

- **Fast, keyboard/touch-first, and physical in feel** — not a static list of text results. Result entries inherit card physicality at a reduced scale (subtle idle motion, tap-to-preview via a lighter version of the long-press peek).
- **Instant, incremental filtering** as the user types — no loading spinners; results should feel like they're already there and simply narrowing, reinforcing the "alive system" feeling.
- **Discovery-oriented empty/pre-query state:** trending and recently-viewed items are shown as soon as search opens, so the surface is never blank — search is a browsing tool, not just a lookup tool.
- **Glych-flash micro-moment** (Level 3, minimal amplitude) on a successful "exact match" result appearing, tying the reward vocabulary back into even a small utility moment.

---

## 16. Product Page Behaviour

- **The PDP opens as the continuation of whatever card/hero was tapped** — the shared-element transition means the tapped image is already the top of the PDP before any new content loads in.
- **Gallery is gesture-first:** swipe/drag to move between images (not just tap-through dots), pinch-to-zoom with a natural rubber-band boundary, and a subtle parallax between foreground garment and background environment on scroll.
- **Configuration (size/color/quantity) uses the same physical-object language as the Inventory Pocket panel** (§12) — this is intentional repetition, reinforcing one consistent "configure an object" mental model across the whole site rather than a bespoke PDP form.
- **Add-to-cart from the PDP is the same drag-or-tap-to-absorb gesture used everywhere else** — a large, confidently physical control near the thumb zone, not a fixed-width button styled like a form-submit.
- **Related/complementary items are presented as a draggable horizontal strip** with its own light inertia (flick-scroll, not click-arrow pagination), keeping the "objects with momentum" language present even at the bottom of the page.

---

## 17. Gesture Library

The complete vocabulary of touch/pointer gestures used site-wide — deliberately small, so every gesture means the same thing everywhere it appears:

| Gesture | Meaning (consistent everywhere) |
|---|---|
| **Tap** | Open / navigate into (card → PDP, thumbnail → full image, nav item → section) |
| **Short long-press** | Peek / expand in place without navigating (card → quick info, image → quick zoom preview) |
| **Long-press + drag** | Pick up a physical object (card, hero product) to relocate/act on it (→ Inventory Pocket) |
| **Drag & release near Pocket** | Add to Inventory Pocket → triggers configuration panel |
| **Drag & release elsewhere** | Cancel — object settles back with overshoot |
| **Horizontal swipe (within a component)** | Move between siblings with inertia (gallery images, nav sections, related-product strip) |
| **Vertical swipe (full viewport)** | Standard scroll, Lenis-smoothed, with velocity-aware layout responses (nav compression, parallax) |
| **Pinch** | Zoom on product imagery only |
| **Pull-down (at top of a filtered/collection view)** | Reveal filter/sort controls |
| **Proximity (cursor-near or scroll-center-near, no contact)** | Level-1 "notice me" responses only — never triggers a state change, only a visual acknowledgment |

No gesture is ever overloaded with two different meanings across different components — this consistency is what allows onboarding to happen exactly once.

---

## 18. Interaction Library (component-level behaviors, summarized)

- **Buttons/primary actions:** press-in physical depression (scale + shadow compression) on touch-down, confident release-bounce on touch-up — never a flat color-swap-only state change.
- **Toggles/filters:** treated as physical switches with a snap-point, not fade-only active/inactive states.
- **Form fields (checkout, contact):** kept low-friction and fast — minimal physicality here deliberately, since this is where the brief calls for speed over play.
- **Loading/transition states:** never a generic spinner. Use a brief, contained glych-frame (stutter + RGB-split, sub-300ms) as the universal "system is thinking" signal, tying utility feedback back into brand language.
- **Empty states (empty search, empty Inventory Pocket):** treated as an invitation, illustrated/animated with the same idle-breathing Level-0 motion language as everything else, never a flat "no items" text block.

---

## 19. Information Architecture

Thought of as **interaction systems layered under a thin route structure**, not a page tree:

- **Home** — brand entry point; hero interaction system + collection-preview system + featured-drop system.
- **Shop / Collections** — the grid-rhythm system, filter/sort system, entered either directly or via a shared-element transition from Home.
- **Product Detail** — the configuration system + gallery-gesture system, entered via shared-element transition from any card or the hero.
- **Search** — the instant-filter system, globally accessible from the persistent bottom zone.
- **Inventory Pocket** — not a page but a persistent, always-mounted system, with an expandable full view for review/checkout handoff.
- **Account / Order history** — deliberately the lowest-personality zone: fast, clear, minimal glych vocabulary, because utility trust matters most here.

Global/persistent layer (mounted once, never remounted by navigation): nav trigger, search trigger, Inventory Pocket, glych-transition overlay.

---

## 20. Component Systems

Reusable interaction-system components (defined by behavior, not visual template):

- **Physical Card** — the base object class underlying Product Cards, Search Results, and Related-Strip items; differs only in scale/detail-level, shares all physics (idle, proximity, long-press-peek, drag).
- **Inventory Pocket** — singleton, persistent, with idle/wake/absorb/configure states as defined in §12.
- **Configuration Panel** — shared between Inventory Pocket add-flow and PDP configuration, reinforcing one mental model.
- **Shared-Element Transporter** — the system responsible for every hero-to-PDP, card-to-PDP, and category-to-collection continuity transition.
- **Glych-Feedback Layer** — a global, centrally-controlled effect system (RGB-split, stutter-frame, flash) that any component can request but which enforces the Level-3-only usage rule, preventing overuse.
- **Fullscreen Nav Takeover** — swipeable, gesture-driven, imagery-led section switcher.
- **Draggable Strip** — the inertia-scroll component underlying related products, colorway selection, and any horizontal siblings-browsing moment.

---

## 21. Visual Language

- **Base mood:** dark, cool, electric — a near-black void punctuated by a single high-signal accent color, evoking a screen glowing in a dark room rather than a boutique showroom.
- **Glych as controlled malfunction, not chaos:** RGB channel-split, scanline flicker, and stutter-frame are the brand's signature visual texture, but are rationed strictly to Level-3 reward moments (§6) and occasional Level-1 proximity hints at very low amplitude — never ambient background noise, never applied to body text or utility UI.
- **Hard edges, sharp corners** on system/utility elements (buttons, chips, config panels) — softness is reserved for photography and card motion physics, not geometry.
- **Layering over decoration:** depth communicated through real z-axis layering (imagery behind type, cards lifting on interaction) rather than drop-shadows-as-decoration.

### Design Tokens (directional, for engineering to formalize)

| Token | Value | Role |
|---|---|---|
| `--color-void` | `#0A0A0C` | Dominant background — cool near-black |
| `--color-static` | `#EDEDED` | Primary text / foreground |
| `--color-graphite` | `#1C1C1F` | Elevated surface (cards, panels) |
| `--color-signal` | `#C6FF3D` | Primary accent — "online," active, confirmed states |
| `--color-glych-red` | `#FF2E4D` | Feedback-only — RGB-split red channel |
| `--color-glych-cyan` | `#2EF2FF` | Feedback-only — RGB-split cyan channel |
| `--color-line` | `rgba(237,237,237,0.08)` | Hairline separators, used sparingly |
| Display typeface | Neue Machina / Cash / ABC Monument Grotesk Wide register | Oversized headline, technical streetwear register |
| Body typeface | Suisse Int'l / Neue Haas Grotesk register | Quiet, legible, never competes with imagery |
| System/mono typeface | Space Mono / PP Neue Montreal Mono register | Price, SKU, size grid, timestamps, configuration data |
| Motion easing (organic/inertia) | spring-based (mass/tension/friction), not fixed-duration | Cards, drag, Inventory Pocket |
| Motion easing (system feedback) | fast expo-out, sub-300ms | Button press, toggle snap, glych-flash |

---

## 22. Responsive Philosophy

Mobile is the design. Larger viewports **expand the same interaction systems**, they do not receive a separate desktop-first design:

- **Mobile (design baseline):** thumb-zone-anchored controls, single-column/variable-density card rhythm, fullscreen nav takeover, drag gestures at short throw distance suited to thumb reach.
- **Tablet:** the same systems gain more simultaneous visible cards and slightly longer drag throws; proximity (Level 1) behavior becomes more prominent since more surface area is visible at once.
- **Desktop:** cursor position substitutes for touch-proximity triggers; hover extends (never replaces) the tap/long-press vocabulary; the Inventory Pocket and nav trigger remain in equivalent corner/bottom-adjacent positions rather than relocating to a top bar, preserving the same spatial mental model users learned on mobile.
- **No breakpoint simply scales layout down or up.** Each breakpoint gets a recomposition pass per component, evaluated against whether the *gesture*, not just the layout, still makes sense at that input method and viewport size.

---

## 23. Accessibility Philosophy

Physicality and glych aesthetics must never become barriers:

- **Every gesture has a non-gesture equivalent.** Long-press-to-peek, drag-to-cart, and swipe-to-navigate all have a keyboard/switch/screen-reader-operable equivalent path (e.g., a focusable "Add to Inventory" action that opens the same configuration panel without requiring a drag).
- **Glych-Feedback Layer effects are motion-sensitive by design.** Under `prefers-reduced-motion`, Level-3 RGB-split/stutter effects are replaced with a simple, calm confirmation (color/opacity change only) — the *meaning* of the feedback is preserved, the visual intensity is not.
- **Idle/ambient (Level 0) motion is the first thing disabled** under reduced-motion, since it's the least meaningful and most easily perceived as "distracting."
- **Contrast:** `--color-static` on `--color-void` and `--color-signal` usage on dark surfaces must be verified at AA minimum for all text-carrying uses; `--color-signal` as a small accent/icon does not need to meet text-contrast rules but must never be the sole carrier of critical information (paired with icon/shape/position redundancy).
- **Focus states are real and visible**, styled in the system/mono visual register (not suppressed for aesthetic reasons) — a keyboard user should be able to perceive exactly which "physical object" is currently selected.

---

## 24. Technical Handoff Notes for Engineering

*(Direction only — not implementation instructions; the engineering stage owns tooling decisions.)*

- The **Shared-Element Transporter** (§20) and **Inventory Pocket** are the two systems with the highest interaction complexity and should be prototyped/validated first, since nearly every other system (cards, hero, collections, search) depends on their physics feeling correct before being layered on top.
- **Drag physics must feel mass-based** (spring/inertia simulation), not a fixed-duration tween following the pointer — this is the single most important technical bar for the entire brief, since the "physical object, not HTML element" illusion collapses instantly if drag has perceptible input lag or a linear/robotic follow curve.
- **The Glych-Feedback Layer should be a single centrally-owned effect system**, not a per-component implementation, both so its Level-3-only usage rule can be enforced structurally and so its reduced-motion fallback can be defined once and inherited everywhere.
- **Proximity-based (Level 1) triggers** need a lightweight, performant way to know "is a draggable object near this element" without expensive per-frame collision checks across the whole viewport — engineering should scope this carefully given the number of cards that could be on-screen simultaneously.
- **Onboarding-once state** (hero drag-to-cart guide) needs a persisted "seen" flag scoped per visitor, not per session, so the guide genuinely never reappears.
- Nothing in this document assumes a specific animation library, gesture library, or framework — GSAP/Lenis/SplitType/gesture-library selection and architecture are entirely the next stage's responsibility.

---

## Differentiation Callout

*This blueprint avoids a generic streetwear-site feel by making the cart itself the site's signature interaction (the Inventory Pocket's wake → absorb → configure sequence) and by rationing the glych visual vocabulary to a strict Level-3-only reward system — rather than scattering glych effects decoratively across the whole interface, which would read as a filter, not a personality.*
