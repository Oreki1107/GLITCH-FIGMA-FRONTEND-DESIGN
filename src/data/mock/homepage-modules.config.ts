/** Temporary mock development config — resolved by MockHomepageService into domain modules. */
export type HomepageModuleConfig =
  | { type: "hero"; productIds?: string[]; heroImageUrl?: string }
  | { type: "featuredProducts"; productIds?: string[] }
  | { type: "collectionPreview"; collectionHandles?: string[] }
  | { type: "newArrivals"; productIds?: string[] }
  | { type: "trending"; productIds?: string[] }
  | { type: "categories" }
  | { type: "editorial"; collectionHandle?: string }
  | { type: "archive"; productIds?: string[] }
  | { type: "curatedFit"; productIds?: string[] }
  | { type: "continueExploring" };

export const homepageModuleConfig: HomepageModuleConfig[] = [
  { type: "hero", productIds: ["1"] },
  { type: "featuredProducts", productIds: ["1", "2", "3", "4"] },
  { type: "collectionPreview", collectionHandles: ["after-image", "night-transit", "signal-loss"] },
  { type: "newArrivals", productIds: ["1", "2", "3", "4", "5", "6", "7", "8"] },
  { type: "trending", productIds: ["6", "8", "7"] },
  { type: "categories" },
  { type: "editorial", collectionHandle: "night-transit" },
  { type: "archive", productIds: ["5", "6", "7", "8"] },
  { type: "curatedFit", productIds: ["5", "3", "8"] },
  { type: "continueExploring" },
];

export const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=90";

export const archiveProductIds = ["5", "6", "7", "8"];
