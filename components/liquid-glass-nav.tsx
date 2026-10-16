"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import {
  Home,
  Briefcase,
  Sparkles,
  User,
  Mail,
  type LucideIcon,
} from "lucide-react";

/* ========================================================================
   3 TWEAKABLE VARIABLES (as requested)
   Adjust these to fine-tune blur strength, lens size, and spring physics.
   ======================================================================== */
export const BLUR_STRENGTH = 18;      // px — backdrop blur strength on the glass bar (e.g. 12 - 24)
export const LENS_SIZE = 1.0;         // multiplier — lens width matches active tab width (1.0 = exact)
export const SPRING_STIFFNESS = 300;  // spring physics stiffness for slide & snap (e.g. 200 - 450)

/* Internal motion constants */
const SPRING_DAMPING = 24;            // critical damping to allow slight liquid overshoot
const MAGNIFICATION = 1.12;           // convex magnification scale factor (1.12x on wrapper)
const DRAG_STRETCH_MAX = 1.2;         // maximum squash/stretch along drag velocity axis
const HAPTIC_MS = 8;                  // duration in ms for tab-switch haptic tick
const SCROLL_COMPRESS = 0.96;         // scale factor when user scrolls page
const LENS_INSET = 6;                 // px — lens boundary inset from bar top/bottom

export interface TabItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const DEFAULT_TABS: TabItem[] = [
  { label: "Home",     href: "/",         icon: Home },
  { label: "Work",     href: "/work",     icon: Briefcase },
  { label: "Services", href: "/services", icon: Sparkles },
  { label: "About",    href: "/about",    icon: User },
  { label: "Contact",  href: "/contact",  icon: Mail },
];

export interface LiquidGlassNavProps {
  items?: readonly TabItem[] | TabItem[];
  active?: number;
  onChange?: (index: number) => void;
}

/* ── 1. useMediaQuery Hook (<= 768px only) ────────────────────────────── */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/* ── Route matching helper ────────────────────────────────────────────── */
function getActiveFromPath(path: string, items: readonly TabItem[]): number {
  const exact = items.findIndex((t) => t.href === path);
  if (exact !== -1) return exact;
  const prefix = items.findIndex(
    (t) => t.href !== "/" && path.startsWith(t.href)
  );
  if (prefix !== -1) return prefix;
  return 0;
}

/* ── Haptic feedback helper ───────────────────────────────────────────── */
function triggerHaptic() {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(HAPTIC_MS);
    }
  } catch {
    /* Ignore on browsers without vibration */
  }
}

interface Geometry {
  barWidth: number;
  barHeight: number;
  tabLeft: number;
  tabWidth: number;
}

/**
 * iOS 26 Liquid Glass Mobile Bottom Navigation Bar
 * Updates:
 * 1. Mobile only: unmounts when viewport > 768px via useMediaQuery & CSS query.
 *    Max-width 480px, centered at bottom with safe-area padding.
 * 2. JS measurement via getBoundingClientRect() of bar and active tab:
 *    - Lens width = tab.width, translateX = tab.left - bar.left
 *    - Clone row width = bar.width, translateX = -(tab.left - bar.left)
 *    - Recalculates on mount, resize, and tab change
 *    - Real active tab is hidden (opacity: 0) to eliminate doubling
 *    - Magnification scale(1.12) applied on centered wrapper inside lens
 */
