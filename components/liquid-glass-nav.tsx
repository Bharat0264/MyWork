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
export const LENS_SIZE = 1.35;        // multiplier — lens width relative to individual tab width (~1.1 - 1.5)
export const SPRING_STIFFNESS = 300;  // spring physics stiffness for slide & snap (e.g. 200 - 450)

/* Internal motion constants */
const SPRING_DAMPING = 24;            // critical damping to allow slight liquid overshoot
const MAGNIFICATION = 1.15;           // convex magnification scale factor under lens
const DRAG_STRETCH_MAX = 1.2;         // maximum squash/stretch along drag velocity axis
const HAPTIC_MS = 8;                  // duration in ms for tab-switch haptic tick
const SCROLL_COMPRESS = 0.96;         // scale factor when user scrolls page

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
    /* Ignore on browsers that disallow vibrate without user gesture */
  }
}

/**
 * iOS 26 Liquid Glass Mobile Bottom Navigation Bar
 * Features:
 * - Floating glass pill with 1px gradient border & deep shadow
 * - Draggable magnifying glass lens with refraction & specular rim
 * - Spring physics slide, squash & stretch, rubber-band resistance
 * - Duplicated clipped tab row creating true optical magnification (~1.15x)
 * - Page scroll compression (scale 0.96) and blur intensification
 * - Full accessibility: role="tablist", role="tab", aria-selected, arrow navigation, reduced motion
 */
