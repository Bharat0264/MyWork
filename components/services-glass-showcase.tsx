"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { StartProjectButton } from "@/components/cta-button";
import { services } from "@/data/services";
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
] as const;

function sphereOffsetStyle(index: number, sphere: number): CSSProperties {
  const offset = sphereOffsets[index][sphere];

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
    if (!motionPreferenceReady || reducedMotion || hasInteracted) {
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
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section className={styles.servicesPage} aria-labelledby="services-heading">
      <div className={styles.scene}>
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
                A sharper digital presence starts here.
              </h1>

              <div className={styles.serviceTabs} role="tablist" aria-label="Services">
                {services.map(([number, title], index) => {
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
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.detailColumn}>
              <div className={styles.panelStack}>
                {services.map(([number, title, description, why], index) => {
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
                      <p className={styles.detailNumber}>{number}</p>
                      <h2 className={styles.detailTitle}>{title}</h2>
                      <p className={styles.description}>{description}</p>
                      <div className={styles.divider} aria-hidden="true" />
                      <p className={styles.whyLabel}>Why it matters</p>
                      <p className={styles.whyText}>{why}</p>
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

        <section className={styles.projectCta} aria-label="Start a project">
          <p>Have an idea? Let&apos;s turn it into something people love using.</p>
          <StartProjectButton />
        </section>
      </div>
    </section>
  );
}

