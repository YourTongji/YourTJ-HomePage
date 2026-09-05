import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { PREVIEW_SLIDES } from '../constants';
import { useI18n } from '../i18n';
import { assetUrl } from '../utils/assets';
import { ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { Reveal } from './Reveal';

gsap.registerPlugin(useGSAP);

const AUTO_ADVANCE_MS = 6000;
const SWIPE_THRESHOLD_PX = 48;

const displayUrl = (href: string): string => href.replace(/^https?:\/\//, '');

export const ProductPreview: React.FC = () => {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const scopeRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const chromeUrlRef = useRef<HTMLParagraphElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevIndexRef = useRef(0);
  const animateTrackTo = useRef<((xPercent: number) => void) | undefined>(undefined);
  const animateCaptionIn = useRef<((direction: number) => void) | undefined>(undefined);
  const animateSlideIn = useRef<((index: number) => void) | undefined>(undefined);

  useGSAP(
    (_context, contextSafe) => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      animateTrackTo.current = contextSafe?.((xPercent: number) => {
        gsap.to(trackRef.current, {
          xPercent,
          duration: prefersReducedMotion ? 0 : 0.85,
          ease: prefersReducedMotion ? 'none' : 'power3.inOut',
          overwrite: 'auto',
        });
      });

      // Caption drifts in along the slide direction so text and track read as one motion.
      animateCaptionIn.current = contextSafe?.((direction: number) => {
        gsap.fromTo(
          captionRef.current,
          { x: 18 * direction, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: prefersReducedMotion ? 0 : 0.45,
            ease: 'power3.out',
            overwrite: 'auto',
          },
        );
        gsap.fromTo(
          chromeUrlRef.current,
          { autoAlpha: 0.25 },
          { autoAlpha: 1, duration: 0.35, overwrite: 'auto' },
        );
      });

      // Incoming slide settles from a hair of zoom, echoing the track's ease.
      animateSlideIn.current = contextSafe?.((index: number) => {
        const slide = slideRefs.current[index];
        if (!slide || prefersReducedMotion) return;
        gsap.fromTo(
          slide,
          { scale: 1.02 },
          { scale: 1, duration: 0.9, ease: 'power3.inOut', overwrite: 'auto' },
        );
      });
    },
    { scope: scopeRef },
  );

  useEffect(() => {
    const prevIndex = prevIndexRef.current;
    prevIndexRef.current = activeIndex;
    if (activeIndex === prevIndex) return;

    const movedForward = activeIndex === (prevIndex + 1) % PREVIEW_SLIDES.length;
    const direction = movedForward ? 1 : -1;
    animateTrackTo.current?.(-activeIndex * 100);
    animateCaptionIn.current?.(direction);
    animateSlideIn.current?.(activeIndex);
  }, [activeIndex]);

  const goTo = useCallback((index: number) => {
    setActiveIndex(((index % PREVIEW_SLIDES.length) + PREVIEW_SLIDES.length) % PREVIEW_SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setActiveIndex((index) => (index + 1) % PREVIEW_SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  const activeSlide = PREVIEW_SLIDES[activeIndex];

  return (
    <section ref={scopeRef} aria-label={t('preview.section.label')} className="scroll-mt-24">
      <Reveal className="mx-auto max-w-page px-4 pb-6 pt-2 sm:px-6 md:pb-10">
        <div className="mx-auto max-w-4xl">
          <div
            role="group"
            aria-roledescription="carousel"
            aria-label={t('preview.section.label')}
            className="glass-panel overflow-hidden rounded-2xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') goTo(activeIndex - 1);
              if (event.key === 'ArrowRight') goTo(activeIndex + 1);
            }}
          >
            {/* Thin browser chrome: window dots, quiet URL, quick open link. */}
            <div className="relative flex h-8 items-center justify-center border-b border-edge bg-surface/50 px-4">
              <div aria-hidden="true" className="absolute left-4 flex gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary/50" />
              </div>
              <p
                ref={chromeUrlRef}
                aria-hidden="true"
                className="truncate px-12 text-center text-[11px] font-medium tracking-wide text-tertiary"
              >
                {displayUrl(activeSlide.href)}
              </p>
              <a
                href={activeSlide.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t('preview.visit')} - ${displayUrl(activeSlide.href)}`}
                className="absolute right-2.5 flex h-6 w-6 items-center justify-center rounded-md text-tertiary transition-colors duration-200 hover:text-primary"
              >
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Viewport: the frame keeps the screenshots' native 2478x1410 ratio on every
                breakpoint, so slides never crop; only the frame width scales. Light and
                dark captures are stacked per slide and crossfade on theme switch. */}
            <div
              className="relative aspect-[2478/1410] touch-pan-y select-none overflow-hidden"
              onPointerDown={(event) => {
                pointerStartX.current = event.clientX;
                setPaused(true);
              }}
              onPointerUp={(event) => {
                const startX = pointerStartX.current;
                pointerStartX.current = null;
                setPaused(false);
                if (startX === null) return;
                const deltaX = event.clientX - startX;
                if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
                  goTo(activeIndex + (deltaX < 0 ? 1 : -1));
                }
              }}
              onPointerCancel={() => {
                pointerStartX.current = null;
                setPaused(false);
              }}
            >
              <div ref={trackRef} className="flex h-full">
                {PREVIEW_SLIDES.map((slide, index) => (
                  <div
                    key={slide.id}
                    ref={(el) => {
                      slideRefs.current[index] = el;
                    }}
                    className="relative h-full w-full shrink-0"
                    aria-hidden={index !== activeIndex}
                  >
                    <img
                      src={assetUrl(slide.imageLight)}
                      alt={index === activeIndex ? t(slide.titleKey) : ''}
                      width={2478}
                      height={1410}
                      draggable={false}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="absolute inset-0 h-full w-full select-none object-cover opacity-100 transition-opacity duration-500 dark:opacity-0"
                    />
                    <img
                      src={assetUrl(slide.imageDark)}
                      alt=""
                      aria-hidden="true"
                      width={2478}
                      height={1410}
                      draggable={false}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="absolute inset-0 h-full w-full select-none object-cover opacity-0 transition-opacity duration-500 dark:opacity-100"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                aria-label={t('preview.prev')}
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-edge bg-page/70 text-primary shadow-card backdrop-blur-md transition-[transform,border-color,background-color] duration-200 hover:border-brand/40 active:scale-90 sm:left-4 sm:h-10 sm:w-10"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                aria-label={t('preview.next')}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-edge bg-page/70 text-primary shadow-card backdrop-blur-md transition-[transform,border-color,background-color] duration-200 hover:border-brand/40 active:scale-90 sm:right-4 sm:h-10 sm:w-10"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Caption row: headline and link switch with the active slide. */}
          <div
            aria-live="polite"
            className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-4"
          >
            {/* Mask clips the caption's directional drift so the swap stays contained. */}
            <div className="min-w-0 overflow-hidden">
              <div ref={captionRef}>
                <h2 className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">
                  {t(activeSlide.titleKey)}
                </h2>
                <p className="mt-1 truncate text-sm text-tertiary">
                  {displayUrl(activeSlide.href)}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <div
                className="flex items-center gap-1.5"
                role="tablist"
                aria-label={t('preview.section.label')}
              >
                {PREVIEW_SLIDES.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={`${index + 1} / ${PREVIEW_SLIDES.length}`}
                    onClick={() => goTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? 'w-6 bg-link'
                        : 'w-2 bg-tertiary/40 hover:bg-tertiary/70'
                    }`}
                  />
                ))}
              </div>

              <a
                href={activeSlide.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-link transition-transform duration-200 hover:opacity-85 active:scale-[0.96]"
              >
                {t('preview.visit')}
                <ArrowUpRightIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
