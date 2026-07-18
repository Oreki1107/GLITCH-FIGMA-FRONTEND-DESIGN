# Architectural Audit Report: GLITCH-FIGMA-FRONTEND-DESIGN

**Date:** 2026-07-17  
**Scope:** Complete architectural analysis of business logic organization, model definitions, service implementations, and responsibility distribution  
**Status:** Findings documented (no implementation changes)

---

## Executive Summary

The GLITCH-FIGMA-FRONTEND-DESIGN project exhibits **significant architectural fragmentation** across six key areas:

1. **Model definitions duplicated** in 3 separate locations with competing type hierarchies
2. **Services split between two folders** with interface/implementation separation but no clear ownership
3. **Business logic duplicated** across data layer, repositories, and application code
4. **Mock data tightly coupled** to runtime repositories with no abstraction layer
5. **Import patterns bypass domain entry points**, creating tight coupling
6. **State management scattered** across React hooks, Zustand stores, and services

This report documents each finding with specific file locations and recommends canonical implementations.

---

## 1. Model Definitions: Type System Fragmentation

### Finding: Product Type Defined in THREE Locations

| Location | Type Name | Exports | Usage |
|----------|-----------|---------|-------|
| `src/domain/types/product.ts` | `GlitchProduct` | Type only | `src/services/*` |
| `src/domain/shared/models/product.ts` | `ProductModel` | Type only | `src/domain/catalog`, `src/app/App.tsx` |
| `src/domain/catalog/models/Product.ts` | `Product` | Interface only | Not directly used |

**All three have identical shapes:**
```typescript
{
  id: string;
  handle: string;
  title: string;
  price: Money;
  tag: string;
  categoryHandle: string;
  categoryTitle: string;
  collectionHandle: string;
  collectionTitle: string;
  imageUrl: string;
  description?: string;
}
```

**Problem:** Competing type hierarchies cause:
- Services in `src/services/` use `GlitchProduct`
- Domain services use `ProductModel`
- Components use `ProductModel`
- Type adapter layer needed but missing

**Canonical Source:** `src/domain/shared/models/product.ts` (ProductModel) — used by actual implementation layer

---

### Finding: Collection Type Defined in THREE Locations

| Location | Type Name |
|----------|-----------|
| `src/domain/types/collection.ts` | `GlitchCollection` |
| `src/domain/shared/models/collection.ts` | `CollectionModel` |
| `src/domain/catalog/models/Collection.ts` | `Collection` |

**All three have identical shapes:**
```typescript
{
  id: string;
  handle: string;
  title: string;
  number: string;
  imageUrl: string;
  copy: string;
  accentColor: string;
}
```

**Problem:** Same as Product — competing types, no unified definition

**Canonical Source:** `src/domain/shared/models/collection.ts` (CollectionModel)

---

### Finding: Money Type Has INCOMPATIBLE Schemas

**Location 1:** `src/domain/types/money.ts`
```typescript
export type Money = {
  amount: number;
  currencyCode: string;  // FLEXIBLE — accepts any code
  formatted: string;
};

export function money(amount: number, currencyCode = "USD"): Money {
  return { amount, currencyCode, formatted: `$${amount}` };
}
```

**Location 2:** `src/domain/shared/models/money.ts`
```typescript
export type Money = {
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP';  // RESTRICTIVE — literal union
  formatted: string;
};
```

**Problem:** 
- Property name differs: `currencyCode` vs `currency`
- Accepted values differ: any string vs literal union
- Function factory only in one location
- Creates type incompatibility at runtime

**Usage:**
- Mock data uses `@/domain/types` version: `money(280)` → uses currencyCode
- But some code may expect `currency` property
- **Breaking incompatibility**

**Canonical Source:** `src/domain/types/money.ts` — has utility function, flexible currency codes

---

### Finding: Navigation Types Defined in TWO Locations

| Location | Type Names |
|----------|-----------|
| `src/domain/types/navigation.ts` | `View`, `CatalogFilters` |
| `src/domain/shared/models/navigation.ts` | `ViewModel`, `CatalogFiltersModel` |

**Both have identical shapes:**
```typescript
// View / ViewModel
'home' | 'shop' | 'collections' | 'archive' | 'wishlist' | 'cart' | 'profile' | 'product' | 'search'

// CatalogFilters / CatalogFiltersModel
{ category: string; collection: string; }
```

