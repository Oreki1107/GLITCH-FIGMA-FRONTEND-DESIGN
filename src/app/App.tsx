import { useMemo, useState } from "react";
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
import type { GlitchProduct, View } from "@/domain/types";
import {
  mockProducts,
  mockCollections,
  mockProductPresentations,
  presentationMap,
  getPresentation,
  HERO_IMAGE_URL,
  archiveProductIds,
  productsByIds,
  collectionsByHandles,
  deriveCategories,
  filterProducts,
  searchProducts,
  getHomepageModule,
} from "@/data/mock";
import { SystemLabel, SectionHeading, BottomControl } from "@/components/primitives";
import { ProductCard, ProductGrid } from "@/components/product";
import { CollectionTabs } from "@/components/collection";

const products = mockProducts;
const collections = mockCollections;
const presentations = presentationMap(mockProductPresentations);

function App() {
  const [view, setView] = useState<View>("home");
  const [routeHistory, setRouteHistory] = useState<View[]>([]);
  const [navOpen, setNavOpen] = useState(false);
  const [selected, setSelected] = useState<GlitchProduct>(products[0]);
  const [collection, setCollection] = useState("all");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState<GlitchProduct[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<GlitchProduct[]>([]);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [strip, setStrip] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");

  const go = (next: View) => {
    if (next !== view) setRouteHistory((items) => [...items, view].slice(-16));
    setView(next);
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => {
    setRouteHistory((items) => {
      const previous = items.at(-1) ?? "home";
      setView(previous);
      setNavOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return items.slice(0, -1);
    });
  };
  const openProduct = (p: GlitchProduct) => {
    setSelected(p);
    setRecentlyViewed((items) => [p, ...items.filter((item) => item.id !== p.id)].slice(0, 4));
    go("product");
  };
  const addItem = (p = selected) => {
    setCart((items) => [...items, ...Array(quantity).fill(p)]);
    setInventoryOpen(false);
    setQuantity(1);
  };
  const toggleWish = (id: string) =>
    setWishlist((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));

  const filtered = useMemo(
    () => filterProducts(products, category, collection),
    [category, collection],
  );
  const activeCollection = collections.find((item) => item.title === collection);
  const categories = useMemo(() => deriveCategories(products), []);

  const heroProduct = productsByIds(products, getHomepageModule("hero")?.productIds)[0];
  const featuredProducts = productsByIds(products, getHomepageModule("featuredProducts")?.productIds);
  const homeCollections = collectionsByHandles(
    collections,
    getHomepageModule("collectionPreview")?.collectionHandles,
  );
  const newArrivalProducts = productsByIds(products, getHomepageModule("newArrivals")?.productIds);
  const trendingProducts = productsByIds(products, getHomepageModule("trending")?.productIds);
  const editorialCollection = collections.find(
    (item) => item.handle === getHomepageModule("editorial")?.collectionHandle,
  );
  const archiveProducts = productsByIds(
    products,
    getHomepageModule("archive")?.productIds ?? archiveProductIds,
  );
  const curatedProducts = productsByIds(products, getHomepageModule("curatedFit")?.productIds);
  const queryResults = searchProducts(products, query);
  const openAdd = (p: GlitchProduct) => {
    setSelected(p);
    setInventoryOpen(true);
  };

  const ShopGrid = ({ items = filtered }: { items?: GlitchProduct[] }) => (
    <ProductGrid
      items={items}
      presentations={presentations}
      onOpen={openProduct}
      expandedIndex={view === "shop" ? 0 : null}
    />
  );

  const Home = () => (
    <>
      <section className="relative min-h-[90svh] overflow-hidden bg-[#0f1214]">
        <img
          src={HERO_IMAGE_URL}
          alt="Model wearing the new Glitch collection at night"
          className="absolute inset-0 size-full object-cover object-[58%_center] opacity-75"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,12,.75),transparent_65%),linear-gradient(0deg,rgba(10,10,12,.95),transparent_36%)]" />
        <div className="relative flex min-h-[90svh] flex-col justify-end px-4 pb-28 pt-24 md:px-8 md:pb-24">
          <SystemLabel className="mb-4 text-primary">
            drop / {heroProduct?.collectionTitle ?? "current release"}
          </SystemLabel>
          <h1 className="max-w-4xl font-['Archivo_Black'] text-[clamp(4.5rem,15vw,12rem)] leading-[.78] tracking-[-.09em]">
            DON&apos;T
            <br />
            <span className="ml-[8vw] text-transparent [-webkit-text-stroke:1px_#ededed]">STAND</span>
            <br />
            STILL.
          </h1>
          <div className="mt-8 flex items-end justify-between gap-6 md:ml-[33vw] md:max-w-md">
            <p className="max-w-[190px] text-xs leading-5 text-white/65">
              the city keeps loading. wear something that catches up.
            </p>
            {heroProduct && (
              <button
                onClick={() => openAdd(heroProduct)}
                className="group flex items-center gap-2 border-b border-primary pb-2 text-primary"
              >
                <SystemLabel>drag to cart</SystemLabel>
                <ArrowDownRight size={16} />
              </button>
            )}
          </div>
        </div>
        {heroProduct && (
          <button
            onClick={() => openProduct(heroProduct)}
            className="absolute right-4 top-[26%] flex items-center gap-2 border border-white/20 bg-black/30 px-3 py-2 backdrop-blur-sm md:right-8"
          >
            <span className="size-2 bg-primary" />
            <SystemLabel>
              {heroProduct.title} / {heroProduct.price.formatted}
            </SystemLabel>
          </button>
        )}
      </section>
      {featuredProducts.length > 0 && (
        <section className="px-4 py-20 md:px-8 md:py-32">
          <SectionHeading
            kicker="objects in range"
            title="pick a signal."
            action={
              <button onClick={() => go("shop")} className="hidden items-center gap-1 md:flex">
                <SystemLabel>shop all</SystemLabel>
                <ArrowRight size={14} />
              </button>
            }
          />
          <ShopGrid items={featuredProducts} />
          <button
            onClick={() => go("shop")}
            className="mt-2 flex w-full items-center justify-between border-y border-border py-5 md:hidden"
          >
            <SystemLabel>shop all objects</SystemLabel>
            <ArrowRight size={16} />
          </button>
        </section>
      )}
      {homeCollections.length > 0 && (
        <section className="overflow-hidden border-y border-border bg-[#16161a] px-4 py-16 md:px-8 md:py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <SystemLabel className="text-primary">three rooms / one signal</SystemLabel>
              <h2 className="mt-2 font-['Archivo_Black'] text-5xl lowercase leading-[.86] tracking-[-.08em] md:text-7xl">
                move through it.
              </h2>
            </div>
            <button onClick={() => go("collections")}>
              <SystemLabel>all collections</SystemLabel>
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {homeCollections.map((item, i) => (
              <button
                key={item.title}
                onClick={() => {
                  setCollection(item.title);
                  go("collections");
                }}
                className={`group relative min-h-72 overflow-hidden text-left ${i % 3 === 1 ? "md:mt-16" : ""}`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="absolute inset-0 size-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <SystemLabel style={{ color: item.accentColor } as React.CSSProperties}>
                    {item.number} / collection
                  </SystemLabel>
                  <h3 className="mt-1 font-['Archivo_Black'] text-3xl lowercase tracking-[-.06em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[220px] text-xs text-white/65">{item.copy}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
      {newArrivalProducts.length > 0 && (
        <section className="bg-[#101014] px-4 py-20 md:px-8 md:py-32">
          <SectionHeading
            kicker="recently dropped"
            title={
              <>
                too new
                <br />
                for context.
              </>
            }
            action={<SystemLabel>{products.length} objects</SystemLabel>}
          />
          <div className="flex gap-3 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none]">
            {newArrivalProducts.slice(strip, strip + 3).map((item) => (
              <div key={item.id} className="w-[64vw] shrink-0 sm:w-64 lg:w-72">
                <ProductCard
                  product={item}
                  presentation={getPresentation(presentations, item.id)}
                  compact
                  onOpen={() => openProduct(item)}
                />
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end gap-1">
            <button
              onClick={() => setStrip(Math.max(0, strip - 1))}
              aria-label="Previous products"
              className="grid size-10 place-items-center border border-white/20 disabled:opacity-30"
              disabled={strip === 0}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={() => setStrip(Math.min(newArrivalProducts.length - 3, strip + 1))}
              aria-label="Next products"
              className="grid size-10 place-items-center border border-white/20 disabled:opacity-30"
              disabled={strip >= newArrivalProducts.length - 3}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </section>
      )}
      <section className="border-y border-border bg-[#0d0d10] px-4 py-20 md:px-8 md:py-28">
        {trendingProducts.length > 0 && (
          <SectionHeading
            kicker="trending / picked up fast"
            title={
              <>
                moving
                <br />
                through it.
              </>
            }
            action={
              <button onClick={() => go("shop")} className="flex items-center gap-1">
                <SystemLabel>view all</SystemLabel>
                <ArrowRight size={14} />
              </button>
            }
          />
        )}
        <div className="divide-y divide-border border-y border-border">
          {trendingProducts.map((item, i) => (
            <button
              key={item.id}
              onClick={() => openProduct(item)}
              className="group grid w-full grid-cols-[30px_72px_1fr_auto] items-center gap-3 py-3 text-left md:grid-cols-[44px_120px_1fr_auto] md:gap-6 md:py-4"
            >
              <SystemLabel className="text-primary">0{i + 1}</SystemLabel>
              <div className="aspect-square overflow-hidden bg-card">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="size-full object-cover grayscale-[20%] transition duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold lowercase tracking-[-.02em] md:text-base">{item.title}</h3>
                <SystemLabel className="text-muted-foreground">
                  {item.tag} / {item.collectionTitle}
                </SystemLabel>
              </div>
              <div className="flex items-center gap-3">
                <SystemLabel>{item.price.formatted}</SystemLabel>
                <ArrowUpRight size={15} className="text-primary" />
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="px-4 py-20 md:px-8 md:py-32">
        {categories.length > 0 && (
          <div className="grid gap-9 md:grid-cols-[.72fr_1.28fr] md:items-end">
            <div>
              <SystemLabel className="text-primary">category / enter by feeling</SystemLabel>
              <h2 className="mt-3 font-['Archivo_Black'] text-5xl lowercase leading-[.86] tracking-[-.08em] md:text-7xl">
                choose a
                <br />
                direction.
              </h2>
              <p className="mt-5 max-w-[240px] text-xs leading-5 text-muted-foreground">
                not every object is for the same kind of night.
              </p>
            </div>
            <div className="border-y border-border">
              {categories.map((name, i) => (
                <button
                  key={name}
                  onClick={() => {
                    setCategory(name);
                    setCollection("all");
                    go("shop");
                  }}
                  className="group flex min-h-16 w-full items-center justify-between gap-4 border-b border-border text-left last:border-0 md:min-h-20"
                >
                  <div className="flex items-center gap-4">
                    <SystemLabel className="text-primary">0{i + 1}</SystemLabel>
                    <div>
                      <span className="block text-sm font-semibold lowercase">{name}</span>
                      <SystemLabel className="text-muted-foreground">shop the {name} edit</SystemLabel>
                    </div>
                  </div>
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
      {editorialCollection && (
        <section className="relative min-h-[78svh] overflow-hidden bg-[#17171a] md:min-h-[72svh]">
          <img
            src={editorialCollection.imageUrl}
            alt={`${editorialCollection.title} editorial campaign`}
            className="absolute inset-0 size-full object-cover object-[55%_center] opacity-70"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,10,12,.94),transparent_68%),linear-gradient(90deg,rgba(10,10,12,.72),transparent_65%)]" />
          <div className="relative flex min-h-[78svh] max-w-xl flex-col justify-end px-4 pb-16 pt-20 md:min-h-[72svh] md:px-8">
            <SystemLabel className="text-primary">editorial / {editorialCollection.title}</SystemLabel>
            <h2 className="mt-3 font-['Archivo_Black'] text-[clamp(4rem,10vw,8rem)] lowercase leading-[.8] tracking-[-.09em]">
              {editorialCollection.title}
              <br />
              in motion.
            </h2>
            <p className="mt-6 max-w-[230px] text-sm leading-6 text-white/70">{editorialCollection.copy}</p>
            <button
              onClick={() => {
                setCollection(editorialCollection.title);
                go("collections");
              }}
              className="mt-8 flex w-fit items-center gap-2 border-b border-primary pb-2 text-primary"
            >
              <SystemLabel>enter the room</SystemLabel>
              <ArrowDownRight size={16} />
            </button>
          </div>
        </section>
      )}
      {archiveProducts.length > 0 && (
        <section className="relative overflow-hidden border-y border-border bg-[#16161a] px-4 py-16 md:px-8 md:py-24">
          <div className="absolute -right-8 top-4 font-['Archivo_Black'] text-[8rem] leading-none tracking-[-.11em] text-white/[.035] md:text-[18rem]">
            ARCHIVE
          </div>
          <div className="relative grid gap-12 md:grid-cols-[.8fr_1.2fr] md:items-end">
            <div>
              <SystemLabel className="text-primary">storage / open</SystemLabel>
              <h2 className="mt-3 max-w-sm font-['Archivo_Black'] text-5xl lowercase leading-[.86] tracking-[-.08em]">
                from the
                <br />
                backlog.
              </h2>
              <button onClick={() => go("archive")} className="mt-8 flex items-center gap-2 border-b border-white/30 pb-2">
                <SystemLabel>enter archive</SystemLabel>
                <ArrowUpRight size={15} />
              </button>
            </div>
            <button onClick={() => go("archive")} className="grid grid-cols-2 gap-3 text-left">
              <div className="aspect-[.75] overflow-hidden">
                <img
                  src={archiveProducts[0]?.imageUrl}
                  alt={archiveProducts[0]?.title ?? "Archive look"}
                  className="size-full object-cover"
                />
              </div>
              <div className="mt-10 aspect-[.75] overflow-hidden">
                <img
                  src={archiveProducts[1]?.imageUrl ?? archiveProducts[0]?.imageUrl}
                  alt={archiveProducts[1]?.title ?? "Archive look"}
                  className="size-full object-cover"
                />
              </div>
            </button>
          </div>
        </section>
      )}
      {curatedProducts.length > 0 && (
        <section className="px-4 py-20 md:px-8 md:py-28">
          <div className="grid gap-8 border-b border-border pb-10 md:grid-cols-[1fr_1.2fr]">
            <div>
              <SystemLabel className="text-primary">curated by / 3am assembly</SystemLabel>
              <h2 className="mt-3 font-['Archivo_Black'] text-5xl lowercase leading-[.86] tracking-[-.08em]">
                worn together
                <br />
                on purpose.
              </h2>
              <button
                onClick={() => {
                  setCategory(categories[0] ?? "all");
                  go("shop");
                }}
                className="mt-7 flex items-center gap-2"
              >
                <SystemLabel>see the fit</SystemLabel>
                <ArrowRight size={15} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {curatedProducts.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => openProduct(item)}
                  className={i === 1 ? "mt-10 text-left" : "text-left"}
                >
                  <div className="aspect-[.72] overflow-hidden bg-card">
                    <img src={item.imageUrl} alt={item.title} className="size-full object-cover" />
                  </div>
                  <SystemLabel className="mt-2 block text-muted-foreground">{item.title}</SystemLabel>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="border-t border-border bg-[#121216] px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-8 md:grid-cols-[1fr_.9fr]">
          <div>
            <SystemLabel className="text-primary">continue exploring</SystemLabel>
            <h2 className="mt-3 max-w-md font-['Archivo_Black'] text-5xl lowercase leading-[.86] tracking-[-.08em] md:text-7xl">
              there&apos;s more
              <br />
              in the signal.
            </h2>
          </div>
          <div className="grid gap-2">
            {[
              ["shop all objects", "shop"],
              ["enter collections", "collections"],
              ["open the archive", "archive"],
            ].map(([label, destination], i) => (
              <button
                key={destination}
                onClick={() => go(destination as View)}
                className="group flex min-h-16 items-center justify-between border border-white/20 px-4 text-left transition hover:border-primary md:min-h-20"
              >
                <div>
                  <SystemLabel className="text-primary">0{i + 1}</SystemLabel>
                  <span className="ml-3 text-sm font-semibold lowercase">{label}</span>
                </div>
                <ArrowUpRight size={16} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
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

  const ProductDetail = () => (
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
          <img src={selected.imageUrl} alt={selected.title} className="absolute inset-0 size-full object-cover" />
          <div className="absolute bottom-5 left-4 flex gap-1">
            <span className="h-1 w-12 bg-primary" />
            <span className="h-1 w-5 bg-white/40" />
            <span className="h-1 w-5 bg-white/40" />
          </div>
        </div>
        <div className="flex min-h-[32svh] flex-col border-l border-border px-4 pb-8 pt-7 md:min-h-screen md:px-8 md:pt-28">
          <SystemLabel className="text-primary">current object / {selected.tag}</SystemLabel>
          <h1 className="mt-3 font-['Archivo_Black'] text-5xl leading-[.84] lowercase tracking-[-.075em] sm:text-7xl">
            {selected.title}
          </h1>
          <div className="mt-7 flex justify-between border-y border-border py-4">
            <SystemLabel>retail</SystemLabel>
            <SystemLabel>{selected.price.formatted}</SystemLabel>
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
            onClick={() => toggleWish(selected.id)}
            aria-pressed={wishlist.includes(selected.id)}
            className={
              wishlist.includes(selected.id)
                ? "mt-8 flex h-12 w-full items-center justify-between border border-primary px-4 text-primary"
                : "mt-8 flex h-12 w-full items-center justify-between border border-white/25 px-4 text-foreground"
            }
          >
            <span className="font-mono text-[11px] uppercase tracking-[.14em]">
              {wishlist.includes(selected.id) ? "saved to wishlist" : "save to wishlist"}
            </span>
            <Heart size={16} fill={wishlist.includes(selected.id) ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => openAdd(selected)}
            className="mt-2 flex h-16 w-full items-center justify-between border border-primary bg-primary px-4 text-primary-foreground transition active:scale-[.98]"
          >
            <span className="font-['Archivo_Black'] text-xl lowercase tracking-[-.05em]">move to inventory</span>
            <ArrowDownRight />
          </button>
        </div>
      </div>
      <div className="px-4 py-20 md:px-8">
        <SectionHeading kicker="same frequency" title="keep moving." />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {products
            .filter((p) => p.id !== selected.id)
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

  const content: Record<View, React.ReactNode> = {
    home: <Home />,
    shop: <Shop />,
    collections: <Collections />,
    archive: <Archive />,
    wishlist: <Wishlist />,
    cart: <Cart />,
    profile: <Profile />,
    product: <ProductDetail />,
    search: <SearchView />,
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background font-['Manrope'] text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between p-4 mix-blend-screen md:p-6">
        <button
          onClick={() => go("home")}
          className="font-['Archivo_Black'] text-2xl leading-none tracking-[-0.08em]"
        >
          GLITCH<span className="text-primary">.</span>
        </button>
        <SystemLabel className="hidden md:block">signal / 017 // new york</SystemLabel>
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
      {content[view]}
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
            onClick={() => go("cart")}
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
      {inventoryOpen && (
        <div className="fixed bottom-20 right-4 z-[60] w-[calc(100%-2rem)] border border-primary bg-[#17171a] p-4 shadow-2xl md:bottom-24 md:right-6 md:w-80">
          <div className="flex items-center justify-between">
            <SystemLabel className="text-primary">configure object</SystemLabel>
            <button onClick={() => setInventoryOpen(false)} aria-label="Close configuration">
              <X size={16} />
            </button>
          </div>
          <div className="my-4 border-y border-border py-3">
            <div className="flex justify-between">
              <span className="text-sm lowercase">{selected.title}</span>
              <SystemLabel>{selected.price.formatted}</SystemLabel>
            </div>
          </div>
          <SystemLabel>size — select</SystemLabel>
          <div className="mt-2 grid grid-cols-4 gap-1">
            {["XS", "S", "M", "L"].map((option) => (
              <button
                key={option}
                onClick={() => setSize(option)}
                aria-pressed={size === option}
                className={
                  size === option
                    ? "h-9 border border-primary bg-primary font-mono text-[10px] text-primary-foreground"
                    : "h-9 border border-white/20 font-mono text-[10px]"
                }
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <SystemLabel>qty</SystemLabel>
            <div className="flex items-center border border-white/20">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid size-8 place-items-center">
                <Minus size={13} />
              </button>
              <span className="w-7 text-center font-mono text-xs">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="grid size-8 place-items-center">
                <Plus size={13} />
              </button>
            </div>
          </div>
          <button
            onClick={() => addItem(selected)}
            className="mt-4 h-12 w-full bg-primary font-mono text-[11px] font-medium uppercase tracking-[.14em] text-primary-foreground"
          >
            confirm / add
          </button>
        </div>
      )}
      {navOpen && (
        <div className="fixed inset-0 z-[70] bg-background px-4 pb-24 pt-6 md:px-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <SystemLabel className="text-primary">index / quick routes</SystemLabel>
              <p className="mt-1 text-xs text-muted-foreground">keep the signal close.</p>
            </div>
            <button
              onClick={() => setNavOpen(false)}
              aria-label="Close index"
              className="grid size-12 place-items-center border border-white/20"
            >
              <X />
            </button>
          </div>
          <nav aria-label="Index navigation" className="mt-12 grid gap-3 md:mt-16 md:max-w-2xl">
            <button
              onClick={() => go("home")}
              className={
                view === "home"
                  ? "flex min-h-20 items-center justify-between border border-primary bg-primary px-5 text-left text-primary-foreground"
                  : "flex min-h-20 items-center justify-between border border-white/20 px-5 text-left text-foreground"
              }
            >
              <span className="text-lg font-medium lowercase tracking-[-.03em]">new</span>
              <SystemLabel>01</SystemLabel>
            </button>
            <button
              onClick={() => go("collections")}
              className={
                view === "collections"
                  ? "flex min-h-20 items-center justify-between border border-primary bg-primary px-5 text-left text-primary-foreground"
                  : "flex min-h-20 items-center justify-between border border-white/20 px-5 text-left text-foreground"
              }
            >
              <span className="text-lg font-medium lowercase tracking-[-.03em]">collections</span>
              <SystemLabel>02</SystemLabel>
            </button>
            <button
              onClick={() => {
                setCategory("all");
                setCollection("all");
                go("shop");
              }}
              className={
                view === "shop"
                  ? "flex min-h-20 items-center justify-between border border-primary bg-primary px-5 text-left text-primary-foreground"
                  : "flex min-h-20 items-center justify-between border border-white/20 px-5 text-left text-foreground"
              }
            >
              <span className="text-lg font-medium lowercase tracking-[-.03em]">categories</span>
              <SystemLabel>03</SystemLabel>
            </button>
            <button
              onClick={() => go("wishlist")}
              className={
                view === "wishlist"
                  ? "flex min-h-20 items-center justify-between border border-primary bg-primary px-5 text-left text-primary-foreground"
                  : "flex min-h-20 items-center justify-between border border-white/20 px-5 text-left text-foreground"
              }
            >
              <span className="text-lg font-medium lowercase tracking-[-.03em]">wishlist</span>
              <SystemLabel>04</SystemLabel>
            </button>
          </nav>
          <div className="absolute bottom-7 left-4 right-4 border-t border-border pt-4 md:left-8 md:right-8">
            <SystemLabel className="text-muted-foreground">index closes on route selection</SystemLabel>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
