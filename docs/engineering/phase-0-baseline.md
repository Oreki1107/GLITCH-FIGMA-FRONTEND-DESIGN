# Phase 0 — Engineering Baseline

Baseline captured before architectural extraction (Phases 1–4).

## Visual Parity Checklist

Verify unchanged after each phase at these breakpoints:

| Screen | Mobile (375px) | Desktop (1280px) |
|--------|----------------|------------------|
| Home | Hero, all modules, bottom bar | Same + desktop nav label |
| Shop | Filters, grid, first card expanded | 3–4 column grid |
| Collections | Room cards, active room hero | Offset middle card |
| Product PDP | Split layout, size grid | Full-height image |
| Search | Input, results grid | 4-column results |
| Cart / Wishlist | Empty + filled states | Same |
| Index overlay | Four routes | Max-width nav |

**Rule:** Extract JSX verbatim; do not alter class names, spacing, or copy.

## Known Behavior Quirks (Pre-Refactor)

1. **Filter state is global** — changing collection on Collections affects Shop filters until reset.
2. **Cart size display bug** — all cart lines show the current global `size` state, not per-line size.
3. **SearchView double grid** — `ShopGrid` wrapped inside an outer grid (pre-existing layout).
4. **No URL routing** — refresh returns to home; no deep links.
5. **Wishlist in-memory only** — lost on refresh (fixed in Phase 4).
6. **Manual history stack** — `routeHistory` separate from browser history (replaced in Phase 4).
7. **Archive products** — sourced from homepage module config, not a separate archive catalog.

## Dependency Audit

### Used by application runtime

- `react`, `react-dom` (peer)
- `lucide-react`
- `vite`, `@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite`

### Installed but unused by App (candidates for future pruning)

- `react-router` — Phase 4
- `motion` — Phase 7
- All `@radix-ui/*`, shadcn `components/ui/*` — not imported by App
- `@mui/*`, `@emotion/*` — not used
- `recharts`, `react-dnd`, `react-slick`, `react-responsive-masonry`, `canvas-confetti`, etc.

### Not yet installed (deferred)

- GSAP, Lenis — Phase 7
- Shopify Storefront API client — Phase 6

## Build Verification

Run after each phase:

```bash
pnpm install
pnpm run build
```

## Commit Sequence

1. Phase 0 — Baseline
2. Phase 1 — Foundation
3. Phase 2 — Decomposition
4. Phase 3 — Homepage Renderer
5. Phase 4 — Routing & State