**Usage:**
- App uses `ViewModel` from shared/models
- Services expect `View` from types

**Canonical Source:** `src/domain/shared/models/navigation.ts` — used by actual app implementation

---

## 2. Service Implementations: Split Ownership & Competing Implementations

### Finding: TWO Catalog Services in Different Folders

**Pattern:** Interface defined in one location, implementation in another

#### Service 1: `src/services/catalog/catalog.service.ts`
```typescript
export type ICatalogService = {
  getProducts(): Promise<GlitchProduct[]>;
  getProductById(id: string): Promise<GlitchProduct | null>;
  getProductsByIds(ids: string[]): Promise<GlitchProduct[]>;
  getCollections(): Promise<GlitchCollection[]>;
  getCollectionByHandle(handle: string): Promise<GlitchCollection | null>;
  filterProducts(filters: CatalogFilters): Promise<GlitchProduct[]>;
  getCategories(): Promise<string[]>;
};
```

**Characteristics:**
- ✗ Type definition ONLY
- ✗ NO implementation
- ✗ Uses `GlitchProduct` type
- ✗ Not imported by App

#### Service 2: `src/domain/catalog/services/catalog.service.ts`
```typescript
export interface CatalogService {
  getProducts(): Promise<ProductModel[]>;
  getProductById(id: string): Promise<ProductModel | null>;
  // ... same methods
}

export const catalogService: CatalogService = {
  async getProducts() {
    return catalogRepository.getProducts();
  },
  // ... implementations
};
```

**Characteristics:**
- ✓ Has BOTH interface AND implementation
- ✓ Uses `ProductModel` type
- ✓ **IS imported by App**
- ✓ Delegates to repository layer

**Problem:** 
- Two competing definitions of the same interface
- `src/services/` version is orphaned (not used anywhere)
- Type confusion: ICatalogService vs CatalogService
- Imports in `src/services/index.ts` reference unused interface

**Usage Analysis:**
```typescript
// ACTUAL USAGE (in src/app/App.tsx)
import { catalogService } from "@/domain/catalog/services/catalog.service";

// UNUSED (orphaned)
// src/services/catalog/catalog.service.ts is never imported
```

**Canonical Implementation:** `src/domain/catalog/services/catalog.service.ts`

---

### Finding: TWO Homepage Services with Different Implementations

#### Service 1: `src/domain/homepage/services/homepage.service.ts`
```typescript
export interface HomepageService {
  getModules(): Promise<HomepageModuleModel[]>;
}

export const homepageService: HomepageService = {
  async getModules() {
    return [];  // ← EMPTY, returns nothing
  },
};
```

**Usage:** 0 matches in codebase

#### Service 2: `src/domain/homepage/services/homepage-runtime.service.ts`
```typescript
export interface HomepageRuntimeService {
  getHomepageData(): Promise<HomepageRuntimeData>;
}

export const homepageRuntimeService: HomepageRuntimeService = {
  async getHomepageData() {
    const [products, collections] = await Promise.all([
      catalogService.getProducts(),
      catalogService.getCollections(),
    ]);
    // ... compiles homepage data
    return { products, collections, heroProduct, featuredProducts, ... };
  },
};
```

**Usage:** 
- ✓ Used by App.tsx
- ✓ Actually implements logic

**Problem:** 
- Two services, one is abandoned
- No clear deletion or deprecation marker
- Dead code in codebase

**Canonical Implementation:** `src/domain/homepage/services/homepage-runtime.service.ts`

---

### Finding: Interface-Only Service Definition at `src/services/homepage/homepage.service.ts`

```typescript
export type IHomepageService = {
  getModules(): Promise<GlitchHomeModule[]>;
};
```

**Usage:** Only referenced in `src/services/index.ts` export, never imported

**Problem:** Competing with actual implementations, orphaned

---

## 3. Repository Pattern: Incomplete Implementation

### Finding: Only Catalog Domain Uses Repository Pattern

**Who has repositories:**
- ✓ `src/domain/catalog/repositories/catalog.repository.ts` — ONLY repository

