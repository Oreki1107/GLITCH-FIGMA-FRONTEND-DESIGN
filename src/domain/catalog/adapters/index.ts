export interface CatalogAdapter<TSource, TDomain> {
  toDomain(source: TSource): TDomain;
}