export function LiquidGlassNav({
  items = DEFAULT_TABS,
  active,
  onChange,
}: LiquidGlassNavProps = {}) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  const tabList = items;
  const tabCount = tabList.length;

  const routeActiveIndex = getActiveFromPath(pathname, tabList);
  const currentActiveIndex = active !== undefined ? active : routeActiveIndex;

  /* ── DOM refs ───────────────────────────────────────────────────────── */
  const barRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const prevActiveRef = useRef<number>(currentActiveIndex);

  /* ── 2. JS Measurement via getBoundingClientRect ────────────────────── */
  const [geometry, setGeometry] = useState<Geometry>({
    barWidth: 0,
    barHeight: 72,
    tabLeft: 0,
    tabWidth: 0,
  });

  const measure = useCallback(() => {
    if (!barRef.current) return;
    const barRect = barRef.current.getBoundingClientRect();
    const activeTabEl = tabRefs.current[currentActiveIndex];

    if (!activeTabEl) {
      setGeometry((prev) => ({
        ...prev,
        barWidth: barRect.width,
        barHeight: barRect.height || 72,
      }));
      return;
    }

    const tabRect = activeTabEl.getBoundingClientRect();
    setGeometry({
      barWidth: barRect.width,
      barHeight: barRect.height || 72,
      tabLeft: tabRect.left - barRect.left,
      tabWidth: tabRect.width,
    });
  }, [currentActiveIndex]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Recalculate on mount, resize, fonts ready, and tab change
  useEffect(() => {
    if (!mounted || !isMobile) return;
    measure();
    window.addEventListener("resize", measure);
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(measure);
    }
    return () => window.removeEventListener("resize", measure);
  }, [mounted, isMobile, measure]);

  /* ── Spring-driven lens position & clone offset ──────────────────────── */
  const springConfig = prefersReducedMotion
    ? { stiffness: 900, damping: 50, mass: 0.5 }
    : { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING, mass: 1 };

  const rawLensX = useMotionValue(geometry.tabLeft);
  const rawLensW = useMotionValue(geometry.tabWidth || 64);

  const lensX = useSpring(rawLensX, springConfig);
  const lensW = useSpring(rawLensW, springConfig);

  // Clone row translateX = -(tab.left - bar.left)
  const cloneX = useTransform(lensX, (val) => -val);

  // Velocity-driven squash & stretch along X
  const dragVelocity = useMotionValue(0);
  const stretchX = useTransform(
    dragVelocity,
    [-1500, 0, 1500],
    prefersReducedMotion ? [1, 1, 1] : [DRAG_STRETCH_MAX, 1, DRAG_STRETCH_MAX]
  );
  const squashY = useTransform(stretchX, (s) => (prefersReducedMotion ? 1 : 2 - s));

  // Sync lens to measured geometry on active tab change
  useEffect(() => {
    if (geometry.tabWidth > 0) {
      rawLensX.set(geometry.tabLeft);
      rawLensW.set(geometry.tabWidth);
      if (prevActiveRef.current !== currentActiveIndex) {
        triggerHaptic();
        prevActiveRef.current = currentActiveIndex;
      }
    }
  }, [geometry, currentActiveIndex, rawLensX, rawLensW]);

  /* ── Page scroll compression ────────────────────────────────────────── */
  const [scrolling, setScrolling] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(true);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setScrolling(false), 220);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  /* ── Long press & Drag interaction ──────────────────────────────────── */
  const [isPressHolding, setIsPressHolding] = useState(false);
  const [liveHoverIdx, setLiveHoverIdx] = useState<number | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHold = () => {
    holdTimerRef.current = setTimeout(() => setIsPressHolding(true), 280);
  };
  const cancelHold = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    setIsPressHolding(false);
  };

  const findNearestTab = useCallback(
    (currentCenter: number) => {
      let closest = 0;
      let minDiff = Infinity;
      tabRefs.current.forEach((el, i) => {
        if (!el || !barRef.current) return;
        const bRect = barRef.current.getBoundingClientRect();
        const tRect = el.getBoundingClientRect();
        const tabCenter = tRect.left - bRect.left + tRect.width / 2;
        const diff = Math.abs(tabCenter - currentCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      });
      return closest;
    },
    []
  );

  const handlePanStart = () => {
    startHold();
  };

  const handlePan = (_: unknown, info: PanInfo) => {
    dragVelocity.set(info.velocity.x);
    const curr = lensX.get();

    const minBound = LENS_INSET;
    const maxBound = Math.max(LENS_INSET, geometry.barWidth - geometry.tabWidth - LENS_INSET);
    let nextX = curr + info.delta.x;
    if (nextX < minBound) nextX = minBound + (nextX - minBound) * 0.28;
    if (nextX > maxBound) nextX = maxBound + (nextX - maxBound) * 0.28;
    rawLensX.set(nextX);

    const nearest = findNearestTab(nextX + geometry.tabWidth / 2);
    if (nearest !== liveHoverIdx) {
      setLiveHoverIdx(nearest);
      triggerHaptic();
    }
  };

  const handlePanEnd = () => {
    cancelHold();
    dragVelocity.set(0);

    const currentX = rawLensX.get();
    const nearest = findNearestTab(currentX + geometry.tabWidth / 2);
    setLiveHoverIdx(null);

    if (nearest !== currentActiveIndex) {
      triggerHaptic();
      onChange?.(nearest);
      const targetAnchor = tabRefs.current[nearest];
      if (targetAnchor) {
        targetAnchor.click();
      }
    } else {
      rawLensX.set(geometry.tabLeft);
    }
  };

  /* ── Keyboard arrow-key navigation ──────────────────────────────────── */
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    let next = currentActiveIndex;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next = (currentActiveIndex + 1) % tabCount;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      next = (currentActiveIndex - 1 + tabCount) % tabCount;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = tabCount - 1;
    }
    if (next !== currentActiveIndex) {
      onChange?.(next);
      const el = tabRefs.current[next];
      if (el) {
        el.focus();
        el.click();
      }
    }
  };

  const handleTabClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    idx: number,
    href: string
  ) => {
    onChange?.(idx);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    if (pathname === href) {
      e.preventDefault();
    }
  };

  // 1. Mobile only: unmount if viewport > 768px or not mounted yet
  if (!mounted || !isMobile) {
    return null;
  }

  const currentBarScale = scrolling && !prefersReducedMotion ? SCROLL_COMPRESS : 1;
  const currentBarBlur = scrolling ? BLUR_STRENGTH + 8 : BLUR_STRENGTH;

  return (
    <>
      {/* ── Inline SVG Refraction Filter (Chromium) ─────────────────── */}
      <svg
        aria-hidden="true"
        className="sr-only"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
      >
        <defs>
          <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="2"
              seed="5"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
            <feBlend in="SourceGraphic" in2="blurred" mode="normal" />
          </filter>
        </defs>
      </svg>

      {/* ── 1. The Floating Glass Bar (max-width 480px, centered, fixed at bottom) */}
      <motion.nav
        ref={barRef}
        role="tablist"
        aria-label="Mobile Navigation"
        onKeyDown={handleKeyDown}
        animate={{
          scale: currentBarScale,
          backdropFilter: `blur(${currentBarBlur}px) saturate(180%) brightness(1.1)`,
        }}
        transition={
          prefersReducedMotion
            ? { duration: 0.1 }
            : { type: "spring", stiffness: 450, damping: 32 }
        }
        className="liquid-mobile-bar"
      >
        {/* ── 2. Lens: width = tab width, translateX = tab.left - bar.left ── */}
        <motion.div
          className="liquid-mobile-lens"
          style={{
            x: lensX,
            width: lensW,
            scaleX: stretchX,
            scaleY: squashY,
          }}
          animate={{
            scale: isPressHolding ? 1.25 : 1,
            opacity: isPressHolding ? 0.95 : 1,
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0.1 }
              : { type: "spring", stiffness: 400, damping: 24 }
          }
          onPanStart={handlePanStart}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerCancel={cancelHold}
          aria-hidden="true"
        >
          {/* Specular top rim light */}
          <div className="liquid-mobile-lens__rim" aria-hidden="true" />

          {/* Magnification wrapper (scale 1.12) centered around lens center */}
          <div
            className="liquid-mobile-lens__mag-wrapper"
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              borderRadius: 999,
              transformOrigin: "center center",
              transform: `scale(${MAGNIFICATION})`,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            {/* Clone row: width = bar width, translateX = -(tab.left - bar.left) */}
            <motion.div
              className="liquid-mobile-lens__clone-row"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: geometry.barWidth > 0 ? geometry.barWidth : "100%",
                height: geometry.barHeight > 0 ? geometry.barHeight : 72,
                x: cloneX,
                y: -LENS_INSET,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                padding: "6px 4px",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            >
              {tabList.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="liquid-mobile-tab liquid-mobile-tab--mag"
                    aria-hidden="true"
                  >
                    <span className="liquid-mobile-tab__icon">
                      <Icon size={20} strokeWidth={2.4} />
                    </span>
                    <span className="liquid-mobile-tab__label">{item.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>

        {/* ── Base Tab Items (Underneath lens) ─────────────────────────── */}
        {tabList.map((item, idx) => {
          const Icon = item.icon;
          const isActive = idx === currentActiveIndex;
          const isHighlighted = idx === liveHoverIdx;
          return (
            <Link
              key={item.label}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              href={item.href}
              prefetch={true}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              aria-selected={isActive}
              aria-label={item.label}
              onClick={(e) => handleTabClick(e, idx, item.href)}
              data-active={isActive}
              data-highlight={isHighlighted}
              style={{
                /* Hide the real active tab (opacity 0) so only the lens copy shows */
                opacity: isActive ? 0 : 1,
                transition: "opacity 0.15s ease",
              }}
              className={`liquid-mobile-tab ${
                isActive || isHighlighted
                  ? "liquid-mobile-tab--active"
                  : "liquid-mobile-tab--inactive"
              }`}
            >
              <span className="liquid-mobile-tab__icon">
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              </span>
              <span className="liquid-mobile-tab__label">
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.nav>
    </>
  );
}

export default LiquidGlassNav;