**Who should but doesn't:**
- ✗ Cart domain: No repository, uses Zustand store instead
- ✗ Search domain: No repository, uses Zustand store instead
- ✗ Wishlist domain: No repository, uses Zustand store instead
- ✗ Homepage domain: No repository, services call catalogService directly

### Repository Implementation: `src/domain/catalog/repositories/catalog.repository.ts`

```typescript
export const catalogRepository: CatalogRepository = {
  async getProducts() {
    return mockProducts;  // ← DIRECTLY returns mock data
  },
  async getProductById(id) {
    return mockProducts.find((product) => product.id === id) ?? null;
  },
  async getCollections() {
    return mockCollections;  // ← DIRECTLY returns mock data
  },
  async filterProducts(filters) {
    return mockProducts.filter(
      (product) =>
        (filters.category === 'all' || product.categoryTitle === filters.category) &&
        (filters.collection === 'all' || product.collectionTitle === filters.collection),
    );
  },
  async getCategories() {
    return Array.from(new Set(mockProducts.map((product) => product.categoryTitle)))
      .filter(Boolean);
  },
};
```

**Problem:**
- Mock data is hardcoded into repository
- No data source abstraction (file, API, DB)
- Repository is not swappable for real API
- Business logic (filtering, deriving categories) embedded in repository

---

## 4. Mock Data: Direct Runtime Coupling

### Finding: Mock Data Imported by Runtime Components

**Direct imports of mock data:**

| File | Imports | Purpose |
|------|---------|---------|
| `src/app/App.tsx` | `mockProductPresentations, presentationMap, getPresentation, HERO_IMAGE_URL` | Initialization |
| `src/components/product/ProductGrid.tsx` | `getPresentation` | Component rendering |
| `src/domain/catalog/repositories/catalog.repository.ts` | `mockProducts, mockCollections` | Data source |

**Mock data exports:** `src/data/mock/index.ts`
```typescript
export { mockProducts } from "./products";
export { mockCollections } from "./collections";
export { mockProductPresentations, presentationMap, getPresentation } from "./presentations";
export { homepageModuleConfig, HERO_IMAGE_URL, ... } from "./homepage-modules.config";
export { productsByIds, collectionsByHandles, deriveCategories, filterProducts, searchProducts } from "./catalog.helpers";
```

**Problem:**
- ✗ No abstraction layer
- ✗ Mock data flows directly into runtime services
- ✗ No distinction between test data and production data
- ✗ Cannot swap mock for real API without refactoring imports
- ✗ App components directly access mock presentations

**Abstraction Needed:**
- Mock provider/adapter interface
- Configurable data source (mock vs real)
- Dependency injection for data layer

---

## 5. Business Logic Duplication

### Finding: filterProducts Logic Duplicated Across THREE Locations

**Location 1:** `src/data/mock/catalog.helpers.ts`
```typescript
export function filterProducts(
  products: ProductModel[],
  category: string,
  collection: string,
): GlitchProduct[] {  // NOTE: Wrong return type (GlitchProduct)
  return products.filter(
    (product) =>
      (category === "all" || product.categoryTitle === category) &&
      (collection === "all" || product.collectionTitle === collection),
  );
}
```

**Location 2:** `src/domain/catalog/repositories/catalog.repository.ts`
```typescript
async filterProducts(filters) {
  return mockProducts.filter(
    (product) =>
      (filters.category === 'all' || product.categoryTitle === filters.category) &&
      (filters.collection === 'all' || product.collectionTitle === filters.collection),
  );
}
```

**Location 3:** `src/app/App.tsx`
```typescript
const filtered = useMemo(() => {
  if (!products.length) return [];
  return products.filter(
    (product) =>
      (category === "all" || product.categoryTitle === category) &&
      (collection === "all" || product.collectionTitle === collection),
  );
}, [products, category, collection]);
```

**Problem:**
- ✗ Same filter logic implemented 3 times
- ✗ Mock version unused (never called)
- ✗ App has its own copy instead of using service
- ✗ Changes must be made in 3 places

**Canonical Source:** `src/domain/catalog/repositories/catalog.repository.ts` (used by service layer)

---

### Finding: deriveCategories Logic Duplicated Across THREE Locations

