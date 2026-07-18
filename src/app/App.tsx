import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import React, { Suspense } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import type { CollectionModel, ProductModel, ViewModel } from "@/domain/shared/models";
import {
  HERO_IMAGE_URL,
  mockProductPresentations,
  presentationMap,
  getPresentation,
} from "@/data/mock";
import { catalogService, selectFilteredProducts, selectAvailableCategories, selectProductsBySearchQuery, selectCollectionByTitle } from "@/domain/catalog";
import { homepageRuntimeService, type HomepageRuntimeData } from "@/domain/homepage";
import { SystemLabel, SectionHeading, BottomControl } from "@/components/primitives";
import { SearchOverlay } from "./components/search/SearchOverlay";
import { Story } from "./components/story/Story";
import { Contact } from "./components/contact/Contact";
import { GlychText, FingerGestureAnimation, BagArrowAnimation } from "@/components/motion";
import { ProductCard, ProductGrid } from "@/components/product";
import { CollectionTabs } from "@/components/collection";
import { HomepageRuntime } from "@/app/components/homepage/HomepageRuntime";
import { enterPage, exitPage } from "@/animations/gsap/timelines/pageTransitionAnimations";
import { slideUpOverlay, slideDownOverlay, fadeScaleOverlay, fadeScaleOut } from "@/animations/gsap/timelines/interactionAnimations";
import { siteConfig } from "@/config/site.config";

const presentations = presentationMap(mockProductPresentations);

