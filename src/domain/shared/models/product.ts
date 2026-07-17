import type { Money } from './money';

export type ProductModel = {
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
};
