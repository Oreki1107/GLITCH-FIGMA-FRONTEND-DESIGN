export type View =
  | "home"
  | "shop"
  | "collections"
  | "archive"
  | "wishlist"
  | "cart"
  | "profile"
  | "product"
  | "search";

export type CatalogFilters = {
  category: string;
  collection: string;
};