export function LiquidGlassNav({
  items = DEFAULT_TABS,
  active,
  onChange,
}: LiquidGlassNavProps = {}) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const tabList = items;
  const tabCount = tabList.length;

  const routeActiveIndex = getActiveFromPath(pathname, tabList);
  const currentActiveIndex = active !== undefined ? active : routeActiveIndex;

  /* ── DOM & Measurement refs ─────────────────────────────────────────── */
  const barRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const prevActiveRef = useRef<number>(currentActiveIndex);

  const [tabMeta, setTabMeta] = useState<{ cx: number; w: number }[]>([]);
  const [barWidth, setBarWidth] = useState(0);

  const measure = useCallback(() => {
    if (!barRef.current) return;
    const barRect = barRef.current.getBoundingClientRect();
    setBarWidth(barRect.width);
    const meta = tabRefs.current.map((el) => {
      if (!el) return { cx: 0, w: 0 };
      const r = el.getBoundingClientRect();
      return {
        cx: r.left - barRect.left + r.width / 2,
        w: r.width,
      };
    });
    setTabMeta(meta);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(measure);
    }
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /* ── Dynamic lens width ─────────────────────────────────────────────── */
  const avgTabW = tabMeta.length > 0
    ? tabMeta.reduce((sum, t) => sum + t.w, 0) / tabMeta.length
    : 64;
  const baseLensW = Math.max(54, avgTabW * LENS_SIZE);

  /* ── Spring-driven lens motion ──────────────────────────────────────── */
  const targetCx = tabMeta[currentActiveIndex]?.cx ?? (barWidth > 0 ? barWidth / 2 : 50);
  const rawX = useMotionValue(targetCx);

  const springConfig = prefersReducedMotion
    ? { stiffness: 900, damping: 50, mass: 0.5 }
    : { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING, mass: 1 };
  const lensX = useSpring(rawX, springConfig);

  // Velocity-driven squash & stretch along X
  const dragVelocity = useMotionValue(0);
  const stretchX = useTransform(
    dragVelocity,
    [-1500, 0, 1500],
    prefersReducedMotion ? [1, 1, 1] : [DRAG_STRETCH_MAX, 1, DRAG_STRETCH_MAX]
  );
  const squashY = useTransform(stretchX, (s) => (prefersReducedMotion ? 1 : 2 - s));

  // Sync lens to active tab
  useEffect(() => {
    if (tabMeta.length === 0) return;
    const cx = tabMeta[currentActiveIndex]?.cx;
    if (cx !== undefined) {
      rawX.set(cx);
      if (prevActiveRef.current !== currentActiveIndex) {
        triggerHaptic();
        prevActiveRef.current = currentActiveIndex;
      }
    }
  }, [currentActiveIndex, tabMeta, rawX]);

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

  /* ── Long press / Drag interaction ──────────────────────────────────── */
  const [isPressHolding, setIsPressHolding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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
    (x: number) => {
      if (tabMeta.length === 0) return 0;
      let closest = 0;
      let minDiff = Infinity;
      tabMeta.forEach((t, i) => {
        const diff = Math.abs(t.cx - x);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      });
      return closest;
    },
    [tabMeta]
  );

  const handleDragStart = () => {
    setIsDragging(true);
    startHold();
  };

  const handleDrag = (_: unknown, info: PanInfo) => {
    dragVelocity.set(info.velocity.x);
    const curr = lensX.get();

    // Rubber-band resistance at boundary edges
    const minBound = tabMeta[0]?.cx ?? 0;
    const maxBound = tabMeta[tabCount - 1]?.cx ?? barWidth;
    let nextX = curr + info.delta.x;
    if (nextX < minBound) nextX = minBound + (nextX - minBound) * 0.28;
    if (nextX > maxBound) nextX = maxBound + (nextX - maxBound) * 0.28;
    rawX.set(nextX);

    // Live highlight as lens sweeps past tabs
    const nearest = findNearestTab(nextX);
    if (nearest !== liveHoverIdx) {
      setLiveHoverIdx(nearest);
      triggerHaptic();
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    cancelHold();
    dragVelocity.set(0);

    const currentX = rawX.get();
    const nearest = findNearestTab(currentX);
    const snapTarget = tabMeta[nearest]?.cx ?? 0;
    rawX.set(snapTarget);
    setLiveHoverIdx(null);

    if (nearest !== currentActiveIndex) {
      triggerHaptic();
      onChange?.(nearest);
      const targetAnchor = tabRefs.current[nearest];
      if (targetAnchor) {
        targetAnchor.click();
      }
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
    if (isDragging) {
      e.preventDefault();
      return;
    }
    onChange?.(idx);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    if (pathname === href) {
      e.preventDefault();
    }
  };

  /* ── Derived lens positions ─────────────────────────────────────────── */
  const lensLeft = useTransform(lensX, (cx) => cx - baseLensW / 2);
  const currentBarScale = scrolling && !prefersReducedMotion ? SCROLL_COMPRESS : 1;
  const currentBarBlur = scrolling ? BLUR_STRENGTH + 8 : BLUR_STRENGTH;

  return (
    <>
      {/* ── Inline SVG Refraction & Chromatic Aberration Filters ─────── */}
      <svg
        aria-hidden="true"
        className="sr-only"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
      >
        <defs>
          {/* Liquid Glass Refraction Filter (Chromium) */}
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

      {/* ── The Floating Glass Bar ───────────────────────────────────── */}
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
        className="liquid-mobile-bar min-[1024px]:hidden"
      >
        {/* ── Active Lens Indicator (Draggable Glass Pill) ────────────── */}
        <motion.div
          className="liquid-mobile-lens"
          style={{
            left: lensLeft,
            width: baseLensW,
            scaleX: stretchX,
            scaleY: squashY,
          }}
          animate={{
            scale: isPressHolding ? 1.25 : 1,
            opacity: isPressHolding ? 0.92 : 1,
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0.1 }
              : { type: "spring", stiffness: 400, damping: 24 }
          }
          drag="x"
          dragConstraints={barRef}
          dragElastic={0.16}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerCancel={cancelHold}
          aria-hidden="true"
        >
          {/* Top specular rim light reflection */}
          <div className="liquid-mobile-lens__rim" aria-hidden="true" />

          {/* Optical Magnification Layer (~1.15x scaled duplicate clipped to lens) */}
          <div className="liquid-mobile-lens__magnify" aria-hidden="true">
            <motion.div
              className="liquid-mobile-lens__inner"
              style={{
                x: useTransform(lensLeft, (ll) => -ll),
                width: barWidth > 0 ? barWidth : "100%",
                transformOrigin: useTransform(lensX, (cx) => `${cx}px center`),
                scale: MAGNIFICATION,
              }}
            >
              {tabList.map((item, idx) => {
                const Icon = item.icon;
                const meta = tabMeta[idx];
                return (
                  <div
                    key={item.label}
                    className="liquid-mobile-tab liquid-mobile-tab--mag"
                    style={{
                      position: "absolute",
                      left: meta ? meta.cx - meta.w / 2 : `${(idx / tabCount) * 100}%`,
                      width: meta ? meta.w : `${100 / tabCount}%`,
                    }}
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

        {/* ── Base Tab Items (Underneath the lens) ────────────────────── */}
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
              className={`liquid-mobile-tab ${
                isActive || isHighlighted
                  ? "liquid-mobile-tab--active"
                  : "liquid-mobile-tab--inactive"
              }`}
            >
              <motion.span
                className="liquid-mobile-tab__icon"
                animate={{
                  y: isActive && !prefersReducedMotion ? -3 : 0,
                  scale: isActive ? 1.08 : 1,
                }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.1 }
                    : { type: "spring", stiffness: 500, damping: 22 }
                }
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              </motion.span>
              <motion.span
                className="liquid-mobile-tab__label"
                animate={{
                  y: isActive && !prefersReducedMotion ? -1 : 0,
                  fontWeight: isActive ? 700 : 500,
                }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.1 }
                    : { type: "spring", stiffness: 500, damping: 22 }
                }
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </motion.nav>
    </>
  );
}

export default LiquidGlassNav;
