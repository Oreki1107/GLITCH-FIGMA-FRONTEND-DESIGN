import { catalogService } from '@/domain/catalog';
import { homepageModuleConfig, HERO_IMAGE_URL, archiveProductIds } from '@/data/mock';
import type { ProductModel, CollectionModel } from '@/domain/shared/models';

export interface HomepageRuntimeData {
  products: ProductModel[];
  collections: CollectionModel[];
  heroImageUrl: string;
  archiveProductIds: string[];
  heroProduct: ProductModel | null;
  featuredProducts: ProductModel[];
  homeCollections: CollectionModel[];
  newArrivalProducts: ProductModel[];
  trendingProducts: ProductModel[];
  editorialCollection: CollectionModel | null;
  archiveProducts: ProductModel[];
  curatedProducts: ProductModel[];
}

export interface HomepageRuntimeService {
  getHomepageData(): Promise<HomepageRuntimeData>;
}

export const homepageRuntimeService: HomepageRuntimeService = {
  async getHomepageData() {
    const [products, collections] = await Promise.all([
      catalogService.getProducts(),
      catalogService.getCollections(),
    ]);

    const heroModule = homepageModuleConfig.find((item) => item.type === 'hero');
    const featuredModule = homepageModuleConfig.find((item) => item.type === 'featuredProducts');
    const collectionPreviewModule = homepageModuleConfig.find((item) => item.type === 'collectionPreview');
    const newArrivalsModule = homepageModuleConfig.find((item) => item.type === 'newArrivals');
    const trendingModule = homepageModuleConfig.find((item) => item.type === 'trending');
    const editorialModule = homepageModuleConfig.find((item) => item.type === 'editorial');
    const archiveModule = homepageModuleConfig.find((item) => item.type === 'archive');
    const curatedModule = homepageModuleConfig.find((item) => item.type === 'curatedFit');

    const heroProduct = products.find((product) => product.id === heroModule?.productIds?.[0]) ?? null;
    const featuredProducts = products.filter((product) => featuredModule?.productIds?.includes(product.id));
    const homeCollections = collections.filter((collection) =>
      collectionPreviewModule?.collectionHandles?.includes(collection.handle),
    );
    const newArrivalProducts = products.filter((product) => newArrivalsModule?.productIds?.includes(product.id));
    const trendingProducts = products.filter((product) => trendingModule?.productIds?.includes(product.id));
    const editorialCollection =
      collections.find((collection) => collection.handle === editorialModule?.collectionHandle) ?? null;
    const archiveProducts = products.filter((product) => archiveModule?.productIds?.includes(product.id));
    const curatedProducts = products.filter((product) => curatedModule?.productIds?.includes(product.id));

    return {
      products,
      collections,
      heroImageUrl: HERO_IMAGE_URL,
      archiveProductIds,
      heroProduct,
      featuredProducts,
      homeCollections,
      newArrivalProducts,
      trendingProducts,
      editorialCollection,
      archiveProducts,
      curatedProducts,
    };
  },
};
