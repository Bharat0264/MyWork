"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "next/link";
import { services } from "@/data/services";
import { Container } from "@/components/container";
import styles from "./services-glass-showcase.module.css";

const AUTO_ADVANCE_DELAY = 7200;

const sphereOffsets = [
  [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ],
  [
    { x: 8, y: -6 },
    { x: -9, y: 7 },
    { x: 6, y: 8 },
  ],
  [
    { x: -7, y: 8 },
    { x: 8, y: -6 },
    { x: -8, y: -7 },
  ],
  [
    { x: 9, y: 6 },
    { x: -7, y: -8 },
    { x: 7, y: -6 },
  ],
  [
    { x: -8, y: -7 },
    { x: 9, y: 6 },
    { x: -6, y: 8 },
  ],
  [
    { x: 7, y: 8 },
    { x: -8, y: -7 },
    { x: 9, y: 6 },
  ],
  [
    { x: -6, y: -8 },
    { x: 8, y: 7 },
    { x: -7, y: -6 },
  ],
  [
    { x: 8, y: 6 },
    { x: -7, y: 8 },
    { x: -8, y: -7 },
  ],
] as const;

function sphereOffsetStyle(index: number, sphere: number): CSSProperties {
  const offset = sphereOffsets[index]?.[sphere] ?? { x: 0, y: 0 };

  return {
    "--sphere-x": `${offset.x}px`,
    "--sphere-y": `${offset.y}px`,
  } as CSSProperties;
}