**Location 1:** `src/data/mock/catalog.helpers.ts` (UNUSED)
```typescript
export function deriveCategories(products: ProductModel[]): string[] {
  return Array.from(new Set(products.map((product) => product.categoryTitle)))
    .filter(Boolean);
}
```

**Location 2:** `src/domain/catalog/repositories/catalog.repository.ts` (USED via service)
```typescript
async getCategories() {
  return Array.from(new Set(mockProducts.map((product) => product.categoryTitle)))
    .filter(Boolean);
}
```

**Location 3:** `src/app/App.tsx` (USED in component)
```typescript
const categories = useMemo(() => 
  Array.from(new Set(products.map((product) => product.categoryTitle)))
    .filter(Boolean), 
  [products]
);
```

**Problem:**
- ✗ Logic duplicated 3 times
- ✗ Should be single selector function
- ✗ App reimplements instead of using selector

**Canonical Source:** `src/domain/catalog/repositories/catalog.repository.ts`

---

### Finding: Search/Filter Logic in App NOT Using Service

```typescript
// src/app/App.tsx — CUSTOM IMPLEMENTATION
const queryResults = products.filter((product) =>
  `${product.title} ${product.collectionTitle} ${product.categoryTitle}`
    .toLowerCase()
    .includes(query.toLowerCase()),
);
```

```typescript
// src/data/mock/catalog.helpers.ts — UNUSED IMPLEMENTATION
export function searchProducts(products: ProductModel[], query: string): ProductModel[] {
  const normalized = query.toLowerCase();
  return products.filter((product) =>
    `${product.title} ${product.collectionTitle} ${product.categoryTitle}`
      .toLowerCase()
      .includes(normalized),
  );
}
```

**Problem:**
- ✗ App reimplements search logic instead of using service
- ✗ Helper function unused
- ✗ No service method for search
- ✗ Business logic not encapsulated

---

## 6. Import Patterns: Bypassing Domain Entry Points

### Finding: Components Import from Deep Domain Paths

