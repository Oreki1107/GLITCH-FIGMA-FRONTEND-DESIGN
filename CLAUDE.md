# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development

```bash
npm i                  # Install dependencies
npm run dev            # Start Vite dev server
npm run build          # Production build to dist/
```

No test suite exists yet.

## Architecture

This is a **streetwear e-commerce storefront** (brand: GLYCH) built with React 18, TypeScript, Vite 6, and Tailwind CSS 4. The architecture follows **Domain-Driven Design (DDD)** with strict separation of concerns.

### Layer Hierarchy

```
src/app/          Application Shell — orchestration only, no business logic
src/domain/       Business Logic — services, selectors, repositories, canonical types
src/components/   Presentation — reusable UI components (no business logic)
src/data/mock/    Mock Data — fixtures for products, collections, presentations
src/providers/    Cross-cutting — AnimationProvider, LenisProvider
src/animations/   Animation infra — GSAP context/hooks/timelines, Lenis scroll
src/store/        Zustand stores — defined but unused (App.tsx uses useState)
src/features/     Feature boundaries — placeholder scaffolding for future features
src/config/       Config files — animation, interaction, lenis, site settings
```

### Canonical Types (single source of truth)

- `ProductModel` → `src/domain/shared/models/product.ts`
- `CollectionModel` → `src/domain/shared/models/collection.ts`
- `Money` → `src/domain/types/money.ts` (with factory function)
- `ViewModel`, `CatalogFiltersModel` → `src/domain/shared/models/navigation.ts`

### Domain Entry Points (import from these, never deep paths)

- `@/domain/catalog` — `catalogService`, `selectFilteredProducts`, `selectAvailableCategories`, `selectProductsBySearchQuery`, `selectCollectionByTitle`
- `@/domain/homepage` — `homepageRuntimeService`, `HomepageRuntimeData`
- `@/domain/shared` — canonical type exports

### Business Logic Location

All filtering, search, category derivation, and collection lookup logic lives in **selectors** at `src/domain/catalog/selectors/catalog.selectors.ts`. These are pure functions — never inline filtering in components or App.tsx.

## Key Architectural Rules

- **Import from domain entry points only** — `@/domain/catalog`, not `@/domain/catalog/services/catalog.service`
- **Business logic in selectors/services** — components are presentation-only
- **Use canonical types** from `@/domain/shared/models`, not legacy re-exports from `@/domain/types`
- **Define new features in `src/features/<name>/`** — don't scatter feature logic
- **Respect domain boundaries** — each business concept has exactly one owner
- **Never put Shopify/API types directly in components** — go through repository abstraction

## Navigation & State

- **Client-side view switching** via `useState<ViewModel>` (not URL-based routing)
- `ViewModel = 'home' | 'shop' | 'collections' | 'archive' | 'wishlist' | 'cart' | 'profile' | 'product' | 'search' | 'story' | 'contact'`
- Navigation with `go(view)` and `back()` using a routeHistory stack (16 entries)
- State management: `React.useState` in App.tsx (Zustand stores in `src/store/` exist but are unused)
- `react-router` is installed but not wired up

## Tech Stack

| Category | Packages |
|----------|----------|
| Core | React 18.3.1, TypeScript, Vite 6.3.5 |
| Styling | Tailwind CSS 4.1.12, Emotion |
| UI Primitives | Radix UI (40+ components), Lucide React icons |
| Animation | GSAP 3.x + @gsap/react, Lenis (smooth scroll), Lottie (via lottie-react) |
| State | Zustand (available, unused), React Context + useState (current) |
| Commerce | GraphQL (for future Shopify integration) |

## Import Alias

`@/*` maps to `src/*` (configured in both `vite.config.ts` and `tsconfig.json`).

## Brand & Visual Identity

- Brand name: **GLYCH** — tagline: "not noise. signal."
- Streetwear aesthetic: urban, experimental, reactive, technical
- Dark theme with high-contrast accent color (lime green primary)
- Typography: Archivo Black (headings), Manrope (body), mono (labels/system)
- Interactions should feel responsive, physical, alive — never passive
- Motion should be interruptible, performance-aware, and degrade gracefully with `prefers-reduced-motion`