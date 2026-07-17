export type View = 'home' | 'shop' | 'collections' | 'archive' | 'wishlist' | 'cart' | 'profile' | 'product' | 'search';

export interface NavigationDomainModel {
  currentView: View;
  history: View[];
}