**Pattern:** Imports go directly to subdirectories instead of using domain/*/index.ts

**Observed Imports:**
```typescript
// src/app/App.tsx
import { catalogService } from "@/domain/catalog/services/catalog.service";
import { homepageRuntimeService } from "@/domain/homepage/services/homepage-runtime.service";
import type { CollectionModel, ProductModel } from "@/domain/shared/models";

// src/components/product/ProductCard.tsx
import type { ProductModel } from "@/domain/shared/models";
import type { ProductPresentation } from "@/domain/types";

// src/components/product/ProductGrid.tsx
import { getPresentation } from "@/data/mock";

// src/domain/catalog/repositories/catalog.repository.ts
import { mockProducts, mockCollections } from '@/data/mock';
```

**Expected Imports (Entry Points):**
```typescript
// Should be:
import { catalogService } from "@/domain/catalog";  // via index.ts
import type { ProductModel } from "@/domain/shared";  // via index.ts
```

**Available Entry Points NOT Used:**

| Path | Exports |
|------|---------|
| `src/domain/catalog/index.ts` | `models, services, repositories, selectors, adapters` |
| `src/domain/shared/index.ts` | `money, presentation` (incomplete) |
| `src/services/index.ts` | `ICatalogService, ISearchService, ICartService, IHomepageService` |

**Problems:**
- ✗ Tight coupling to directory structure
- ✗ Refactoring internal structure requires updating many import statements
- ✗ Entry points not enforced
- ✗ No contracts between layers

---

## 7. Responsibility Distribution: Unclear Boundaries

### Finding: App.tsx Owns Too Much Business Logic

**What App.tsx directly manages:**
1. **State management:**
   - View navigation: `view`, `routeHistory`
   - UI state: `navOpen`, `inventoryOpen`
   - Shopping state: `cart`, `wishlist`, `selected`, `recentlyViewed`
   - Filter state: `category`, `collection`, `query`
   - Product quantity: `quantity`, `size`, `strip`

2. **Business logic:**
   - Product filtering (duplicate of repository logic)
   - Category derivation
   - Search filtering
   - Navigation history stack
   - Product selection
   - Cart operations
   - Wishlist operations

3. **Service calls:**
   - `catalogService.getProducts()`
   - `catalogService.getCollections()`
   - `homepageRuntimeService.getHomepageData()`

**Problem:** App owns 40+ lines of business logic that should be in services/domain

```typescript
// From src/app/App.tsx
const filtered = useMemo(() => {
  if (!products.length) return [];
  return products.filter(
    (product) =>
      (category === "all" || product.categoryTitle === category) &&
      (collection === "all" || product.collectionTitle === collection),
  );
}, [products, category, collection]);

const activeCollection = collections.find((item) => item.title === collection);
const categories = useMemo(() => 
  Array.from(new Set(products.map((product) => product.categoryTitle)))
    .filter(Boolean), 
  [products]
);
const activeProduct = selected ?? products[0] ?? null;
const queryResults = products.filter((product) =>
  `${product.title} ${product.collectionTitle} ${product.categoryTitle}`
    .toLowerCase()
    .includes(query.toLowerCase()),
);
```

---

### Finding: State Management Pattern Fragmented

**Three competing state management approaches:**

1. **React Local State** (in App.tsx):
   - Product filtering
   - Navigation
   - Quantity/size selection
   - Recently viewed products

2. **Zustand Stores** (not currently used in App):
   - `useCartStore` — defined but not used
   - `useSearchStore` — defined but not used
   - `useInventoryStore` — exists but App uses local useState

3. **Domain Services** (deliver data once):
   - `catalogService.getProducts()`
   - `homepageRuntimeService.getHomepageData()`

**Problem:** No unified state management strategy
- Caching not consistent
- Store implementations exist but unused
- Services don't maintain state

---

### Finding: Components Have Unclear Responsibilities

**Components import from multiple layers:**
```typescript
// src/components/product/ProductCard.tsx
import type { ProductModel } from "@/domain/shared/models";  // ← Domain
import type { ProductPresentation } from "@/domain/types";   // ← Types
import { SystemLabel } from "@/components/primitives";       // ← Components

// src/components/product/ProductGrid.tsx
import type { ProductModel } from "@/domain/shared/models";  // ← Domain
import { getPresentation } from "@/data/mock";               // ← Mock data
import { EmptyState } from "@/components/layout/EmptyState";  // ← Components
import { ProductCard } from "./ProductCard";                 // ← Components
```

**Problems:**
- Components import mock data directly
- No presentation layer abstraction
- Components aware of domain models
- No component-level API/contract

---

### Finding: Features Folder Is Empty Scaffolding

```typescript
// src/features/drag-cart/index.ts
export const dragCartFeature = { name: 'drag-cart' };

// src/features/product-card/index.ts
export const productCardFeature = { name: 'product-card' };

// All 8 features follow this pattern
```

**Characteristics:**
- ✗ No implementation
- ✗ No exports
- ✗ Not used anywhere
- ✗ Pure scaffolding

**Problem:** Feature folder structure exists but features are not implemented

---

## 8. Specific Architectural Issues

### Issue 1: Type Mismatch in ProductCard Props

```typescript
// src/components/product/ProductCard.tsx
type ProductCardProps = {
  product: GlitchProduct;  // ← References undefined type
  presentation: ProductPresentation;
  // ...
};
```

**Problem:** `GlitchProduct` is not imported, causing type error. Should use `ProductModel`.

---

### Issue 2: Money Factory Missing in Shared Models

```typescript
// src/domain/types/money.ts (HAS FACTORY)
export function money(amount: number, currencyCode = "USD"): Money {
  return { amount, currencyCode, formatted: `$${amount}` };
}

// src/domain/shared/models/money.ts (NO FACTORY)
export type Money = { /* ... */ };
```

**Problem:** Only one Money type has factory function, other doesn't

---

### Issue 3: Selector Functions Unused

```typescript
// src/data/mock/catalog.helpers.ts
export function productsByIds(products: ProductModel[], ids?: string[]): ProductModel[] { }
export function collectionsByHandles(...) { }
export function deriveCategories(...) { }
export function filterProducts(...) { }
export function searchProducts(...) { }
```

**Exported but never imported:**
- `productsByIds` — 0 matches
- `collectionsByHandles` — 0 matches
- `deriveCategories` — 0 matches
- `filterProducts` — exported but App reimplements instead
- `searchProducts` — exported but App reimplements instead

**Problem:** Dead code or incomplete migration

---

### Issue 4: Domain Entry Points Incomplete

```typescript
// src/domain/shared/index.ts
export * from '../types/money';
export * from '../types/presentation';

