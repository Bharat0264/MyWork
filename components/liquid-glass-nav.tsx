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
   TWEAKABLE VARIABLES (iOS 26 Liquid Glass)
   ======================================================================== */
export const BLUR_STRENGTH = 18;      // px — backdrop blur strength on the glass bar
export const SPRING_STIFFNESS = 260;  // spring stiffness for slide & snap (260)
export const SPRING_DAMPING = 26;     // damping (26)
export const SPRING_MASS = 1;         // mass (1)

/* Internal motion constants */
const DRAG_STRETCH_MAX = 1.1;         // stretch X by up to 1.1 based on velocity
const HAPTIC_MS = 8;                  // duration in ms for tab-switch haptic tick
const SCROLL_COMPRESS = 0.96;         // scale factor when user scrolls page
const LENS_EDGE_GAP = 5;              // 5px gap from bar edges

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
  lensLeft: number;
  lensWidth: number;
}

/**
 * iOS 26 Liquid Glass Mobile Bottom Navigation Bar
 * - Soft, translucent clear glass capsule indicator (true capsule: border-radius 9999px)
 * - 5px gap top/bottom, active tab width - 8px, 5px gap clamped from bar edges
 * - Free fluid spring motion (stiffness 260, damping 26, mass 1)
 * - Scale 1.06 on press with clear glass transition
 * - Velocity-based X-stretch up to 1.1 during drag
 * - Active icon (22px) and label (11px, weight 500) perfectly centered
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

  /* ── JS Measurement via getBoundingClientRect ─────────────────────── */
  const [geometry, setGeometry] = useState<Geometry>({
    barWidth: 0,
    barHeight: 72,
    lensLeft: 5,
    lensWidth: 0,
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
    // Lens width = active tab width - 8px, centered on tab (+4px)
    const targetW = Math.max(0, tabRect.width - 8);
    const rawX = tabRect.left - barRect.left + 4;
    // Keep 5px gap from bar's left and right edges, clamp inside bar
    const minX = LENS_EDGE_GAP;
    const maxX = Math.max(minX, barRect.width - targetW - LENS_EDGE_GAP);
    const clampedX = Math.max(minX, Math.min(maxX, rawX));

    setGeometry({
      barWidth: barRect.width,
      barHeight: barRect.height || 72,
      lensLeft: clampedX,
      lensWidth: targetW,
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

  /* ── Spring-driven lens position ────────────────────────────────────── */
  const springConfig = prefersReducedMotion
    ? { stiffness: 900, damping: 50, mass: 0.5 }
    : { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING, mass: SPRING_MASS };

  const rawLensX = useMotionValue(geometry.lensLeft);
  const rawLensW = useMotionValue(geometry.lensWidth || 64);

  const lensX = useSpring(rawLensX, springConfig);
  const lensW = useSpring(rawLensW, springConfig);

  // Velocity-driven squash & stretch along X: stretch up to 1.1 based on velocity
  const dragVelocity = useMotionValue(0);
  const stretchX = useTransform(
    dragVelocity,
    [-1500, 0, 1500],
    prefersReducedMotion ? [1, 1, 1] : [DRAG_STRETCH_MAX, 1, DRAG_STRETCH_MAX]
  );
  const squashY = useTransform(stretchX, (s) => (prefersReducedMotion ? 1 : 1 / s));

  // Sync lens to measured geometry on active tab change
  useEffect(() => {
    if (geometry.lensWidth > 0) {
      rawLensX.set(geometry.lensLeft);
      rawLensW.set(geometry.lensWidth);
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

    // Keep 5px gap from bar's left and right edges, clamp inside bar
    const minBound = LENS_EDGE_GAP;
    const maxBound = Math.max(
      LENS_EDGE_GAP,
      geometry.barWidth - geometry.lensWidth - LENS_EDGE_GAP
    );
    let nextX = curr + info.delta.x;
    if (nextX < minBound) nextX = minBound + (nextX - minBound) * 0.25;
    if (nextX > maxBound) nextX = maxBound + (nextX - maxBound) * 0.25;
    rawLensX.set(nextX);

    const nearest = findNearestTab(nextX + geometry.lensWidth / 2);
    if (nearest !== liveHoverIdx) {
      setLiveHoverIdx(nearest);
      triggerHaptic();
    }
  };

  const handlePanEnd = () => {
    cancelHold();
    dragVelocity.set(0);

    const currentX = rawLensX.get();
    const nearest = findNearestTab(currentX + geometry.lensWidth / 2);
    setLiveHoverIdx(null);

    if (nearest !== currentActiveIndex) {
      triggerHaptic();
      onChange?.(nearest);
      const targetAnchor = tabRefs.current[nearest];
      if (targetAnchor) {
        targetAnchor.click();
      }
    } else {
      rawLensX.set(geometry.lensLeft);
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
    <motion.nav
      ref={barRef}
      role="tablist"
      aria-label="Mobile Navigation"
      onKeyDown={handleKeyDown}
      onPanStart={handlePanStart}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
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
      {/* ── Active-Tab Lens (iOS 26 Liquid Glass Capsule) ── */}
      <motion.div
        className={`liquid-mobile-lens ${isPressHolding ? "liquid-mobile-lens--pressed" : ""}`}
        style={{
          x: lensX,
          width: lensW,
          scaleX: stretchX,
          scaleY: squashY,
        }}
        animate={{
          scale: isPressHolding && !prefersReducedMotion ? 1.06 : 1,
        }}
        transition={
          prefersReducedMotion
            ? { duration: 0.1 }
            : {
                type: "spring",
                stiffness: SPRING_STIFFNESS,
                damping: SPRING_DAMPING,
                mass: SPRING_MASS,
              }
        }
        aria-hidden="true"
      >
        {/* Thin specular rim highlight along top edge only (subtle, not glowing) */}
        <div className="liquid-mobile-lens__rim" aria-hidden="true" />
      </motion.div>

      {/* ── Tab Items (Underneath & framed by lens, perfectly centered) ── */}
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
            onPointerDown={isActive ? startHold : undefined}
            onPointerUp={isActive ? cancelHold : undefined}
            onPointerCancel={isActive ? cancelHold : undefined}
            data-active={isActive}
            data-highlight={isHighlighted}
            className={`liquid-mobile-tab ${
              isActive || isHighlighted
                ? "liquid-mobile-tab--active"
                : "liquid-mobile-tab--inactive"
            }`}
          >
            <span className="liquid-mobile-tab__icon">
              <Icon size={22} strokeWidth={2} />
            </span>
            <span className="liquid-mobile-tab__label">
              {item.label}
            </span>
          </Link>
        );
      })}
    </motion.nav>
  );
}

export default LiquidGlassNav;
