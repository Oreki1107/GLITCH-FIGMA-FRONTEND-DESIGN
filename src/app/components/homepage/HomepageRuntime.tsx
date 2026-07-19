import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import type { CSSProperties } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { CollectionModel, ProductModel, ViewModel } from "@/domain/shared/models";
import { HERO_IMAGE_URL, getPresentation } from "@/data/mock";
import { SystemLabel, SectionHeading } from "@/components/primitives";
import { ProductCard, ProductGrid } from "@/components/product";
import { siteConfig } from "@/config/site.config";
import { createHeroParallax, createSceneTransitions } from "@/animations/gsap/timelines/scrollAnimations";
import { BagArrowAnimation, ScrollDownAnimation, ScrollingAnimation, ScrollToAnimation, GlychText, SliderArrowAnimation } from "@/components/motion";
import type { AnimationControls } from "@/components/motion";
import { Suspense } from "react";

interface HomepageRuntimeProps {
  heroProduct: ProductModel | null;
  featuredProducts: ProductModel[];
  homeCollections: CollectionModel[];
  newArrivalProducts: ProductModel[];
  trendingProducts: ProductModel[];
  categories: string[];
  productsCount: number;
  editorialCollection: CollectionModel | null;
  archiveProducts: ProductModel[];
  curatedProducts: ProductModel[];
  presentations: Map<string, { productId: string; tone: string; wide?: boolean }>;
  strip: number;
  onOpenProduct: (product: ProductModel) => void;
  onOpenAdd: (product: ProductModel) => void;
  onGo: (view: ViewModel) => void;
  onSelectCollection: (collectionTitle: string) => void;
  onSelectCategory: (category: string) => void;
  onSetStrip: (value: number) => void;
  onWishlistToggle?: (id: string) => void;
  onQuickAdd?: (product: ProductModel) => void;
  isWishlisted?: (id: string) => boolean;
}