function App() {
  const [view, setView] = useState<ViewModel>("home");
  const [routeHistory, setRouteHistory] = useState<ViewModel[]>([]);
  const [navOpen, setNavOpen] = useState(false);
  const [selected, setSelected] = useState<ProductModel | null>(null);
  const [collection, setCollection] = useState("all");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState<ProductModel[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<ProductModel[]>([]);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [strip, setStrip] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");

  // ─── Animation refs ────────────────────────────────────────────────────────
  /** Wrapper around the active view content — used for enter/exit transitions */
  const viewContainerRef = useRef<HTMLDivElement>(null);
  /** Running transition timeline — killed before new one starts (interruptible) */
  const transitionRef = useRef<gsap.core.Timeline | null>(null);
  /** Inventory overlay element — always mounted, animated in/out */
  const inventoryOverlayRef = useRef<HTMLDivElement>(null);
  /** Nav overlay element — always mounted, animated in/out */
  const navOverlayRef = useRef<HTMLDivElement>(null);
  /** Cart button in bottom bar — animated on item add */
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  /** Heart icon in ProductDetail — animated on wishlist toggle */
  const heartIconRef = useRef<SVGSVGElement>(null);

  // ─── Animated navigation ───────────────────────────────────────────────────
  const go = useCallback((next: ViewModel) => {
    if (next === view) return;

    // Kill any in-progress transition
    transitionRef.current?.kill();

    const doNavigate = () => {
      setRouteHistory((items) => [...items, view].slice(-16));
      setView(next);
      setNavOpen(false);
      // Use instant scroll — Lenis manages smooth scroll, 'smooth' behavior
      // conflicts with Lenis and causes visible jank on view swap.
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };

    if (viewContainerRef.current) {
      // Exit current view, then navigate
      transitionRef.current = exitPage(viewContainerRef.current);
      transitionRef.current.then(doNavigate);
    } else {
      doNavigate();
    }
  }, [view]);

  const back = useCallback(() => {
    // Kill any in-progress transition
    transitionRef.current?.kill();

    const doBack = () => {
      setRouteHistory((items) => {
        const previous = items.at(-1) ?? "home";
        setView(previous);
        setNavOpen(false);
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        return items.slice(0, -1);
      });
    };

    if (viewContainerRef.current) {
      transitionRef.current = exitPage(viewContainerRef.current);
      transitionRef.current.then(doBack);
    } else {
      doBack();
    }
  }, []);

  // Run enter animation whenever the view state changes
  useEffect(() => {
    if (viewContainerRef.current) {
      transitionRef.current?.kill();
      transitionRef.current = enterPage(viewContainerRef.current);
    }
  }, [view]);

  // ─── Product / cart / wishlist actions ────────────────────────────────────
  const openProduct = (p: ProductModel) => {
    setSelected(p);
    setRecentlyViewed((items) => [p, ...items.filter((item) => item.id !== p.id)].slice(0, 4));
    go("product");
  };

  const addItem = (p = selected) => {
    if (!p) return;
    setCart((items) => [...items, ...Array(quantity).fill(p)]);
    setInventoryOpen(false);
    setQuantity(1);
    // Cart button pulse — communicates the item was received
    if (cartButtonRef.current) {
      gsap.fromTo(
        cartButtonRef.current,
        { scale: 1 },
        { scale: 1.1, duration: 0.12, ease: "power2.out",
          yoyo: true, repeat: 1, repeatDelay: 0.04 },
      );
    }
  };

  const toggleWish = (id: string) => {
    const isAdding = !wishlist.includes(id);
    setWishlist((items) =>
      isAdding ? [...items, id] : items.filter((item) => item !== id)
    );
    // Heart spring animation when adding to wishlist
    if (isAdding && heartIconRef.current) {
      gsap.fromTo(
        heartIconRef.current,
        { scale: 0.6 },
        { scale: 1, duration: 0.45, ease: "elastic.out(1.3, 0.4)" },
      );
    }
  };

  const [products, setProducts] = useState<ProductModel[]>([]);
  const [collections, setCollections] = useState<CollectionModel[]>([]);
  const [homepageData, setHomepageData] = useState<HomepageRuntimeData | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const [catalogProducts, catalogCollections, homepage] = await Promise.all([
        catalogService.getProducts(),
        catalogService.getCollections(),
        homepageRuntimeService.getHomepageData(),
      ]);

      if (!active) return;

      setProducts(catalogProducts);
      setCollections(catalogCollections);
      setHomepageData(homepage);
      if (!selected) {
        setSelected(catalogProducts[0] ?? null);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return selectFilteredProducts(products, { category, collection });
  }, [products, category, collection]);
  const activeCollection = selectCollectionByTitle(collections, collection);
  const categories = useMemo(() => selectAvailableCategories(products), [products]);
  const activeProduct = selected ?? products[0] ?? null;

  const heroProduct = homepageData?.heroProduct ?? null;
  const featuredProducts = homepageData?.featuredProducts ?? [];
  const homeCollections = homepageData?.homeCollections ?? [];
  const newArrivalProducts = homepageData?.newArrivalProducts ?? [];
  const trendingProducts = homepageData?.trendingProducts ?? [];
  const editorialCollection = homepageData?.editorialCollection ?? null;
  const archiveProducts = homepageData?.archiveProducts ?? [];
  const curatedProducts = homepageData?.curatedProducts ?? [];
  const queryResults = useMemo(() => selectProductsBySearchQuery(products, query), [products, query]);
  const openAdd = (p: ProductModel) => {
    setSelected(p);
    setInventoryOpen(true);
  };

  const ShopGrid = ({ items = filtered }: { items?: ProductModel[] }) => (
    <ProductGrid
      items={items}
      presentations={presentations}
      onOpen={openProduct}
      expandedIndex={view === "shop" ? 0 : null}
      onWishlistToggle={toggleWish}
      onQuickAdd={openAdd}
      isWishlisted={(id) => wishlist.includes(id)}
    />
  );

  const Home = () => (
    <HomepageRuntime
      heroProduct={heroProduct}
      featuredProducts={featuredProducts}
      homeCollections={homeCollections}
      newArrivalProducts={newArrivalProducts}
      trendingProducts={trendingProducts}
      categories={categories}
      productsCount={products.length}
      editorialCollection={editorialCollection}
      archiveProducts={archiveProducts}
      curatedProducts={curatedProducts}
      presentations={presentations}
      strip={strip}
      onOpenProduct={openProduct}
      onOpenAdd={openAdd}
      onGo={go}
      onSelectCollection={(title) => {
        setCollection(title);
      }}
      onSelectCategory={(name) => {
        setCategory(name);
        setCollection("all");
      }}
      onSetStrip={setStrip}
      onWishlistToggle={toggleWish}
      onQuickAdd={openAdd}
      isWishlisted={(id) => wishlist.includes(id)}
    />
  );

  const Shop = () => (
    <section className="min-h-screen px-4 pb-28 pt-28 md:px-8">
      <SectionHeading
        kicker="shop / all objects"
        title="find your weight."
        action={<SystemLabel>{filtered.length} objects</SystemLabel>}
      />
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {["all", ...categories].map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={
              category === item
                ? "shrink-0 border border-primary bg-primary px-3 py-2 text-primary-foreground"
                : "shrink-0 border border-white/20 px-3 py-2"
            }
          >
            <SystemLabel>{item}</SystemLabel>
          </button>
        ))}
      </div>
      <CollectionTabs collections={collections} activeCollection={collection} onSelect={setCollection} />
      <ShopGrid />
    </section>
  );

  const Collections = () => (
    <section className="min-h-screen px-4 pb-28 pt-28 md:px-8">
      <SectionHeading
        kicker="collections / rooms"
        title={
          <>
            not the same
            <br />
            everywhere.
          </>
        }
        action={<SystemLabel>{collection === "all" ? "03 rooms" : "room open"}</SystemLabel>}
      />
      <div className="grid gap-3 md:grid-cols-3">
        {collections.map((item, i) => (
          <button
            key={item.title}
            onClick={() => setCollection(item.title)}
            aria-pressed={collection === item.title}
            className={
              collection === item.title
                ? i === 1
                  ? "relative min-h-[56svh] overflow-hidden text-left ring-1 ring-primary md:mt-16"
                  : "relative min-h-[56svh] overflow-hidden text-left ring-1 ring-primary"
                : i === 1
                  ? "relative min-h-[56svh] overflow-hidden text-left md:mt-16"
                  : "relative min-h-[56svh] overflow-hidden text-left"
            }
          >
            <img src={item.imageUrl} alt={item.title} className="absolute inset-0 size-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-4 right-4">
              <SystemLabel className="text-primary">{item.number} / environment</SystemLabel>
              <h2 className="mt-1 font-['Archivo_Black'] text-4xl lowercase tracking-[-.07em]">{item.title}</h2>
              <p className="mt-2 max-w-xs text-xs text-white/65">{item.copy}</p>
            </div>
          </button>
        ))}
      </div>
      {activeCollection && (
        <section className="relative mt-12 min-h-[62svh] overflow-hidden border border-border bg-card md:mt-20 md:min-h-[58svh]">
          <img
            src={activeCollection.imageUrl}
            alt={`${activeCollection.title} collection`}
            className="absolute inset-0 size-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,12,.88),transparent_72%),linear-gradient(0deg,rgba(10,10,12,.9),transparent_55%)]" />
          <div className="relative flex min-h-[62svh] max-w-xl flex-col justify-end p-5 md:min-h-[58svh] md:p-8">
            <SystemLabel className="text-primary">room {activeCollection.number} / now open</SystemLabel>
            <h2 className="mt-3 font-['Archivo_Black'] text-[clamp(3.5rem,8vw,7rem)] lowercase leading-[.8] tracking-[-.085em]">
              {activeCollection.title}
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/70">
              {activeCollection.copy} Walk through the full set or take one object with you.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setCategory("all");
                  go("shop");
                }}
                className="flex h-12 items-center gap-2 border border-primary bg-primary px-4 text-primary-foreground"
              >
                <SystemLabel>shop this room</SystemLabel>
                <ArrowRight size={15} />
              </button>
              <button onClick={() => setCollection("all")} className="h-12 border border-white/30 px-4">
                <SystemLabel>all rooms</SystemLabel>
              </button>
            </div>
          </div>
        </section>
      )}
      <section className="mt-16 md:mt-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <SystemLabel className="text-primary">
              objects / {collection === "all" ? "all rooms" : collection}
            </SystemLabel>
            <h2 className="mt-2 font-['Archivo_Black'] text-4xl lowercase leading-[.86] tracking-[-.07em] md:text-6xl">
              {collection === "all" ? "walk the floor." : "take something."}
            </h2>
          </div>
          <button
            onClick={() => {
              setCategory("all");
              setCollection("all");
              go("shop");
            }}
            className="hidden items-center gap-1 md:flex"
          >
            <SystemLabel>full shop</SystemLabel>
            <ArrowRight size={14} />
          </button>
        </div>
        <CollectionTabs collections={collections} activeCollection={collection} onSelect={setCollection} />
        <ShopGrid
          items={
            collection === "all" ? products : products.filter((p) => p.collectionTitle === collection)
          }
        />
      </section>
      <section className="mt-20 border-t border-border pt-6 md:mt-28">
        <SystemLabel className="text-primary">change rooms</SystemLabel>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          <button
            onClick={() => go("home")}
            className="group flex min-h-16 items-center justify-between border border-white/20 px-4 text-left"
          >
            <span className="text-sm font-semibold lowercase">new arrivals</span>
            <ArrowUpRight size={15} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
          <button
            onClick={() => {
              setCategory("all");
              setCollection("all");
              go("shop");
            }}
            className="group flex min-h-16 items-center justify-between border border-white/20 px-4 text-left"
          >
            <span className="text-sm font-semibold lowercase">browse categories</span>
            <ArrowUpRight size={15} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
          <button
            onClick={() => go("archive")}
            className="group flex min-h-16 items-center justify-between border border-white/20 px-4 text-left"
          >
            <span className="text-sm font-semibold lowercase">enter archive</span>
            <ArrowUpRight size={15} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </section>
    </section>
  );

  const Archive = () => (
    <section className="min-h-screen px-4 pb-28 pt-28 md:px-8">
      <SectionHeading
        kicker="archive / available history"
        title={
          <>
            the parts
            <br />
            that stayed.
          </>
        }
        action={
          <button
            onClick={() => {
              setCollection("all");
              go("collections");
            }}
          >
            <SystemLabel>current rooms</SystemLabel>
          </button>
        }
      />
      {archiveProducts.length ? (
        <>
          <div className="grid gap-3 md:grid-cols-[1.15fr_.85fr]">
            <button
              onClick={() => openProduct(archiveProducts[0])}
              className="relative min-h-[62svh] overflow-hidden text-left"
            >
              <img
                src={archiveProducts[0].imageUrl}
                alt={archiveProducts[0].title}
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              <div className="absolute bottom-5 left-4">
                <SystemLabel className="text-primary">archive object / {archiveProducts[0].tag}</SystemLabel>
                <h2 className="mt-2 font-['Archivo_Black'] text-5xl lowercase tracking-[-.08em]">
                  {archiveProducts[0].title}
                </h2>
              </div>
            </button>
            <div className="grid grid-cols-2 gap-3">
              {archiveProducts.slice(1).map((item, i) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  presentation={getPresentation(presentations, item.id)}
                  index={i}
                  compact
                  onOpen={() => openProduct(item)}
                />
              ))}
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-5">
            <SystemLabel className="text-primary">collection ledger</SystemLabel>
            <div className="mt-4 grid gap-0 border-y border-border">
              {collections.map((item) => (
                <button
                  key={item.title}
                  onClick={() => {
                    setCollection(item.title);
                    go("collections");
                  }}
                  className="flex items-center justify-between border-b border-border py-5 text-left last:border-0"
                >
                  <span className="font-['Archivo_Black'] text-2xl lowercase tracking-[-.05em]">
                    {item.number} / {item.title}
                  </span>
                  <ArrowUpRight size={17} />
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="border border-dashed border-white/25 p-8">
          <SystemLabel className="text-primary">archive is waiting</SystemLabel>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            Past releases can appear here whenever the brand makes them available.
          </p>
          <button onClick={() => go("collections")} className="mt-6 flex items-center gap-2">
            <SystemLabel>visit current rooms</SystemLabel>
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </section>
  );

  const ProductDetail = () => {
    const detailProduct = selected ?? products[0];

    if (!detailProduct) return null;

    return (
    <section className="min-h-screen pb-28 pt-16">
      <button
        onClick={back}
        className="fixed left-4 top-16 z-30 flex h-10 items-center gap-2 border border-white/20 bg-black/60 px-3 backdrop-blur-md md:left-6"
      >
        <ArrowLeft size={16} />
        <SystemLabel>back</SystemLabel>
      </button>
      <div className="grid md:grid-cols-[1.35fr_.65fr]">
        <div className="relative min-h-[68svh] bg-[#171719] md:min-h-screen">
          <img src={detailProduct.imageUrl} alt={detailProduct.title} className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-60 pointer-events-none md:hidden">
            <Suspense fallback={<div className="size-16" />}>
              <FingerGestureAnimation size={64} triggerOnView playOnce colorMode="accent" />
            </Suspense>
          </div>
          <div className="absolute bottom-5 left-4 flex gap-1 z-20">
            <span className="h-1 w-12 bg-primary" />
            <span className="h-1 w-5 bg-white/40" />
            <span className="h-1 w-5 bg-white/40" />
          </div>
        </div>
        <div className="flex min-h-[32svh] flex-col border-l border-border px-4 pb-8 pt-7 md:min-h-screen md:px-8 md:pt-28">
          <SystemLabel className="text-primary">current object / {detailProduct.tag}</SystemLabel>
          <h1 className="mt-3 font-['Archivo_Black'] text-5xl leading-[.84] lowercase tracking-[-.075em] sm:text-7xl">
            {detailProduct.title}
          </h1>
          <div className="mt-7 flex justify-between border-y border-border py-4">
            <SystemLabel>retail</SystemLabel>
            <SystemLabel>{detailProduct.price.formatted}</SystemLabel>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-6 text-[#b5b5b9]">
            Cut for the hour after the city turns blue. Light shell, high collar, no extra signal.
          </p>
          <div className="mt-8">
            <SystemLabel>size — select</SystemLabel>
            <div className="mt-3 grid grid-cols-4 gap-1">
              {["XS", "S", "M", "L"].map((option) => (
                <button
                  key={option}
                  onClick={() => setSize(option)}
                  aria-pressed={size === option}
                  className={
                    size === option
                      ? "h-12 border border-primary bg-primary font-mono text-xs text-primary-foreground"
                      : "h-12 border border-white/20 font-mono text-xs hover:border-white"
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => toggleWish(detailProduct.id)}
            aria-pressed={wishlist.includes(detailProduct.id)}
            className={
              wishlist.includes(detailProduct.id)
                ? "mt-8 flex h-12 w-full items-center justify-between border border-primary px-4 text-primary"
                : "mt-8 flex h-12 w-full items-center justify-between border border-white/25 px-4 text-foreground"
            }
          >
            <span className="font-mono text-[11px] uppercase tracking-[.14em]">
              {wishlist.includes(detailProduct.id) ? "saved to wishlist" : "save to wishlist"}
            </span>
            <Heart size={16} fill={wishlist.includes(detailProduct.id) ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => openAdd(detailProduct)}
            className="mt-2 flex h-16 w-full items-center justify-between border border-primary bg-primary px-4 text-primary-foreground transition active:scale-[.98]"
          >
            <span className="font-['Archivo_Black'] text-xl lowercase tracking-[-.05em]">move to inventory</span>
            <Suspense fallback={<div className="size-6" />}>
              <BagArrowAnimation size={24} triggerOnView playOnce colorMode="monochrome" />
            </Suspense>
          </button>
        </div>
      </div>
      <div className="px-4 py-20 md:px-8">
        <SectionHeading kicker="same frequency" title="keep moving." />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {products
            .filter((p) => p.id !== detailProduct.id)
            .slice(0, 4)
            .map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                presentation={getPresentation(presentations, p.id)}
                compact
                index={i}
                onOpen={() => openProduct(p)}
              />
            ))}
        </div>
      </div>
    </section>
    );
  };

  const SearchView = () => {
    const displayed = query ? queryResults : products;
    return (
      <section className="min-h-screen px-4 pb-28 pt-28 md:px-8">
        <div className="flex items-center border-b border-white/30 pb-3">
          <Search className="text-primary" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="scan the archive"
            className="ml-3 flex-1 bg-transparent font-['Archivo_Black'] text-3xl lowercase tracking-[-.06em] outline-none placeholder:text-white/20 md:text-5xl"
          />
          <button
            onClick={() => {
              setQuery("");
              go("home");
            }}
            aria-label="Close search"
          >
            <X />
          </button>
        </div>
        {!query && recentlyViewed.length > 0 && (
          <section className="mt-8 border-b border-border pb-7">
            <div className="flex items-center justify-between">
              <SystemLabel className="text-primary">recently viewed</SystemLabel>
              <SystemLabel>{recentlyViewed.length} objects</SystemLabel>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {recentlyViewed.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openProduct(item)}
                  className="flex min-w-48 items-center gap-3 border border-white/20 p-2 text-left"
                >
                  <img src={item.imageUrl} alt={item.title} className="size-11 object-cover" />
                  <div>
                    <span className="block text-xs font-semibold lowercase">{item.title}</span>
                    <SystemLabel className="text-muted-foreground">{item.price.formatted}</SystemLabel>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
        <div className="mt-12">
          <SectionHeading
            kicker={query ? "results / " + queryResults.length : "trending / always in range"}
            title={query ? "still in range." : "in your orbit."}
          />
          {displayed.length ? (
            <div className="grid grid-cols-2 gap-3 md:max-w-5xl md:grid-cols-4">
              <ShopGrid items={displayed} />
            </div>
          ) : (
            <div className="border border-dashed border-white/25 p-8">
              <SystemLabel className="text-primary">nothing in range yet</SystemLabel>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                try collection names, object types, or another strange word.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  go("shop");
                }}
                className="mt-6 flex items-center gap-2"
              >
                <SystemLabel>browse all objects</SystemLabel>
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </section>
    );
  };

  const Wishlist = () => (
    <section className="min-h-screen px-4 pb-28 pt-28 md:px-8">
      <SectionHeading
        kicker="saved signal"
        title={
          <>
            keep an eye
            <br />
            on these.
          </>
        }
        action={<SystemLabel>{wishlist.length} saved</SystemLabel>}
      />
      {wishlist.length ? (
        <ShopGrid items={products.filter((p) => wishlist.includes(p.id))} />
      ) : (
        <div className="border border-dashed border-white/25 p-8">
          <Heart className="text-primary" />
          <h2 className="mt-4 font-['Archivo_Black'] text-4xl lowercase tracking-[-.07em]">nothing held.</h2>
          <button onClick={() => go("shop")} className="mt-6 flex items-center gap-2">
            <SystemLabel>scan the shop</SystemLabel>
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </section>
  );

  const Cart = () => (
    <section className="min-h-screen px-4 pb-28 pt-28 md:px-8">
      <SectionHeading
        kicker="inventory / active"
        title={
          <>
            you&apos;re holding
            <br />
            something.
          </>
        }
        action={<SystemLabel>{cart.length} objects</SystemLabel>}
      />
      {cart.length ? (
        <>
          <div className="border-y border-border">
            {cart.map((p, i) => (
              <div key={p.id + "-" + i} className="flex gap-4 border-b border-border py-4">
                <img src={p.imageUrl} alt={p.title} className="size-20 object-cover" />
                <div className="flex flex-1 justify-between">
                  <div>
                    <h3 className="text-sm font-semibold lowercase">{p.title}</h3>
                    <SystemLabel className="text-muted-foreground">
                      size {size.toLowerCase()} / 1 unit
                    </SystemLabel>
                  </div>
                  <button
                    onClick={() => setCart((items) => items.filter((_, index) => index !== i))}
                    aria-label={`Remove ${p.title} from inventory`}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => go("profile")}
            className="mt-5 h-14 w-full border border-primary bg-primary font-mono text-xs uppercase tracking-[.14em] text-primary-foreground"
          >
            continue / account
          </button>
        </>
      ) : (
        <div className="border border-dashed border-white/25 p-8">
          <ShoppingBag className="text-primary" />
          <h2 className="mt-4 font-['Archivo_Black'] text-4xl lowercase tracking-[-.07em]">pocket empty.</h2>
          <button onClick={() => go("shop")} className="mt-6 flex items-center gap-2">
            <SystemLabel>find an object</SystemLabel>
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </section>
  );

  const Profile = () => (
    <section className="min-h-screen px-4 pb-28 pt-28 md:px-8">
      <SectionHeading kicker="account / local signal" title="you&apos;re in." />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="border border-border p-5">
          <SystemLabel className="text-primary">visitor / 017</SystemLabel>
          <h2 className="mt-3 font-['Archivo_Black'] text-4xl lowercase tracking-[-.07em]">
            no signal
            <br />
            lost.
          </h2>
          <button onClick={() => go("wishlist")} className="mt-8 flex items-center gap-2">
            <SystemLabel>saved objects</SystemLabel>
            <ArrowRight size={15} />
          </button>
        </div>
        <div className="border border-border p-5">
          <SystemLabel className="text-primary">history / clear</SystemLabel>
          <p className="mt-3 text-sm text-muted-foreground">
            orders will gather here once you make your first move.
          </p>
          <button onClick={() => go("shop")} className="mt-8 flex items-center gap-2">
            <SystemLabel>return to shop</SystemLabel>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );

  // ─── Overlay Components (defined inside App for closure access) ────────────
  // forwardRef pattern lets App.tsx hold a ref to the DOM element
  // while the component itself owns its animation logic via useGSAP.

  type InventoryOverlayProps = {
    open: boolean;
    product: ProductModel | null;
    size: string;
    quantity: number;
    onClose: () => void;
    onSetSize: (s: string) => void;
    onSetQuantity: (q: number) => void;
    onAddItem: () => void;
  };

  // eslint-disable-next-line react/display-name
  const InventoryOverlay = forwardRef<HTMLDivElement, InventoryOverlayProps>(
    ({ open, product, size, quantity, onClose, onSetSize, onSetQuantity, onAddItem }, ref) => {
      const containerRef = useRef<HTMLDivElement>(null);

      // Sync external ref
      useEffect(() => {
        if (typeof ref === "function") ref(containerRef.current);
        else if (ref) ref.current = containerRef.current;
      });

      // GSAP-driven enter/exit based on open state
      useGSAP(() => {
        const el = containerRef.current;
        if (!el) return;
        if (open) {
          slideUpOverlay(el);
        } else {
          slideDownOverlay(el);
        }
      }, { dependencies: [open] });

      if (!product) return null;

      return (
        <div
          ref={containerRef}
          className="overlay-layer fixed bottom-20 right-4 z-[60] w-[calc(100%-2rem)] border border-primary bg-[#17171a] p-4 shadow-2xl md:bottom-24 md:right-6 md:w-80"
          style={{ opacity: 0, transform: 'translateY(100%)' }}
          aria-modal="true"
          role="dialog"
          aria-label="Configure object"
        >
          <div className="flex items-center justify-between">
            <SystemLabel className="text-primary">configure object</SystemLabel>
            <button onClick={onClose} aria-label="Close configuration" className="grid size-8 place-items-center hover:text-primary transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="my-4 border-y border-border py-3">
            <div className="flex justify-between">
              <span className="text-sm lowercase">{product.title}</span>
              <SystemLabel>{product.price.formatted}</SystemLabel>
            </div>
          </div>
          <SystemLabel>size — select</SystemLabel>
          <div className="mt-2 grid grid-cols-4 gap-1">
            {["XS", "S", "M", "L"].map((option) => (
              <button
                key={option}
                data-size={option}
                onClick={() => onSetSize(option)}
                aria-pressed={size === option}
                className={
                  size === option
                    ? "h-9 border border-primary bg-primary font-mono text-[10px] text-primary-foreground transition-colors"
                    : "h-9 border border-white/20 font-mono text-[10px] hover:border-white/50 transition-colors"
                }
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <SystemLabel>qty</SystemLabel>
            <div className="flex items-center border border-white/20">
              <button
                onClick={() => onSetQuantity(Math.max(1, quantity - 1))}
                className="grid size-8 place-items-center hover:text-primary transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="w-7 text-center font-mono text-xs" aria-live="polite" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
              <button
                onClick={() => onSetQuantity(quantity + 1)}
                className="grid size-8 place-items-center hover:text-primary transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
          <button
            onClick={onAddItem}
            className="mt-4 h-12 w-full bg-primary font-mono text-[11px] font-medium uppercase tracking-[.14em] text-primary-foreground transition-opacity hover:opacity-90 active:scale-[.98]"
          >
            move to pocket
          </button>
        </div>
      );
    }
  );

  type NavOverlayProps = {
    open: boolean;
    view: ViewModel;
    onClose: () => void;
    onGo: (v: ViewModel) => void;
    onGoShop: () => void;
  };

  // eslint-disable-next-line react/display-name
  const NavOverlay = forwardRef<HTMLDivElement, NavOverlayProps>(
    ({ open, view, onClose, onGo, onGoShop }, ref) => {
      const containerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (typeof ref === "function") ref(containerRef.current);
        else if (ref) ref.current = containerRef.current;
      });

      useGSAP(() => {
        const el = containerRef.current;
        if (!el) return;
        if (open) {
          fadeScaleOverlay(el);
        } else {
          fadeScaleOut(el);
        }
      }, { dependencies: [open] });

      const navItemClass = (active: boolean) =>
        active
          ? "flex min-h-20 items-center justify-between border border-primary bg-primary px-5 text-left text-primary-foreground transition-colors"
          : "flex min-h-20 items-center justify-between border border-white/20 px-5 text-left text-foreground hover:border-white/40 transition-colors";

      return (
        <div
          ref={containerRef}
          className="overlay-layer fixed inset-0 z-[70] bg-background px-4 pb-24 pt-6 md:px-8"
          style={{ opacity: 0, pointerEvents: open ? 'auto' : 'none' }}
          aria-modal="true"
          role="dialog"
          aria-label="Site index"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <SystemLabel className="text-primary">index / quick routes</SystemLabel>
              <p className="mt-1 text-xs text-muted-foreground">keep the signal close.</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close index"
              className="grid size-12 place-items-center border border-white/20 hover:border-white/50 transition-colors"
            >
              <X />
            </button>
          </div>
          <nav aria-label="Site navigation" className="mt-12 grid gap-3 md:mt-16 md:max-w-2xl">
            <button onClick={() => onGo("home")} className={navItemClass(view === "home")}>
              <span className="text-lg font-medium lowercase tracking-[-.03em]">home</span>
              <SystemLabel>01</SystemLabel>
            </button>
            <button onClick={onGoShop} className={navItemClass(view === "shop")}>
              <span className="text-lg font-medium lowercase tracking-[-.03em]">shop</span>
              <SystemLabel>02</SystemLabel>
            </button>
            <button onClick={() => onGo("collections")} className={navItemClass(view === "collections")}>
              <span className="text-lg font-medium lowercase tracking-[-.03em]">collections</span>
              <SystemLabel>03</SystemLabel>
            </button>
            <button onClick={() => onGo("story")} className={navItemClass(view === "story")}>
              <span className="text-lg font-medium lowercase tracking-[-.03em]">our story</span>
              <SystemLabel>04</SystemLabel>
            </button>
            <button onClick={() => onGo("contact")} className={navItemClass(view === "contact")}>
              <span className="text-lg font-medium lowercase tracking-[-.03em]">contact</span>
              <SystemLabel>05</SystemLabel>
            </button>
          </nav>
          <div className="absolute bottom-7 left-4 right-4 border-t border-border pt-4 md:left-8 md:right-8">
            <SystemLabel className="text-muted-foreground">index closes on route selection</SystemLabel>
          </div>
        </div>
      );
    }
  );

  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const submitContactPayload = async (payload: typeof contactForm) => {
    // Architecture note: Future backend endpoint (e.g., Shopify API or custom lambda)
    // const response = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(payload) });
    // if (!response.ok) throw new Error('Transmission failed');
    
    // Simulating network request for architecture readiness
    return new Promise((resolve) => setTimeout(resolve, 800));
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    // 1. Validation (HTML5 handles basics, explicit checks here)
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!contactForm.subject) {
      setFormError("Please select a purpose for your transmission.");
      return;
    }

    // 2. Payload Construction
    const payload = {
      ...contactForm,
      submittedAt: new Date().toISOString(),
    };

    // 3. Submission Pipeline
    setIsSubmitting(true);
    try {
      await submitContactPayload(payload);
      setContactSent(true);
      setTimeout(() => setContactSent(false), 4000);
      setContactForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error("[GLYCH Contact] Error:", error);
      setFormError("Signal lost. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const Story = () => (
    <section className="min-h-screen px-4 pb-28 pt-28 md:px-8">
      {/* Manifesto */}
      <div className="border-b border-border pb-20 md:pb-32">
        <SystemLabel className="text-primary">signal / origin</SystemLabel>
        <h1 className="mt-6 font-['Archivo_Black'] text-[clamp(4rem,12vw,10rem)] lowercase leading-[.78] tracking-[-.1em]">
          not
          <br />
          <span className="ml-[10vw] text-transparent [-webkit-text-stroke:1px_#ededed]">noise.</span>
          <br />
          signal.
        </h1>
        <p className="mt-10 max-w-md text-sm leading-7 text-white/60 md:ml-[33vw] md:mt-16">
          GLYCH started in a back room where the city's frequency was too loud to ignore and too good to turn down.
          We build objects for people who move differently — not against the signal, but through it.
        </p>
      </div>

      {/* Three values */}
      <div className="grid gap-0 border-b border-border py-20 md:grid-cols-3 md:py-28">
        {[
          { n: "01", title: "made for motion.", copy: "Every cut, every weight, every material decision is made for how the body moves at 2am, not 2pm." },
          { n: "02", title: "no noise.", copy: "We don't make statements. We make objects. The statement is yours." },
          { n: "03", title: "signal over trend.", copy: "Collections don't follow seasons. They follow frequency. When the signal changes, we change." },
        ].map(({ n, title, copy }) => (
          <div key={n} className="border-b border-border px-0 py-10 md:border-b-0 md:border-r md:px-8 md:last:border-r-0 md:first:pl-0">
            <SystemLabel className="text-primary">{n}</SystemLabel>
            <h2 className="mt-4 font-['Archivo_Black'] text-3xl lowercase leading-[.88] tracking-[-.07em] md:text-4xl">{title}</h2>
            <p className="mt-5 text-sm leading-6 text-white/55">{copy}</p>
          </div>
        ))}
      </div>

      {/* Signal Timeline */}
      <div className="py-20 md:py-28">
        <SystemLabel className="text-primary">timeline / signal log</SystemLabel>
        <div className="mt-10 grid gap-0 border-y border-border">
          {[
            { year: "2019", event: "First room.", copy: "A single pop-up. No branding. Just objects and a playlist." },
            { year: "2021", event: "Online.", copy: "The signal goes digital. First drop sells through in 11 hours." },
            { year: "2022", event: "New York.", copy: "Permanent space opens. The room becomes an address." },
            { year: "2024", event: "Expanded.", copy: "Three collections. The archive begins. The frequency expands." },
            { year: "Now", event: "Still moving.", copy: "You're here. The signal is still live." },
          ].map(({ year, event, copy }) => (
            <div key={year} className="grid grid-cols-[80px_1fr] items-start gap-6 border-b border-border py-7 last:border-0 md:grid-cols-[120px_1fr]">
              <SystemLabel className="pt-px text-primary">{year}</SystemLabel>
              <div>
                <h3 className="font-['Archivo_Black'] text-2xl lowercase tracking-[-.06em]">{event}</h3>
                <p className="mt-2 text-sm leading-5 text-white/50">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="grid gap-3 border-t border-border pt-10 md:grid-cols-2">
        <button
          onClick={() => go("shop")}
          className="group flex min-h-20 items-center justify-between border border-primary bg-primary px-5 text-primary-foreground"
        >
          <span className="font-['Archivo_Black'] text-2xl lowercase tracking-[-.05em]">enter the shop</span>
          <ArrowUpRight size={20} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>
        <button
          onClick={() => go("collections")}
          className="group flex min-h-20 items-center justify-between border border-white/20 px-5 hover:border-white/40 transition-colors"
        >
          <span className="font-['Archivo_Black'] text-2xl lowercase tracking-[-.05em]">see collections</span>
          <ArrowUpRight size={20} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>
      </div>
    </section>
  );

  const Contact = () => (
    <section className="min-h-screen px-4 pb-28 pt-28 md:px-8">
      <div className="grid gap-16 md:grid-cols-[1fr_1.1fr] md:gap-24">
        {/* Left: intro copy */}
        <div>
          <SystemLabel className="text-primary">contact / open channel</SystemLabel>
          <h1 className="mt-6 font-['Archivo_Black'] text-[clamp(3rem,9vw,7rem)] lowercase leading-[.82] tracking-[-.09em]">
            send a
            <br />
            signal.
          </h1>
          <p className="mt-8 max-w-xs text-sm leading-7 text-white/55">
            We read every message. Response time varies — we're usually back within 48 hours.
          </p>
          <div className="mt-10 grid gap-4 border-t border-border pt-8">
            <div>
              <SystemLabel className="text-primary">email</SystemLabel>
              <p className="mt-1 text-sm text-white/70">signal@glych.studio</p>
            </div>
            <div>
              <SystemLabel className="text-primary">location</SystemLabel>
              <p className="mt-1 text-sm text-white/70">New York, NY — signal / 017</p>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div>
          {contactSent ? (
            <div className="flex min-h-[400px] flex-col items-start justify-center">
              <SystemLabel className="text-primary">transmitted.</SystemLabel>
              <h2 className="mt-4 font-['Archivo_Black'] text-4xl lowercase tracking-[-.07em]">signal received.</h2>
              <p className="mt-4 text-sm text-white/55">We'll come back to you within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="grid gap-4" noValidate={false}>
              {formError && (
                <div className="border border-red-500/50 bg-red-500/10 p-3">
                  <SystemLabel className="text-red-400">{formError}</SystemLabel>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <SystemLabel className="mb-2 block text-primary">name</SystemLabel>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="your name"
                    className="h-12 w-full border border-white/20 bg-transparent px-4 text-sm placeholder:text-white/25 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <SystemLabel className="mb-2 block text-primary">email</SystemLabel>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="h-12 w-full border border-white/20 bg-transparent px-4 text-sm placeholder:text-white/25 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <SystemLabel className="mb-2 block text-primary">phone</SystemLabel>
                <input
                  id="contact-phone"
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 (optional)"
                  className="h-12 w-full border border-white/20 bg-transparent px-4 text-sm placeholder:text-white/25 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <SystemLabel className="mb-2 block text-primary">subject</SystemLabel>
                <select
                  id="contact-subject"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm((f) => ({ ...f, subject: e.target.value }))}
                  className="h-12 w-full border border-white/20 bg-[#0a0a0c] px-4 text-sm text-white/70 focus:border-primary focus:outline-none transition-colors appearance-none"
                >
                  <option value="" disabled>select a purpose</option>
                  <option value="general">general enquiry</option>
                  <option value="order">order support</option>
                  <option value="wholesale">wholesale / stockist</option>
                  <option value="press">press & editorial</option>
                  <option value="collab">collaboration</option>
                  <option value="other">other</option>
                </select>
              </div>
              <div>
                <SystemLabel className="mb-2 block text-primary">message</SystemLabel>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={contactForm.message}
                  onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="what's on your signal?"
                  className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm placeholder:text-white/25 focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-14 w-full items-center justify-between border border-primary bg-primary px-5 text-primary-foreground transition active:scale-[.98] disabled:opacity-50 disabled:active:scale-100"
              >
                <span className="font-['Archivo_Black'] text-xl lowercase tracking-[-.04em]">
                  {isSubmitting ? "transmitting..." : "transmit signal"}
                </span>
                <ArrowDownRight size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );

  const content: Record<ViewModel, React.ReactNode> = {
    home: <Home />,
    shop: <Shop />,
    collections: <Collections />,
    archive: <Archive />,
    wishlist: <Wishlist />,
    cart: <Cart />,
    profile: <Profile />,
    product: <ProductDetail />,
    search: <SearchView />,
    story: <Story />,
    contact: <Contact />,
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background font-['Manrope'] text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between p-4 mix-blend-screen md:p-6">
        <button
          onClick={() => go("home")}
          className="flex items-center"
        >
          <GlychText 
            text={siteConfig.brand.name + "."} 
            font={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-0.08em", lineHeight: 1 }}
            playMode="hover"
            slice={{ enabled: true, intensity: 50, minHeight: 25, maxHeight: 75 }}
            shake={{ enabled: false, intensity: 10, x: 10, y: 10 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0 }}
          />
        </button>
        <SystemLabel className="hidden md:block">{siteConfig.brand.tagline}</SystemLabel>
        <span className="size-2 animate-pulse bg-primary" aria-hidden="true" />
      </header>
      {view !== "home" && view !== "product" && (
        <button
          onClick={back}
          className="fixed left-4 top-16 z-30 flex h-10 items-center gap-2 border border-white/20 bg-black/60 px-3 backdrop-blur-md md:left-6"
        >
          <ArrowLeft size={16} />
          <SystemLabel>back</SystemLabel>
        </button>
      )}
      {/* View container — receives enter/exit GSAP transitions */}
      <div ref={viewContainerRef} className="will-animate">
        {content[view]}
      </div>
      <div className="fixed bottom-4 left-4 right-4 z-50 flex items-end justify-between gap-2 md:bottom-6 md:left-6 md:right-6">
        <div className="flex gap-2">
          <BottomControl icon={<Menu size={17} />} label="index" onClick={() => setNavOpen(true)} active={navOpen} />
          <BottomControl
            icon={<Search size={17} />}
            label="search"
            onClick={() => go("search")}
            active={view === "search"}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => go("wishlist")}
            aria-label="Wishlist"
            className="grid size-14 place-items-center border border-white/20 bg-[#111114]/95 backdrop-blur-xl"
          >
            <Heart size={17} fill={wishlist.length ? "currentColor" : "none"} />
          </button>
          <button
            ref={cartButtonRef}
            onClick={() => go("cart")}
            aria-label={`Inventory${cart.length > 0 ? `, ${cart.length} items` : ""}`}
            className="relative flex h-14 items-center gap-2 border border-primary bg-primary px-4 text-primary-foreground shadow-[0_0_32px_rgba(198,255,61,.14)] transition active:scale-95"
          >
            <ShoppingBag size={18} />
            <SystemLabel>inventory</SystemLabel>
            {cart.length > 0 && (
              <span className="grid size-5 place-items-center bg-background font-mono text-[10px] text-primary">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>
      {/* ── Inventory overlay (configure object / add to pocket) ─────────── */}
      {/* Always mounted — GSAP animates in/out via useGSAP below */}
      <InventoryOverlay
        ref={inventoryOverlayRef}
        open={inventoryOpen && !!activeProduct}
        product={activeProduct}
        size={size}
        quantity={quantity}
        onClose={() => setInventoryOpen(false)}
        onSetSize={(s) => {
          setSize(s);
          // Size selector spring — tactile feedback
          const btn = inventoryOverlayRef.current?.querySelector(
            `[data-size="${s}"]`
          );
          if (btn) gsap.fromTo(btn, { scale: 0.88 }, { scale: 1, duration: 0.3, ease: "elastic.out(1.2, 0.4)" });
        }}
        onSetQuantity={setQuantity}
        onAddItem={() => addItem(activeProduct ?? undefined)}
      />

      {/* ── Nav overlay (index / quick routes) ───────────────────────────── */}
      <NavOverlay
        ref={navOverlayRef}
        open={navOpen}
        view={view}
        onClose={() => setNavOpen(false)}
        onGo={(v) => { go(v); }}
        onGoShop={() => { setCategory("all"); setCollection("all"); go("shop"); }}
      />
    </main>
  );
}

export default App;