// Missing:
// - product.ts
// - collection.ts
// - navigation.ts
// - homepage.ts
// - models re-exports
```

**Problem:** Can't import from `@/domain/shared` for some types, must import deeper

---

### Issue 5: Services Index Exports Unused Interfaces

```typescript
// src/services/index.ts
export type { ICatalogService } from "./catalog/catalog.service";
export type { ISearchService } from "./search/search.service";
export type { ICartService } from "./cart/cart.service";
export type { IHomepageService } from "./homepage/homepage.service";
```

**Problem:** These interfaces are never used; actual implementations are in domain folder

---

## 9. Summary: Critical Issues by Category

### Type System (High Priority)
- [ ] **Product type duplicated** in 3 locations — consolidate to single source
- [ ] **Collection type duplicated** in 3 locations — consolidate to single source
- [ ] **Money type has incompatible schemas** — choose one and remove other
- [ ] **Navigation types duplicated** — consolidate
- [ ] **Type imports scattered** — centralize via entry points

### Services (High Priority)
- [ ] **Catalog service orphaned** at `src/services/catalog/` — remove or consolidate
- [ ] **Homepage service abandoned** at `src/domain/homepage/services/homepage.service.ts` — delete or implement
- [ ] **Service interfaces unused** in `src/services/` — consolidate with implementations

### Business Logic (High Priority)
- [ ] **filterProducts duplicated 3×** — consolidate to single source
- [ ] **deriveCategories duplicated 3×** — consolidate to single source
- [ ] **App.tsx implements logic** that should be in services — extract

### Data Layer (Medium Priority)
- [ ] **Mock data hardcoded in repository** — extract to abstraction layer
- [ ] **No data source abstraction** — create adapter interface for swap mock/real API

### Architecture (Medium Priority)
- [ ] **Imports bypass entry points** — enforce domain-level imports
- [ ] **Store implementations unused** — either use Zustand or remove
- [ ] **Features folder empty** — either populate or remove scaffolding
- [ ] **Selectors undefined** — implement category/filtering selectors or remove

---

## 10. Recommended Canonical Architecture

### Consolidated Type Hierarchy

**Single source of truth:**
```
src/domain/shared/models/
  ├── product.ts        → ProductModel (consolidate all 3)
  ├── collection.ts     → CollectionModel (consolidate all 3)
  ├── money.ts          → Money (use flexible currencyCode version)
  ├── navigation.ts     → ViewModel, CatalogFiltersModel
  ├── homepage.ts       → HomepageModuleModel
  └── index.ts          → export * from all above

src/domain/types/
  └── Only: presentation, cart (non-duplicate types)
```

### Service Layer

**Canonical implementations:**
```
src/domain/catalog/services/catalog.service.ts ✓ (KEEP)
src/domain/homepage/services/homepage-runtime.service.ts ✓ (KEEP)
src/domain/homepage/services/homepage.service.ts ✗ (DELETE — abandoned)

src/services/ ✗ (DELETE — orphaned interfaces, no implementations)
```

### Repository Pattern

**Extend to all domains:**
```
src/domain/catalog/repositories/catalog.repository.ts ✓ (KEEP)
src/domain/cart/repositories/cart.repository.ts [CREATE]
src/domain/search/repositories/search.repository.ts [CREATE]
```

**Add abstraction:**
```typescript
// src/domain/catalog/ports/catalog-data.port.ts
export interface CatalogDataPort {
  getProducts(): Promise<ProductModel[]>;
  getCollections(): Promise<CollectionModel[]>;
  // Abstraction allows swapping mock/API/etc
}
```

### Business Logic Consolidation

| Function | Current Locations | Keep | Delete |
|----------|-------------------|------|--------|
| filterProducts | 3 (helpers, repo, App) | Repository method | helpers, App |
| deriveCategories | 3 (helpers, repo, App) | Repository method | helpers, App |
| searchProducts | 2 (helpers, App) | Create service method | helpers, App |
| productsByIds | helpers (unused) | Create service | helpers |

### Import Structure

**Entry point usage:**
```typescript
// ✓ Correct
import { catalogService } from "@/domain/catalog";
import type { ProductModel } from "@/domain/shared";