export function HomepageRuntime({
  heroProduct,
  featuredProducts,
  homeCollections,
  newArrivalProducts,
  trendingProducts,
  categories,
  productsCount,
  editorialCollection,
  archiveProducts,
  curatedProducts,
  presentations,
  strip,
  onOpenProduct,
  onOpenAdd,
  onGo,
  onSelectCollection,
  onSelectCategory,
  onSetStrip,
  onWishlistToggle,
  onQuickAdd,
  isWishlisted,
}: HomepageRuntimeProps) {
  const ShopGrid = ({ items = featuredProducts }: { items?: ProductModel[] }) => (
    <ProductGrid
      items={items}
      presentations={presentations}
      onOpen={onOpenProduct}
      expandedIndex={null}
      onWishlistToggle={onWishlistToggle}
      onQuickAdd={onQuickAdd}
      isWishlisted={isWishlisted}
    />
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  
  // State for behavioral refinements
  const [heroVisible, setHeroVisible] = useState(true);
  const [footerArrived, setFooterArrived] = useState(false);
  const [scrollingComplete, setScrollingComplete] = useState(false);
  const [hasUsedCarousel, setHasUsedCarousel] = useState(false);
  const bagArrowRef = useRef<AnimationControls>(null);
  
  // Hero Parallax Layers
  const ambientRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLImageElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  const floatingUIRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroRef.current) {
            setHeroVisible(entry.isIntersecting);
            // Restore Hero state on re-entry
            if (entry.isIntersecting) {
              bagArrowRef.current?.play();
            }
          } else if (entry.target === footerRef.current && entry.isIntersecting) {
            const hasArrived = sessionStorage.getItem("glych_footer_arrived");
            if (!hasArrived) {
              sessionStorage.setItem("glych_footer_arrived", "true");
              setFooterArrived(true);
            } else {
              setScrollingComplete(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (footerRef.current) observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, []);

  // Track carousel interaction to gracefully suppress guidance
  useEffect(() => {
    if (strip > 0 && !hasUsedCarousel) {
      setHasUsedCarousel(true);
    }
  }, [strip, hasUsedCarousel]);

  useGSAP(() => {
    // 1. Initialize Master Hero Parallax
    if (
      heroRef.current &&
      ambientRef.current &&
      subjectRef.current &&
      typographyRef.current
    ) {
      createHeroParallax(heroRef.current, {
        ambient: ambientRef.current,
        subject: subjectRef.current,
        typography: typographyRef.current,
        floatingUI: floatingUIRef.current,
        cta: ctaRef.current,
      });
    }

    // 2. Initialize Cinematic Scene Transitions
    if (containerRef.current) {
      // Find all scene anchors (focal points) to guide the camera
      const anchors = containerRef.current.querySelectorAll("[data-scene-anchor]");
      createSceneTransitions(anchors);
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <section 
        ref={heroRef} 
        className="relative min-h-[100svh] overflow-hidden bg-[#050507]"
        style={{ perspective: "1500px", transformStyle: "preserve-3d", perspectiveOrigin: "50% 50%" }}
      >
        {/* Layer 1: Ambient Environment (Deepest, moves slightly up) */}
        <div 
          ref={ambientRef}
          className="absolute inset-0 size-full bg-[radial-gradient(circle_at_center,rgba(25,25,32,1)_0%,rgba(5,5,7,1)_100%)] opacity-70"
          style={{ willChange: "transform, filter", transformOrigin: "center center" }}
        />

        {/* Layer 2: Subject (Model Imagery, pulls down against scroll) */}
        <img
          ref={subjectRef}
          src={HERO_IMAGE_URL}
          alt="Model wearing the new Glych collection at night"
          className="absolute inset-0 size-full object-cover object-[58%_center] opacity-90 mix-blend-lighten shadow-[0_0_120px_rgba(0,0,0,0.8)]"
          style={{ willChange: "transform, filter", transformOrigin: "center center" }}
        />

        {/* Atmospheric overlays (Static relative to container, blends subject into ambient) */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,12,.85),transparent_65%),linear-gradient(0deg,rgba(10,10,12,.95),transparent_36%)] pointer-events-none" />

        {/* Layer 3: Typography (Closest to camera, detaches fast) */}
        <div 
          ref={typographyRef} 
          className="absolute inset-0 flex flex-col justify-end px-8 pb-32 pt-24 md:px-16 md:pb-32"
          style={{ willChange: "transform", transformOrigin: "left bottom" }}
        >
          <SystemLabel className="mb-4 text-primary">
            drop / {heroProduct?.collectionTitle ?? "current release"}
          </SystemLabel>
          {/* Hero brand typography — GlychText owns the identity, staggered intervals prevent sync */}
          <h1 className="max-w-4xl font-['Archivo_Black'] text-[clamp(4.5rem,15vw,12rem)] leading-[.78] tracking-[-.09em]" aria-label="Don't Stand Still">
            <GlychText
              text="DON'T"
              font={{ fontFamily: "var(--font-heading)", fontSize: "clamp(4.5rem,15vw,12rem)", fontWeight: 900, letterSpacing: "-0.09em", lineHeight: 0.78 }}
              color="white"
              playMode="loop"
              transition={{ duration: 0.45, ease: "easeOut", delay: 0, loopInterval: 13 }}
              slice={{ enabled: true, intensity: 60, minHeight: 20, maxHeight: 80 }}
              shake={{ enabled: true, intensity: 8, x: 6, y: 4 }}
            />
            <br />
            <span className="ml-[8vw] inline-block">
              <GlychText
                text="STAND"
                font={{ fontFamily: "var(--font-heading)", fontSize: "clamp(4.5rem,15vw,12rem)", fontWeight: 900, letterSpacing: "-0.09em", lineHeight: 0.78 }}
                color="transparent"
                className="[-webkit-text-stroke:1px_#ededed]"
                playMode="loop"
                transition={{ duration: 0.5, ease: "easeOut", delay: 0, loopInterval: 17 }}
                slice={{ enabled: true, intensity: 55, minHeight: 15, maxHeight: 85 }}
                shake={{ enabled: true, intensity: 6, x: 5, y: 3 }}
              />
            </span>
            <br />
            <GlychText
              text="STILL."
              font={{ fontFamily: "var(--font-heading)", fontSize: "clamp(4.5rem,15vw,12rem)", fontWeight: 900, letterSpacing: "-0.09em", lineHeight: 0.78 }}
              color="white"
              playMode="loop"
              transition={{ duration: 0.4, ease: "easeOut", delay: 0, loopInterval: 11 }}
              slice={{ enabled: true, intensity: 65, minHeight: 25, maxHeight: 75 }}
              shake={{ enabled: true, intensity: 9, x: 7, y: 5 }}
            />
          </h1>
          <div className="mt-8 flex flex-col items-start gap-8 md:ml-[33vw] md:max-w-md">
            <p className="max-w-[190px] text-xs leading-5 text-white/65">
              the city keeps loading. wear something that catches up.
            </p>

            {/* Native Interaction Layer: embedded directly in the typography composition */}
            {heroProduct && (
              <div
                className={`transition-opacity duration-700 ${heroVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ animation: 'glych-fade-in 1s ease 1s both' }}
              >
                <button
                  ref={ctaRef}
                  onClick={() => onOpenAdd(heroProduct)}
                  aria-label={`Move ${heroProduct.title} to pocket`}
                  className="group relative flex items-center gap-2.5 text-primary outline-none"
                  style={{ willChange: "transform" }}
                >
                  {/* Label: the exact hit target */}
                  <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em]">
                    move to pocket
                  </span>
                  
                  {/* BagArrow: placed after text to guide eye toward top-right cart */}
                  <Suspense fallback={<div className="size-5" />}>
                    <BagArrowAnimation
                      controlRef={bagArrowRef}
                      size={20}
                      autoplay={true}
                      loop={false}
                      speed={0.7}
                      onComplete={() => {
                        if (heroVisible) {
                          setTimeout(() => bagArrowRef.current?.play(), 2500);
                        }
                      }}
                      colorMode="accent"
                      ariaLabel="Add to pocket"
                    />
                  </Suspense>

                  {/* Affordance: exactly spans the interaction bounds */}
                  <span
                    className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    aria-hidden="true"
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Layer 4: Floating UI (Inherits subject movement, anchored near product focus) */}
        {heroProduct && (
          <button
            ref={floatingUIRef}
            onClick={() => onOpenProduct(heroProduct)}
            className="absolute right-4 top-[26%] flex items-center gap-2 border border-white/20 bg-black/30 px-3 py-2 backdrop-blur-sm md:right-8 z-10 opacity-0 pointer-events-none"
            aria-hidden="true"
            style={{ willChange: "transform" }}
          >
            <span className="size-2 bg-primary" />
            <SystemLabel>
              {heroProduct.title} / {heroProduct.price.formatted}
            </SystemLabel>
          </button>
        )}

        {/* Layer 6: Scroll Hint — loops autonomously, fades when user scrolls, tied to GSAP settle */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-1000 ${heroVisible ? 'opacity-60' : 'opacity-0 pointer-events-none'}`}
          aria-hidden="true"
          style={{ animation: 'glych-fade-in 1s ease 2.5s both' }}
        >
          <Suspense fallback={<div className="size-10" />}>
            <ScrollDownAnimation size={40} colorMode="accent" ariaLabel="Scroll to explore" />
          </Suspense>
        </div>
      </section>
      
      <style>{`
        @keyframes glych-fade-in {
          from { opacity: 0; }
          to { opacity: 0.6; }
        }
      `}</style>
      {featuredProducts.length > 0 && (
        <section className="px-4 py-20 md:px-8 md:py-32">
          <SectionHeading
            kicker="objects in range"
            title="pick a signal."
            action={
              <button onClick={() => onGo("shop")} className="hidden items-center gap-1 md:flex">
                <SystemLabel>shop all</SystemLabel>
                <ArrowRight size={14} />
              </button>
            }
          />
          <div data-scene-anchor="true" data-scene="confident" data-scene-align="center">
            <ShopGrid items={featuredProducts} />
          </div>
          <button
            onClick={() => onGo("shop")}
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
            <button onClick={() => onGo("collections")}>
              <SystemLabel>all collections</SystemLabel>
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-3" data-scene-anchor="true" data-scene="confident" data-scene-align="center">
            {homeCollections.map((item, i) => (
              <button
                key={item.title}
                onClick={() => {
                  onSelectCollection(item.title);
                  onGo("collections");
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
                  <SystemLabel style={{ color: item.accentColor } as CSSProperties}>
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
            action={<SystemLabel>{productsCount} objects</SystemLabel>}
          />
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none]" data-scene-anchor="true" data-scene="tactile" data-scene-align="center">
              {newArrivalProducts.slice(strip, strip + 3).map((item) => (
                <div key={item.id} className="w-[64vw] shrink-0 sm:w-64 lg:w-72">
                <ProductCard
                  product={item}
                  presentation={getPresentation(presentations, item.id)}
                  compact
                  onOpen={() => onOpenProduct(item)}
                  onWishlistToggle={onWishlistToggle}
                  onQuickAdd={onQuickAdd}
                  isWishlisted={isWishlisted?.(item.id) ?? false}
                />
                </div>
              ))}
            </div>
            {/* Horizontal scroll hint */}
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 z-10 mix-blend-difference hidden md:block">
              <Suspense fallback={<div />}>
                <SliderArrowAnimation size={32} triggerOnView playOnce colorMode="accent" />
              </Suspense>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-1">
            <button
              onClick={() => onSetStrip(Math.max(0, strip - 1))}
              aria-label="Previous products"
              className="relative grid size-10 place-items-center border border-white/20 disabled:opacity-30 group"
              disabled={strip === 0}
            >
              <ChevronLeft size={17} className={`transition-opacity ${!hasUsedCarousel ? 'opacity-30' : 'opacity-100'}`} />
              {!hasUsedCarousel && (
                <div className="absolute inset-0 grid place-items-center pointer-events-none rotate-180 mix-blend-difference opacity-80 group-hover:opacity-100 transition-opacity">
                  <Suspense fallback={<div />}><SliderArrowAnimation size={24} colorMode="accent" autoplay loop /></Suspense>
                </div>
              )}
            </button>
            <button
              onClick={() => onSetStrip(Math.min(newArrivalProducts.length - 3, strip + 1))}
              aria-label="Next products"
              className="relative grid size-10 place-items-center border border-white/20 disabled:opacity-30 group"
              disabled={strip >= newArrivalProducts.length - 3}
            >
              <ChevronRight size={17} className={`transition-opacity ${!hasUsedCarousel ? 'opacity-30' : 'opacity-100'}`} />
              {!hasUsedCarousel && (
                <div className="absolute inset-0 grid place-items-center pointer-events-none mix-blend-difference opacity-80 group-hover:opacity-100 transition-opacity">
                  <Suspense fallback={<div />}><SliderArrowAnimation size={24} colorMode="accent" autoplay loop /></Suspense>
                </div>
              )}
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
              <button onClick={() => onGo("shop")} className="flex items-center gap-1">
                <SystemLabel>view all</SystemLabel>
                <ArrowRight size={14} />
              </button>
            }
          />
        )}
        <div className="divide-y divide-border border-y border-border" data-scene-anchor="true" data-scene="tactile" data-scene-align="center">
          {trendingProducts.map((item, i) => (
            <button
              key={item.id}
              onClick={() => onOpenProduct(item)}
              className="group grid w-full grid-cols-[30px_72px_1fr_auto] items-center gap-3 py-3 text-left md:grid-cols-[44px_120px_1fr_auto] md:gap-6 md:py-4 active:scale-[.99] transition-transform duration-100"
            >
              <SystemLabel className="text-primary group-hover:text-white transition-colors duration-300">0{i + 1}</SystemLabel>
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
                <ArrowUpRight size={15} className="text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
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
            <div className="border-y border-border" data-scene-anchor="true" data-scene="tactile" data-scene-align="center">
              {categories.map((name, i) => (
                <button
                  key={name}
                  onClick={() => {
                    onSelectCategory(name);
                    onGo("shop");
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
          <div className="relative flex min-h-[78svh] max-w-xl flex-col justify-end px-4 pb-16 pt-20 md:min-h-[72svh] md:px-8" data-scene-anchor="true" data-scene="slow" data-scene-align="center">
            <SystemLabel className="text-primary">editorial / {editorialCollection.title}</SystemLabel>
            <h2 className="mt-3 font-['Archivo_Black'] text-[clamp(4rem,10vw,8rem)] lowercase leading-[.8] tracking-[-.09em]">
              {editorialCollection.title}
              <br />
              in motion.
            </h2>
            <p className="mt-6 max-w-[230px] text-sm leading-6 text-white/70">{editorialCollection.copy}</p>
            <button
              onClick={() => {
                onSelectCollection(editorialCollection.title);
                onGo("collections");
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
          <div className="relative grid gap-12 md:grid-cols-[.8fr_1.2fr] md:items-end" data-scene-anchor="true" data-scene="confident" data-scene-align="center">
            <div>
              <SystemLabel className="text-primary">storage / open</SystemLabel>
              <h2 className="mt-3 max-w-sm font-['Archivo_Black'] text-5xl lowercase leading-[.86] tracking-[-.08em]">
                from the
                <br />
                backlog.
              </h2>
              <button onClick={() => onGo("archive")} className="mt-8 flex items-center gap-2 border-b border-white/30 pb-2">
                <SystemLabel>enter archive</SystemLabel>
                <ArrowUpRight size={15} />
              </button>
            </div>
            <button onClick={() => onGo("archive")} className="grid grid-cols-2 gap-3 text-left">
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
          <div className="grid gap-8 border-b border-border pb-10 md:grid-cols-[1fr_1.2fr]" data-scene-anchor="true" data-scene="tactile" data-scene-align="center">
            <div>
              <SystemLabel className="text-primary">curated by / 3am assembly</SystemLabel>
              <h2 className="mt-3 font-['Archivo_Black'] text-5xl lowercase leading-[.86] tracking-[-.08em]">
                worn together
                <br />
                on purpose.
              </h2>
              <button
                onClick={() => {
                  onSelectCategory(categories[0] ?? "all");
                  onGo("shop");
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
                  onClick={() => onOpenProduct(item)}
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
      {/* ── Brand Story Teaser ─────────────────────────────────────────── */}
      <section className="border-t border-border bg-[#0d0d10] px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-10 md:grid-cols-[1.1fr_.9fr] md:items-end" data-scene-anchor="true" data-scene="reflective" data-scene-align="center">
          <div>
            <SystemLabel className="text-primary">signal / origin</SystemLabel>
            <h2 className="mt-4 font-['Archivo_Black'] text-[clamp(3.5rem,9vw,7.5rem)] lowercase leading-[.8] tracking-[-.09em]">
              not
              <br />
              <span className="text-transparent [-webkit-text-stroke:1px_#6b6b70]">noise.</span>
              <br />
              signal.
            </h2>
            <p className="mt-8 max-w-sm text-sm leading-7 text-white/50">
              GLYCH started in a back room where the city&apos;s frequency was too loud to ignore.
              We build objects for people who move differently.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 md:pb-2">
            <button
              onClick={() => onGo("story")}
              className="group flex items-center gap-2 border-b border-primary pb-1 text-primary transition"
            >
              <SystemLabel>read the signal</SystemLabel>
              <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={() => onGo("contact")}
              className="group flex items-center gap-2 border-b border-white/25 pb-1 transition hover:border-white/50"
            >
              <SystemLabel className="text-white/60">open a channel</SystemLabel>
              <ArrowRight size={14} className="text-white/60 transition group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer ref={footerRef} data-scene-anchor="true" data-scene="arrival" data-scene-align="top" className="border-t border-border bg-[#08080b] px-4 pt-16 pb-8 md:px-8 md:pt-20">
        {/* Top row: logo + signal line */}
        <div className="flex items-start justify-between border-b border-border pb-10">
          <div>
            <button
              onClick={() => onGo("home")}
              className="flex items-center"
            >
              <GlychText 
                text="GLYCH." 
                font={{ fontFamily: "var(--font-heading)", fontSize: "1.875rem", fontWeight: 900, letterSpacing: "-0.08em", lineHeight: 1 }}
                color="white"
                playMode="loop"
                slice={{ enabled: true, intensity: 40, minHeight: 20, maxHeight: 80 }}
                shake={{ enabled: false, intensity: 10, x: 10, y: 10 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2, loopInterval: 7 }}
              />
            </button>
            <p className="mt-3 text-xs text-white/35">{siteConfig.brand.tagline}</p>
          </div>
          {/* Social links */}
          <div className="flex flex-col items-end gap-2">
            {siteConfig.socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1 text-xs text-white/40 transition hover:text-white"
              >
                {label}
                <ArrowUpRight size={11} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Mid row: quick links + newsletter */}
        <div className="grid gap-12 py-10 md:grid-cols-[1fr_1fr_1.2fr] md:gap-8">
          {/* Quick links */}
          <div>
            <SystemLabel className="mb-4 text-primary">quick links</SystemLabel>
            <nav aria-label="Footer navigation" className="grid gap-2">
              {[
                { label: "Home", view: "home" },
                { label: "Shop", view: "shop" },
                { label: "Collections", view: "collections" },
                { label: "Our Story", view: "story" },
                { label: "Contact", view: "contact" },
              ].map(({ label, view }) => (
                <button
                  key={view}
                  onClick={() => onGo(view as import("@/domain/shared/models").ViewModel)}
                  className="w-fit text-sm text-white/50 transition hover:text-white text-left"
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact info */}
          <div>
            <SystemLabel className="mb-4 text-primary">contact</SystemLabel>
            <div className="grid gap-2">
              <a href={`mailto:${siteConfig.contact.email}`} className="text-sm text-white/50 transition hover:text-white">
                {siteConfig.contact.email}
              </a>
              <a href={siteConfig.contact.phone.link} className="text-sm text-white/50 transition hover:text-white">
                {siteConfig.contact.phone.display}
              </a>
              <p className="mt-2 text-xs text-white/30">{siteConfig.contact.address.split('—')[0].trim()}</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <SystemLabel className="mb-2 text-primary">stay in range.</SystemLabel>
            <p className="mb-4 text-xs leading-5 text-white/40">
              Drop notifications, early access, signal updates.
            </p>
            <div className="flex border border-white/20 focus-within:border-primary transition-colors">
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Newsletter email"
                className="flex-1 bg-transparent px-3 py-3 text-xs text-white placeholder:text-white/25 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    console.log("[GLYCH Newsletter]", (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              <button
                className="grid size-11 shrink-0 place-items-center border-l border-white/20 text-primary transition hover:bg-primary hover:text-primary-foreground"
                aria-label="Subscribe to newsletter"
                onClick={(e) => {
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                  console.log("[GLYCH Newsletter]", input?.value);
                  if (input) input.value = "";
                }}
              >
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar with integrated Footer Return Guidance */}
        <div className="flex flex-col gap-3 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <SystemLabel className="text-white/25">© {siteConfig.brand.copyrightYear} {siteConfig.brand.name}. All rights reserved.</SystemLabel>
          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
            <div className="flex gap-6">
              <button className="text-xs text-white/25 transition hover:text-white/60">Privacy Policy</button>
              <button className="text-xs text-white/25 transition hover:text-white/60">Terms of Use</button>
            </div>
            
            {/* Inline Footer Guidance (Continuous Transition) */}
            <div className="relative size-8 opacity-50 transition-opacity hover:opacity-100">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Return to top" className="absolute inset-0 size-full z-10" />
              <Suspense fallback={<div className="size-full" />}>
                {footerArrived && !scrollingComplete && (
                  <div className="absolute inset-0 pointer-events-none" style={{ animation: "glych-fade-in 0.5s ease" }}>
                    <ScrollingAnimation size={32} colorMode="accent" onComplete={() => setScrollingComplete(true)} />
                  </div>
                )}
                {scrollingComplete && (
                  <div className="absolute inset-0 pointer-events-none" style={{ animation: "glych-fade-in 1s ease" }}>
                    <ScrollToAnimation size={32} colorMode="accent" />
                  </div>
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

