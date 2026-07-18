// Canonical Money type with factory function
export type { Money } from "./money";
export { money } from "./money";

// Backwards-compatible re-exports from canonical locations in shared/models
export type { GlychProduct, GlychCollection } from "./product";
// Navigation types re-exported from shared/models
export type { View, CatalogFilters } from "./navigation";

// Other types that belong in domain/types
export type { ProductPresentation } from "./presentation";
export type { GlychHomeModule } from "./homepage";
export type { GlychCartLine, GlychWishlistItem } from "./cart";
