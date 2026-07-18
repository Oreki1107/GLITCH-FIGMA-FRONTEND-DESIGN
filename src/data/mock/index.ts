export { mockProducts } from "./products";
export { mockCollections } from "./collections";
export { mockProductPresentations, presentationMap, getPresentation } from "./presentations";
export {
  homepageModuleConfig,
  HERO_IMAGE_URL,
  archiveProductIds,
  type HomepageModuleConfig,
} from "./homepage-modules.config";
// Note: catalog.helpers functions are unused and duplicated in repositories
// They are kept in the file for reference but not exported
// Future consolidation: delete catalog.helpers.ts entirely
