"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, ArrowUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { StartProjectButton } from "@/components/cta-button";
import { Container } from "@/components/container";
import { LiquidGlassNav } from "@/components/liquid-glass-nav";

export function SkipToContent() {
  return (
    <a href="#content" className="skip-link">
      Skip to content
    </a>
  );
}

const navItems = [
  { label: "Home", href: "/", id: "home" },
  { label: "Work", href: "/work", id: "work" },
  { label: "Services", href: "/services", id: "services" },
  { label: "About", href: "/about", id: "about" },
  { label: "Contact", href: "/contact", id: "contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  const getActiveFromPath = (path: string): number => {
    if (path === "/") return 0;
    if (path === "/work" || path.startsWith("/work/")) return 1;
    if (path === "/services" || path.startsWith("/services/")) return 2;
    if (path === "/about" || path.startsWith("/about/")) return 3;
    if (path === "/contact" || path.startsWith("/contact/")) return 4;
    return 0;
  };

  const activeSection = getActiveFromPath(pathname);
  const [hoverSection, setHoverSection] = useState<number | null>(null);

  // Stretch & press animation states
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  // Measurement references
  const desktopNavRef = useRef<HTMLElement>(null);
  const desktopItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const [desktopBubble, setDesktopBubble] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });

  const prevTargetRef = useRef<number | null>(null);
  const moveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Desktop bubble measurement & stretch movement
  const targetDesktopIndex = hoverSection !== null ? hoverSection : activeSection;

  useEffect(() => {
    const updateDesktopBubble = () => {
      if (targetDesktopIndex === null) {
        setDesktopBubble((prev) => ({ ...prev, ready: false }));
        return;
      }
      const el = desktopItemsRef.current[targetDesktopIndex];
      if (el) {
        setDesktopBubble({
          left: el.offsetLeft,
          width: el.offsetWidth,
          ready: true,
        });

        if (prevTargetRef.current !== targetDesktopIndex) {
          setIsMoving(true);
          if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
          moveTimerRef.current = setTimeout(() => {
            setIsMoving(false);
          }, 380);
          prevTargetRef.current = targetDesktopIndex;
        }
      }
    };

    updateDesktopBubble();
    window.addEventListener("resize", updateDesktopBubble);
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(updateDesktopBubble);
    }
    return () => {
      window.removeEventListener("resize", updateDesktopBubble);
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
    };
  }, [targetDesktopIndex]);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.location.hash) {
        window.history.replaceState(null, "", "/");
      }
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
    }, 200);

    window.scrollTo(0, 0);
    if (pathname === href) {
      e.preventDefault();
    }
  };

  return (
    <>
      {/* SVG Displacement Map for Optional Optical Lens Refraction */}
      <svg
        className="sr-only"
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
      >
        <defs>
          <filter id="lens-distortion">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* FIXED TOP HEADER */}
      <header className="fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] border-b border-[var(--border)] bg-[#0B1322]/85 backdrop-blur-md pt-[env(safe-area-inset-top)]">
        {/* DESKTOP (1024px and above) */}
        <Container className="hidden h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center min-[1024px]:grid">
          {/* Left: Garuda Logo Lockup */}
          <div className="flex min-w-0 items-center">
            <Link
              href="/"
              onClick={handleLogoClick}
              aria-label="Garuda Web Design & Development Studio"
              className="navbar-logo flex items-center shrink-0"
            >
              <picture>
                <source srcSet="/logo-full.webp" type="image/webp" />
                <img
                  src="/logo-full.png"
                  srcSet="/logo-full.png 1x, /logo-full.png 2x"
                  alt="Garuda Web Design & Development Studio"
                  width={191}
                  height={64}
                  loading="eager"
                  draggable={false}
                  className="h-[52px] w-auto max-w-full object-contain min-[1024px]:h-[64px]"
                />
              </picture>
              <span className="sr-only">Garuda Web Design & Development Studio</span>
            </Link>
          </div>

          {/* Center: Floating Glass Pill Nav */}
          <nav
            ref={desktopNavRef}
            onMouseLeave={() => setHoverSection(null)}
            aria-label="Main Navigation"
            className="liquid-glass-pill"
          >
            {/* Sliding Glass Bubble Lens */}
            <div
              className="liquid-glass-bubble"
              style={{
                left: `${desktopBubble.left}px`,
                width: `${desktopBubble.width}px`,
                opacity: desktopBubble.ready ? 1 : 0,
                transform: isPressed ? "scale(0.96)" : isMoving ? "scaleX(1.12)" : "scale(1)",
              }}
              aria-hidden="true"
            />
            {navItems.map((item, idx) => {
              const isActive = activeSection === idx;
              const isHovered = hoverSection === idx;
              return (
                <Link
                  key={item.label}
                  ref={(el) => {
                    desktopItemsRef.current[idx] = el;
                  }}
                  href={item.href}
                  prefetch={true}
                  aria-current={isActive ? "page" : undefined}
                  data-active={isActive || isHovered}
                  onMouseEnter={() => setHoverSection(idx)}
                  onFocus={() => setHoverSection(idx)}
                  onBlur={() => setHoverSection(null)}
                  onMouseDown={() => setIsPressed(true)}
                  onMouseUp={() => setIsPressed(false)}
                  onTouchStart={() => setIsPressed(true)}
                  onTouchEnd={() => setIsPressed(false)}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="liquid-nav-link"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: CTA Button */}
          <div className="flex min-w-0 items-center justify-end">
            <StartProjectButton variant="navbar" />
          </div>
        </Container>

        {/* MOBILE TOP BAR (below 1024px) */}
        <Container className="flex h-full items-center justify-between min-[1024px]:hidden">
          <Link
            href="/"
            onClick={handleLogoClick}
            aria-label="Garuda Web Design & Development Studio"
            className="navbar-logo flex items-center shrink-0"
          >
            <picture>
              <source srcSet="/logo-full.webp" type="image/webp" />
              <img
                src="/logo-full.png"
                srcSet="/logo-full.png 1x, /logo-full.png 2x"
                alt="Garuda Web Design & Development Studio"
                width={191}
                height={64}
                loading="eager"
                draggable={false}
                className="h-[46px] w-auto max-w-[200px] object-contain"
              />
            </picture>
            <span className="sr-only">Garuda Web Design & Development Studio</span>
          </Link>
          <div className="flex items-center gap-3">
            <StartProjectButton variant="navbar-mobile" />
          </div>
        </Container>
      </header>

      {/* MOBILE BOTTOM TAB BAR — iOS 26 Liquid Glass */}
      <LiquidGlassNav />
    </>
  );
}
const quickLinks = [
  ["Home", "/"],
  ["Work", "/work"],
  ["Services", "/services"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

const serviceLinks = [
  ["Website Design", "/services"],
  ["Website Development", "/services"],
  ["Redesign", "/services"],
  ["Landing Pages", "/services"],
  ["UI/UX Design", "/services"],
  ["AI Integration", "/services"],
  ["Social Media Management", "/services/social-media"],
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  return (
    <footer className="relative w-full border-t border-[rgba(143,176,214,0.16)] bg-gradient-to-b from-[#141E30] to-[#0B1322] pb-[calc(112px+env(safe-area-inset-bottom))] pt-12 min-[1024px]:pb-8 min-[1024px]:pt-16">
      <Container>
        <div className="relative w-full overflow-hidden rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-[#1B2B45]/90 p-5 shadow-[0_16px_40px_rgba(4,9,18,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] sm:rounded-[28px] sm:p-8 sm:supports-[backdrop-filter]:bg-[#1B2B45]/45 sm:backdrop-blur-[18px] lg:p-[40px_44px]">
        {/* FAINT WATERMARK */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 sm:-bottom-12 md:-bottom-16 lg:-bottom-20 left-1/2 -translate-x-1/2 select-none text-[clamp(110px,16vw,200px)] font-[800] tracking-[-0.02em] text-white/[0.025] leading-none whitespace-nowrap hidden sm:block"
        >
          GARUDA
        </div>

        {/* TOP ROW */}
        <div className="relative z-10 grid grid-cols-1 gap-6 text-left items-center justify-items-stretch sm:gap-10 sm:text-center sm:justify-items-center md:grid-cols-2 md:text-left md:items-start md:justify-items-start md:gap-x-10 md:gap-y-10 lg:grid-cols-[1.3fr_1.1fr_1.1fr] lg:gap-12">
          {/* Column 1: Brand (36%) */}
          <div className="flex flex-col items-start text-left sm:items-center sm:text-center md:items-start md:text-left md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-start-1">
            <Link
              href="/"
              aria-label="Garuda Web Design & Development Studio"
              className="inline-block shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <picture>
                <source srcSet="/logo-full.webp" type="image/webp" />
                <img
                  src="/logo-full.png"
                  srcSet="/logo-full.png 1x, /logo-full.png 2x"
                  alt="Garuda Web Design & Development Studio"
                  width={200}
                  height={67}
                  loading="lazy"
                  draggable={false}
                  className="w-[200px] h-auto shrink-0 select-none brightness-100 contrast-100"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                />
              </picture>
            </Link>
            <p className="mt-3 max-w-[340px] text-[15px] leading-[1.65] text-[#B8C9DE] sm:mt-4">
              Web design and development studio building fast, modern websites.
            </p>
          </div>

          {/* Column 2: Links (34%) */}
          <div className="w-full max-w-sm md:max-w-none md:col-span-2 md:row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
            <div className="space-y-1 sm:hidden">
              <details className="border-t border-white/10 py-1 group">
                <summary className="flex min-h-11 cursor-pointer items-center justify-between text-[14px] font-semibold uppercase tracking-[0.12em] text-[#B8D4F2]">Quick Links <span aria-hidden="true" className="text-lg group-open:rotate-45 transition-transform">+</span></summary>
                <nav aria-label="Mobile footer quick links" className="grid grid-cols-2 gap-2 pb-3">{quickLinks.map(([label, href]) => <Link key={label} href={href} className="flex min-h-11 items-center text-[14px] text-[#E8EEF7]">{label}</Link>)}</nav>
              </details>
              <details className="border-y border-white/10 py-1 group">
                <summary className="flex min-h-11 cursor-pointer items-center justify-between text-[14px] font-semibold uppercase tracking-[0.12em] text-[#B8D4F2]">Services <span aria-hidden="true" className="text-lg group-open:rotate-45 transition-transform">+</span></summary>
                <nav aria-label="Mobile footer services" className="grid grid-cols-2 gap-2 pb-3">{serviceLinks.map(([label, href]) => <Link key={label} href={href} className="flex min-h-11 items-center text-[14px] text-[#E8EEF7]">{label}</Link>)}</nav>
              </details>
            </div>
            <div className="hidden grid-cols-2 gap-8 text-center sm:grid sm:gap-12 md:text-left">
              {/* Sub-column 1: Quick Links */}
              <div>
                <h3 className="text-[14px] font-semibold uppercase tracking-[0.18em] text-[#8FB0D6]">
                  Quick Links
                </h3>
                <nav aria-label="Footer Quick Links" className="mt-4 flex flex-col gap-3">
                  {quickLinks.map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      className="inline-block w-fit mx-auto md:mx-0 rounded-sm text-[15px] text-[#E8EEF7]/85 transition-all duration-200 ease-out hover:text-white hover:translate-x-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Sub-column 2: Services */}
              <div>
                <h3 className="text-[14px] font-semibold uppercase tracking-[0.18em] text-[#8FB0D6]">
                  Services
                </h3>
                <nav aria-label="Footer Services" className="mt-4 flex flex-col gap-3">
                  {serviceLinks.map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      className="inline-block w-fit mx-auto md:mx-0 rounded-sm text-[15px] text-[#E8EEF7]/85 transition-all duration-200 ease-out hover:text-white hover:translate-x-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Column 3: Get in touch (30%) */}
          <div className="w-full min-w-0 flex flex-col items-start sm:items-center md:items-start md:col-start-2 md:row-start-1 lg:col-start-3 lg:row-start-1">
            <h3 className="text-[14px] font-semibold uppercase tracking-[0.18em] text-[#8FB0D6]">
              Get in touch
            </h3>
            <div className="mt-3 flex flex-col gap-2 w-full items-start sm:mt-4 sm:gap-3.5 sm:items-center md:items-start">
              <a
                href={`mailto:${siteConfig.email}`}
                className="group inline-flex min-h-11 max-w-full items-center gap-3 rounded-xl text-[15px] text-[#E8EEF7]/85 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
              >
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border border-[rgba(143,176,214,0.18)] bg-white/[0.05] text-[#8FB0D6] transition-colors duration-200 group-hover:border-[rgba(143,176,214,0.32)] group-hover:bg-white/[0.08]">
                  <Mail size={18} strokeWidth={2} />
                </span>
                <span
                  className="min-w-0 truncate font-normal text-[15px]"
                >
                  {siteConfig.email}
                </span>
              </a>

              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="group inline-flex min-h-11 items-center gap-3 rounded-xl text-[15px] text-[#E8EEF7]/85 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
              >
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border border-[rgba(143,176,214,0.18)] bg-white/[0.05] text-[#8FB0D6] transition-colors duration-200 group-hover:border-[rgba(143,176,214,0.32)] group-hover:bg-white/[0.08]">
                  <Phone size={18} strokeWidth={2} />
                </span>
                <span
                  className="font-normal text-[15px]"
                >
                  {siteConfig.phone}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* HORIZONTAL DIVIDER */}
        <div className="relative z-10 mt-5 mb-5 h-px w-full bg-[rgba(143,176,214,0.14)] sm:mt-8 sm:mb-6" aria-hidden="true" />

        {/* BOTTOM ROW */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div>
            <p className="text-[14px] font-medium text-[#E8EEF7]">
              © {currentYear} Garuda. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2.5">
              <a
                href={socialConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Garuda on GitHub"
                title="Garuda on GitHub"
                className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[rgba(143,176,214,0.22)] bg-white/[0.04] text-[#E8EEF7] transition-colors duration-200 hover:border-[rgba(143,176,214,0.4)] hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] [-webkit-tap-highlight-color:transparent]"
              >
                <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
              <a
                href={socialConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Garuda on LinkedIn"
                title="Garuda on LinkedIn"
                className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[rgba(143,176,214,0.22)] bg-white/[0.04] text-[#E8EEF7] transition-colors duration-200 hover:border-[rgba(143,176,214,0.4)] hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] [-webkit-tap-highlight-color:transparent]"
              >
                <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0-.01-3.34 1.67 1.67 0 0 0 .01 3.34M7.85 18.5V10.1H5.06v8.4h2.79z"/>
                </svg>
              </a>
              <a
                href={socialConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Garuda on Instagram"
                title="Garuda on Instagram"
                className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[rgba(143,176,214,0.22)] bg-white/[0.04] text-[#E8EEF7] transition-colors duration-200 hover:border-[rgba(143,176,214,0.4)] hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] [-webkit-tap-highlight-color:transparent]"
              >
                <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a
                href={socialConfig.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Garuda on X"
                title="Garuda on X"
                className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[rgba(143,176,214,0.22)] bg-white/[0.04] text-[#E8EEF7] transition-colors duration-200 hover:border-[rgba(143,176,214,0.4)] hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] [-webkit-tap-highlight-color:transparent]"
              >
                <svg className="h-[16px] w-[16px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            <span className="hidden sm:block h-6 w-px bg-[rgba(143,176,214,0.2)] mx-1" aria-hidden="true" />

            <button
              onClick={scrollToTop}
              type="button"
              aria-label="Back to top"
              className="flex h-[40px] items-center gap-2 rounded-full border border-[rgba(143,176,214,0.22)] bg-white/[0.04] px-4 text-[14px] font-medium text-[#E8EEF7] transition-colors duration-200 hover:border-[rgba(143,176,214,0.4)] hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer"
            >
              <ArrowUp size={16} strokeWidth={2} className="shrink-0 text-[#8FB0D6]" />
              <span>Back to top</span>
            </button>
          </div>
        </div>
        </div>
      </Container>
    </footer>
  );
}