export function ServicesGlassShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [motionPreferenceReady, setMotionPreferenceReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = () => {
      setReducedMotion(mediaQuery.matches);
      setMotionPreferenceReady(true);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (!motionPreferenceReady || reducedMotion || hasInteracted || window.matchMedia("(max-width: 699px)").matches) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % services.length);
    }, AUTO_ADVANCE_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeIndex, hasInteracted, motionPreferenceReady, reducedMotion]);

  const selectService = (index: number, initiatedByUser = false) => {
    setActiveIndex(index);

    if (initiatedByUser) {
      setHasInteracted(true);
    }
  };

  const selectMobileService = (index: number) => {
    selectService(index, true);
    const carousel = mobileCarouselRef.current;
    const card = carousel?.children[index] as HTMLElement | undefined;
    if (carousel && card) {
      const inset = parseFloat(getComputedStyle(carousel).paddingLeft);
      carousel.scrollTo({ left: card.offsetLeft - carousel.offsetLeft - inset, behavior: reducedMotion ? "instant" : "smooth" });
    }
  };

  const handleMobileScroll = () => {
    const carousel = mobileCarouselRef.current;
    if (!carousel) return;
    const firstCard = carousel.firstElementChild as HTMLElement | null;
    if (!firstCard) return;
    const index = Math.round(carousel.scrollLeft / (firstCard.offsetWidth + 12));
    setActiveIndex(Math.min(services.length - 1, Math.max(0, index)));
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % services.length;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + services.length) % services.length;
    }

    if (event.key === "Home") {
      nextIndex = 0;
    }

    if (event.key === "End") {
      nextIndex = services.length - 1;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    selectService(nextIndex, true);
    tabRefs.current[nextIndex]?.focus({ preventScroll: true });
  };

  return (
    <section className={styles.servicesPage} aria-labelledby="services-heading">
      <Container className={styles.scene}>
        <div className={styles.mobileShowcase}>
          <p className={styles.mobileEyebrow}>Services</p>
          <h1 className={styles.mobileHeading}>Web design and development services.</h1>
          <p className="mt-2 mb-4 text-[15px] leading-[1.55] text-[#B8C9DE]">
            Everything you need to launch and grow online, from the first design to a live website.
          </p>
          <div ref={mobileCarouselRef} className={styles.mobileCarousel} onScroll={handleMobileScroll} aria-label="Services carousel">
            {services.map(([number, title, description, why, chip]) => (
              <article key={number} className={styles.mobileCard}>
                <div className="flex items-center justify-between gap-2">
                  <p className={styles.mobileNumber}>{number} / 0{services.length}</p>
                  {chip ? (
                    <span className="inline-flex items-center rounded-full border border-[rgba(143,176,214,0.3)] bg-[rgba(143,176,214,0.14)] px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-[#B8C9DE]">
                      {chip}
                    </span>
                  ) : null}
                </div>
                <h2>{title}</h2>
                <p className={styles.mobileDescription}>{description}</p>
                <div className={styles.mobileDivider} />
                <p className={styles.mobileWhyLabel}>Why it matters</p>
                <p className={styles.mobileWhyText}>{why}</p>
                {number === "07" && (
                  <div className="mt-6 pt-1">
                    <Link href="/contact?service=ai-integration" className="btn-glass">
                      <span className="btn-glass__sheen" aria-hidden="true" />
                      <span className="btn-glass__label">Ask about AI integration</span>
                      <svg
                        className="btn-glass__arrow"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </Link>
                  </div>
                )}
                {number === "08" && (
                  <div className="mt-6 pt-1">
                    <Link href="/services/social-media" className="btn-glass">
                      <span className="btn-glass__sheen" aria-hidden="true" />
                      <span className="btn-glass__label">View plans</span>
                      <svg
                        className="btn-glass__arrow"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </Link>
                  </div>
                )}
              </article>
            ))}
          </div>
          <div className={styles.mobileDots} aria-label="Choose a service">
            {services.map(([, title], index) => (
              <button key={title} type="button" aria-label={`Show ${title}`} aria-pressed={activeIndex === index} onClick={() => selectMobileService(index)}>
                <span data-active={activeIndex === index} />
              </button>
            ))}
          </div>
        </div>
        <div
          aria-hidden="true"
          className={`${styles.sphere} ${styles.sphereTop}`}
          style={sphereOffsetStyle(activeIndex, 0)}
        >
          <div className={styles.sphereVisual} />
        </div>
        <div
          aria-hidden="true"
          className={`${styles.sphere} ${styles.sphereRight}`}
          style={sphereOffsetStyle(activeIndex, 1)}
        >
          <div className={styles.sphereVisual} />
        </div>
        <div
          aria-hidden="true"
          className={`${styles.sphere} ${styles.sphereBottom}`}
          style={sphereOffsetStyle(activeIndex, 2)}
        >
          <div className={styles.sphereVisual} />
        </div>

        <div className={styles.glassSlab}>
          <div className={styles.slabContent}>
            <div className={styles.navigationColumn}>
              <p className={styles.eyebrow}>Services</p>
              <h1 id="services-heading" className={styles.heading}>
                Web design and development services.
              </h1>
              <p className="mt-2 mb-5 max-w-[34ch] text-[15px] leading-[1.6] text-[#B8C9DE]">
                Everything you need to launch and grow online, from the first design to a live website.
              </p>

              <div className={styles.serviceTabs} role="tablist" aria-label="Services">
                {services.map(([number, title, , , chip], index) => {
                  const isActive = activeIndex === index;

                  return (
                    <button
                      key={number}
                      ref={(element) => {
                        tabRefs.current[index] = element;
                      }}
                      type="button"
                      id={`service-tab-${number}`}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`service-panel-${number}`}
                      tabIndex={isActive ? 0 : -1}
                      data-active={isActive}
                      className={styles.serviceTab}
                      onClick={() => selectService(index, true)}
                      onKeyDown={(event) => handleTabKeyDown(event, index)}
                    >
                      <span className={styles.serviceNumber}>{number}</span>
                      <span className={styles.serviceTitle}>{title}</span>
                      {chip ? (
                        <span className="ml-auto inline-flex items-center rounded-full border border-[rgba(143,176,214,0.3)] bg-[rgba(143,176,214,0.14)] px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#B8C9DE]">
                          {chip}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.detailColumn}>
              <div className={styles.panelStack}>
                {services.map(([number, title, description, why, chip], index) => {
                  const isActive = activeIndex === index;

                  return (
                    <article
                      key={number}
                      id={`service-panel-${number}`}
                      role="tabpanel"
                      aria-labelledby={`service-tab-${number}`}
                      aria-hidden={!isActive}
                      tabIndex={isActive ? 0 : -1}
                      data-active={isActive}
                      className={styles.detailPanel}
                    >
                      <div className="flex items-center gap-3">
                        <p className={styles.detailNumber}>{number}</p>
                        {chip ? (
                          <span className="inline-flex items-center rounded-full border border-[rgba(143,176,214,0.3)] bg-[rgba(143,176,214,0.14)] px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-[#B8C9DE]">
                            {chip}
                          </span>
                        ) : null}
                      </div>
                      <h2 className={styles.detailTitle}>{title}</h2>
                      <p className={styles.description}>{description}</p>
                      <div className={styles.divider} aria-hidden="true" />
                      <p className={styles.whyLabel}>Why it matters</p>
                      <p className={styles.whyText}>{why}</p>
                      {number === "07" && (
                        <div className="mt-8 pt-1">
                          <Link href="/contact?service=ai-integration" className="btn-glass">
                            <span className="btn-glass__sheen" aria-hidden="true" />
                            <span className="btn-glass__label">Ask about AI integration</span>
                            <svg
                              className="btn-glass__arrow"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="7" y1="17" x2="17" y2="7" />
                              <polyline points="7 7 17 7 17 17" />
                            </svg>
                          </Link>
                        </div>
                      )}
                      {number === "08" && (
                        <div className="mt-8 pt-1">
                          <Link href="/services/social-media" className="btn-glass">
                            <span className="btn-glass__sheen" aria-hidden="true" />
                            <span className="btn-glass__label">View plans</span>
                            <svg
                              className="btn-glass__arrow"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="7" y1="17" x2="17" y2="7" />
                              <polyline points="7 7 17 7 17 17" />
                            </svg>
                          </Link>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.dotControls} aria-label="Choose a service">
            {services.map(([number, title], index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={number}
                  type="button"
                  className={styles.dot}
                  data-active={isActive}
                  aria-label={`Show ${title}`}
                  aria-controls={`service-panel-${number}`}
                  aria-pressed={isActive}
                  onClick={() => selectService(index, true)}
                />
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