// ✗ Avoid
import { catalogService } from "@/domain/catalog/services/catalog.service";
import type { ProductModel } from "@/domain/shared/models";
```

### State Management Consolidation

**Single pattern:**
```typescript
// Use Zustand stores consistently OR services + React hooks
// NOT BOTH

// Option A: All Zustand
export const useAppStore = create((set) => ({
  view: 'home',
  cart: [],
  wishlist: [],
  setView: (view) => set({ view }),
  // ...
}));

// Option B: Services + React.useState for UI
// (Recommended for this project)
```

---

## 11. Implementation Roadmap

### Phase 1: Consolidate Types (Low Risk)
1. Choose canonical location for Product, Collection, Navigation types
2. Update imports across 20 files
3. Remove duplicate type definitions
4. Test: No runtime behavior change

### Phase 2: Consolidate Services (Medium Risk)
1. Delete orphaned `src/services/` folder
2. Delete abandoned `homepage.service.ts`
3. Update `src/services/index.ts` exports
4. Test: 1 import change in App

### Phase 3: Extract Business Logic from App.tsx (Medium Risk)
1. Create selectors: `selectFilteredProducts()`, `selectCategories()`
2. Create: `searchService.search(query: string)`
3. Move filtering to service layer
4. Update App.tsx to use selectors
5. Test: Business logic unchanged, just relocated

### Phase 4: Add Data Abstraction (Medium Risk)
1. Create `CatalogDataPort` interface
2. Create `MockCatalogAdapter implements CatalogDataPort`
3. Update repository to use adapter
4. Enable swap to real API later

### Phase 5: Unify State Management (Low Risk)
1. Decide: Zustand vs services + useState
2. Consolidate: useCartStore, useSearchStore into App or central store
3. Remove unused store definitions or implement properly

---

## 12. Files Requiring Changes

### To Delete (Completely)
- [ ] `src/services/catalog/catalog.service.ts` (orphaned interface)
- [ ] `src/services/search/search.service.ts` (orphaned interface)
- [ ] `src/services/cart/cart.service.ts` (orphaned interface)
- [ ] `src/services/homepage/homepage.service.ts` (orphaned interface)
- [ ] `src/services/index.ts` (export from deleted files)
- [ ] `src/domain/homepage/services/homepage.service.ts` (abandoned implementation)
- [ ] `src/data/mock/catalog.helpers.ts` (unused functions)

### To Consolidate (Pick One)
- [ ] Product type: Use `src/domain/shared/models/product.ts`, delete `types/product.ts` and `catalog/models/Product.ts`
- [ ] Collection type: Use `src/domain/shared/models/collection.ts`, delete others
- [ ] Money type: Use `src/domain/types/money.ts`, delete `shared/models/money.ts`
- [ ] Navigation type: Use `src/domain/shared/models/navigation.ts`, delete `types/navigation.ts`

### To Refactor (Import Changes)
- [ ] `src/app/App.tsx` — Remove filterProducts/deriveCategories logic, use selectors
- [ ] `src/components/product/ProductCard.tsx` — Fix GlitchProduct type reference
- [ ] `src/components/product/ProductGrid.tsx` — Import presentations from service, not mock
- [ ] All imports — Use `@/domain/*` entry points, not deep paths

### To Create
- [ ] `src/domain/catalog/selectors/` — Create selector functions (non-empty)
- [ ] `src/domain/shared/models/index.ts` — Complete entry point exports
- [ ] Data abstraction layer — CatalogDataPort interface

---

## Conclusion

The project has good foundational structure (domain-driven design concepts, repository pattern, service layer) but suffers from **incomplete implementation of those patterns**. The primary issues are:

1. **Type fragmentation** — 3 competing hierarchies for same models
2. **Split service ownership** — interfaces separate from implementations
3. **Logic duplication** — business logic in 3+ locations
4. **Import coupling** — bypassing domain boundaries
5. **Incomplete abstractions** — services, repos, data layer not fully realized

**Estimated effort to consolidate:** 2-3 engineering days (low-risk refactoring, no behavioral changes)

**Impact:** Significant reduction in maintenance burden, clear ownership boundaries, easier to extend or swap implementations.
