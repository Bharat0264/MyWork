"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Home,
  Mail,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";

export const SPRING_STIFFNESS = 260;
export const SPRING_DAMPING = 26;

const LENS_EDGE_GAP = 5;
const LENS_SIDE_PADDING = 17;

export interface TabItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const DEFAULT_TABS: TabItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Work", href: "/work", icon: Briefcase },
  { label: "Services", href: "/services", icon: Sparkles },
  { label: "About", href: "/about", icon: User },
  { label: "Contact", href: "/contact", icon: Mail },
];

export interface LiquidGlassNavProps {
  items?: readonly TabItem[] | TabItem[];
  active?: number;
  onChange?: (index: number) => void;
}

interface LensGeometry {
  height: number;
  width: number;
  x: number;
}

function getActiveFromPath(pathname: string, items: readonly TabItem[]) {
  const exactMatch = items.findIndex((item) => item.href === pathname);
  if (exactMatch >= 0) return exactMatch;

  const prefixMatch = items.findIndex(
    (item) => item.href !== "/" && pathname.startsWith(item.href),
  );
  return prefixMatch >= 0 ? prefixMatch : 0;
}

function useMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export function LiquidGlassNav({
  items = DEFAULT_TABS,
  active,
  onChange,
}: LiquidGlassNavProps = {}) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMobileViewport();
  const barRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const currentActiveIndex = active ?? getActiveFromPath(pathname, items);
  const [geometry, setGeometry] = useState<LensGeometry>({
    height: 54,
    width: 0,
    x: LENS_EDGE_GAP,
  });

  const measure = useCallback(() => {
    const bar = barRef.current;
    const tab = tabRefs.current[currentActiveIndex];
    if (!bar || !tab) return;

    const label = tab.querySelector<HTMLElement>(".liquid-mobile-tab__label");
    const labelWidth = label?.getBoundingClientRect().width ?? 0;
    const barWidth = bar.offsetWidth;
    const edgeGap = Math.max(0, LENS_EDGE_GAP - bar.clientLeft);
    const maxLensWidth = Math.max(0, barWidth - LENS_EDGE_GAP * 2);
    const lensWidth = Math.min(
      maxLensWidth,
      Math.max(tab.offsetWidth - 6, labelWidth + LENS_SIDE_PADDING),
    );
    const rawX = tab.offsetLeft + (tab.offsetWidth - lensWidth) / 2;
    const x = Math.max(
      edgeGap,
      Math.min(rawX, bar.clientWidth - lensWidth - edgeGap),
    );

    setGeometry({
      height: Math.max(0, bar.offsetHeight - 10),
      width: lensWidth,
      x,
    });
  }, [currentActiveIndex]);

  useLayoutEffect(() => {
    if (!isMobile) return;

    const bar = barRef.current;
    if (!bar) return;

    const frame = window.requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    tabRefs.current.forEach((tab) => {
      if (tab) observer.observe(tab);
    });
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    void document.fonts?.ready.then(measure);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [isMobile, measure]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    let nextIndex = currentActiveIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentActiveIndex + 1) % items.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentActiveIndex - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    onChange?.(nextIndex);
    tabRefs.current[nextIndex]?.click();
  };

  const handleTabClick = (
    event: MouseEvent<HTMLAnchorElement>,
    index: number,
    href: string,
  ) => {
    onChange?.(index);
    if (pathname === href) event.preventDefault();
  };

  if (!isMobile) return null;

  return (
    <nav
      ref={barRef}
      role="tablist"
      aria-label="Mobile navigation"
      className="liquid-mobile-bar"
      onKeyDown={handleKeyDown}
    >
      <motion.div
        aria-hidden="true"
        className="liquid-mobile-lens"
        style={{ height: geometry.height, width: geometry.width }}
        animate={{ x: geometry.x }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING }
        }
      />

      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = index === currentActiveIndex;

        return (
          <Link
            key={item.href}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            href={item.href}
            prefetch
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            data-active={isActive}
            className="liquid-mobile-tab"
            onClick={(event) => handleTabClick(event, index, item.href)}
          >
            <span className="liquid-mobile-tab__icon" aria-hidden="true">
              <Icon size={22} strokeWidth={2} />
            </span>
            <span className="liquid-mobile-tab__label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default LiquidGlassNav;
