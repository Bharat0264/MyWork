"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, Phone, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";

const navItems = [
  { label: "Work", href: "/work", id: "work" },
  { label: "Services", href: "/services", id: "services" },
  { label: "About", href: "/about", id: "about" },
  { label: "Contact", href: "/contact", id: "contact" },
] as const;

function renderMobileIcon(id: string) {
  switch (id) {
    case "work":
      return (
        <svg
          className="h-[20px] w-[20px] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "services":
      return (
        <svg
          className="h-[20px] w-[20px] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      );
    case "about":
      return (
        <svg
          className="h-[20px] w-[20px] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "contact":
      return (
        <svg
          className="h-[20px] w-[20px] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    default:
      return null;
  }
}

export function Navbar() {
  const pathname = usePathname();

  const [activeSection, setActiveSection] = useState<number>(0);
  const [hoverSection, setHoverSection] = useState<number | null>(null);

  // Stretch & press animation states
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [mobileIsMoving, setMobileIsMoving] = useState<boolean>(false);
  const [mobileIsPressed, setMobileIsPressed] = useState<boolean>(false);

  // Measurement references
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const desktopItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileBarRef = useRef<HTMLDivElement>(null);
  const mobileItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const [desktopBubble, setDesktopBubble] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });
  const [mobileBubble, setMobileBubble] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });

  const prevTargetRef = useRef<number>(0);
  const moveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mobilePrevTargetRef = useRef<number>(0);
  const mobileMoveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync route and observe page sections
  useEffect(() => {
    if (pathname === "/work" || pathname.startsWith("/work/")) {
      setActiveSection(0);
      return;
    }
    if (pathname === "/services" || pathname.startsWith("/services/")) {
      setActiveSection(1);
      return;
    }
    if (pathname === "/about" || pathname.startsWith("/about/")) {
      setActiveSection(2);
      return;
    }
    if (pathname === "/contact" || pathname.startsWith("/contact/")) {
      setActiveSection(3);
      return;
    }

    if (pathname === "/") {
      const handleScroll = () => {
        if (window.scrollY < 200) {
          setActiveSection(0);
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });

      const sectionEls = [
        document.getElementById("work") || document.querySelector("main > section:nth-of-type(3)"),
        document.querySelector("main > section:nth-of-type(4)"), // Services
        document.querySelector("main > section:nth-of-type(6)"), // About
        document.querySelector("main > section:last-of-type"),  // Contact / CTA
      ];

      const observer = new IntersectionObserver(
        (entries) => {
          if (window.scrollY < 200) {
            setActiveSection(0);
            return;
          }
          const visible = entries.filter((e) => e.isIntersecting);
          if (visible.length > 0) {
            const topVisible = visible.reduce((best, curr) =>
              curr.intersectionRatio > best.intersectionRatio ? curr : best
            );
            const index = sectionEls.indexOf(topVisible.target);
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        },
        {
          threshold: [0.15, 0.4, 0.7],
          rootMargin: "-15% 0px -40% 0px",
        }
      );

      sectionEls.forEach((el) => {
        if (el) observer.observe(el);
      });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        observer.disconnect();
      };
    }
  }, [pathname]);

  // Desktop bubble measurement & stretch movement
  const targetDesktopIndex = hoverSection !== null ? hoverSection : activeSection;

  useEffect(() => {
    const updateDesktopBubble = () => {
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
    return () => {
      window.removeEventListener("resize", updateDesktopBubble);
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
    };
  }, [targetDesktopIndex]);

  // Mobile bubble measurement & movement
  useEffect(() => {
    const updateMobileBubble = () => {
      const el = mobileItemsRef.current[activeSection];
      if (el) {
        setMobileBubble({
          left: el.offsetLeft,
          width: el.offsetWidth,
          ready: true,
        });

        if (mobilePrevTargetRef.current !== activeSection) {
          setMobileIsMoving(true);
          if (mobileMoveTimerRef.current) clearTimeout(mobileMoveTimerRef.current);
          mobileMoveTimerRef.current = setTimeout(() => {
            setMobileIsMoving(false);
          }, 380);
          mobilePrevTargetRef.current = activeSection;
        }
      }
    };

    updateMobileBubble();
    window.addEventListener("resize", updateMobileBubble);
    return () => {
      window.removeEventListener("resize", updateMobileBubble);
      if (mobileMoveTimerRef.current) clearTimeout(mobileMoveTimerRef.current);
    };
  }, [activeSection]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, item: (typeof navItems)[number], idx: number) => {
    setIsPressed(true);
    setMobileIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
      setMobileIsPressed(false);
    }, 200);

    if (pathname === item.href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (pathname === "/" && item.id === "work") {
      const el = document.getElementById("work");
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "#work");
        setActiveSection(idx);
        return;
      }
    }

    setActiveSection(idx);
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
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.04] bg-[#050505]/80 backdrop-blur-md"
      >
        {/* DESKTOP (900px and above) */}
        <div className="mx-auto hidden h-[84px] max-w-[1400px] items-center justify-between px-6 sm:px-10 lg:px-14 xl:px-16 min-[900px]:flex">
          {/* Left: Garuda Logo Lockup */}
          <div className="flex items-center min-w-[200px]">
            <Link href="/" aria-label="Garuda Web Designer and Developer" className="navbar-logo flex items-center shrink-0">
              <picture>
                <source srcSet="/logo-full.webp" type="image/webp" />
                <img
                  src="/logo-full.png"
                  srcSet="/logo-full.png 1x, /logo-full.png 2x"
                  alt="Garuda Web Designer and Developer"
                  width={191}
                  height={64}
                  loading="eager"
                  draggable={false}
                  className="h-[52px] w-auto max-w-[280px] object-contain min-[900px]:h-[64px]"
                />
              </picture>
              <span className="sr-only">Garuda Web Designer and Developer</span>
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
                  aria-current={isActive ? "page" : undefined}
                  data-active={isActive || isHovered}
                  onMouseEnter={() => setHoverSection(idx)}
                  onMouseDown={() => setIsPressed(true)}
                  onMouseUp={() => setIsPressed(false)}
                  onTouchStart={() => setIsPressed(true)}
                  onTouchEnd={() => setIsPressed(false)}
                  onClick={(e) => handleLinkClick(e, item, idx)}
                  className="liquid-nav-link"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: CTA Button */}
          <div className="flex items-center justify-end min-w-[200px]">
            <Link href="/contact" className="button button-small">
              Start a project <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* MOBILE TOP BAR (below 900px) */}
        <div className="flex h-[72px] items-center justify-between px-5 sm:px-8 min-[900px]:hidden">
          <Link href="/" aria-label="Garuda Web Designer and Developer" className="navbar-logo flex items-center shrink-0">
            <picture>
              <source srcSet="/logo-full.webp" type="image/webp" />
              <img
                src="/logo-full.png"
                srcSet="/logo-full.png 1x, /logo-full.png 2x"
                alt="Garuda Web Designer and Developer"
                width={191}
                height={64}
                loading="eager"
                draggable={false}
                className="h-[44px] w-auto max-w-[200px] object-contain"
              />
            </picture>
            <span className="sr-only">Garuda Web Designer and Developer</span>
          </Link>
          <Link href="/contact" className="button button-small !py-2 !px-3.5 !text-xs font-semibold">
            Start a project <ArrowUpRight size={14} />
          </Link>
        </div>
      </motion.header>

      {/* MOBILE BOTTOM FLOATING TAB BAR (below 900px) */}
      <nav
        ref={mobileBarRef}
        aria-label="Mobile Navigation"
        className="liquid-mobile-tab-bar min-[900px]:hidden"
      >
        {/* Sliding Glass Bubble Lens */}
        <div
          className="liquid-mobile-bubble"
          style={{
            left: `${mobileBubble.left}px`,
            width: `${mobileBubble.width}px`,
            opacity: mobileBubble.ready ? 1 : 0,
            transform: mobileIsPressed ? "scale(0.96)" : mobileIsMoving ? "scaleX(1.12)" : "scale(1)",
          }}
          aria-hidden="true"
        />
        {navItems.map((item, idx) => {
          const isActive = activeSection === idx;
          return (
            <Link
              key={item.label}
              ref={(el) => {
                mobileItemsRef.current[idx] = el;
              }}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              data-active={isActive}
              onTouchStart={() => setMobileIsPressed(true)}
              onTouchEnd={() => setMobileIsPressed(false)}
              onMouseDown={() => setMobileIsPressed(true)}
              onMouseUp={() => setMobileIsPressed(false)}
              onClick={(e) => handleLinkClick(e, item, idx)}
              className="liquid-mobile-tab-item"
            >
              {renderMobileIcon(item.id)}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
const quickLinks = [
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
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full overflow-hidden border-t border-white/[0.08] bg-[#05070B] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(16,40,85,0.35)_0%,transparent_70%)] pt-14 pb-10 sm:pt-16 sm:pb-12"
    >
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 xl:px-16">
        {/* 4 LOGICAL COLUMNS */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.45fr_0.85fr_1fr_1.35fr] lg:gap-8 xl:gap-12">
          {/* Column 1: Brand */}
          <div className="flex flex-col items-start">
            <Link href="/" aria-label="Garuda Web Designer and Developer" className="footer-logo shrink-0">
              <picture>
                <source srcSet="/logo-full.webp" type="image/webp" />
                <img
                  src="/logo-full.png"
                  srcSet="/logo-full.png 1x, /logo-full.png 2x"
                  alt="Garuda Web Designer and Developer"
                  width={240}
                  height={80}
                  loading="lazy"
                  draggable={false}
                  className="footer-logo-img"
                />
              </picture>
            </Link>
            <p className="mt-5 max-w-[340px] text-[14.5px] leading-relaxed text-[#A6AFBE]">
              We design and develop modern, high-performance websites that help businesses grow in the digital world.
            </p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-4 rounded-full border border-[#168BFF]/75 bg-[#080e1c] pl-6 pr-2 py-2 text-[15px] font-medium text-[#F5F7FA] transition-all duration-300 hover:border-[#168BFF] hover:bg-[#0c162e] hover:shadow-[0_0_16px_rgba(22,139,255,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF]"
            >
              <span>Start a project</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#168BFF] text-white transition-transform duration-300 group-hover:scale-105 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </span>
            </Link>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[17px] font-semibold text-[#F5F7FA]">Quick Links</h3>
            <div className="mt-2.5 mb-5 h-[2px] w-7 rounded-full bg-[#168BFF]" aria-hidden="true" />
            <nav aria-label="Footer Quick Links" className="flex flex-col gap-3.5">
              {quickLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="w-fit rounded-sm text-[15px] text-[#A6AFBE] transition-colors duration-200 hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#168BFF]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Our Services */}
          <div>
            <h3 className="text-[17px] font-semibold text-[#F5F7FA]">Our Services</h3>
            <div className="mt-2.5 mb-5 h-[2px] w-7 rounded-full bg-[#168BFF]" aria-hidden="true" />
            <nav aria-label="Footer Our Services" className="flex flex-col gap-3.5">
              {serviceLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="w-fit rounded-sm text-[15px] text-[#A6AFBE] transition-colors duration-200 hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#168BFF]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="lg:border-l lg:border-white/[0.08] lg:pl-8 xl:pl-10">
            <h3 className="text-[17px] font-semibold text-[#F5F7FA]">Get in Touch</h3>
            <div className="mt-2.5 mb-5 h-[2px] w-7 rounded-full bg-[#168BFF]" aria-hidden="true" />
            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${siteConfig.email}`}
                className="group flex items-center gap-3.5 text-[15px] text-[#F5F7FA] transition-colors duration-200 hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF] rounded-lg"
              >
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border border-[#168BFF]/25 bg-[#091326] text-[#168BFF] transition-colors duration-200 group-hover:border-[#168BFF]/60 group-hover:bg-[#0c1a36]">
                  <Mail size={18} strokeWidth={2} />
                </span>
                <span className="break-all">{siteConfig.email}</span>
              </a>

              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-3.5 text-[15px] text-[#F5F7FA] transition-colors duration-200 hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF] rounded-lg"
              >
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border border-[#168BFF]/25 bg-[#091326] text-[#168BFF] transition-colors duration-200 group-hover:border-[#168BFF]/60 group-hover:bg-[#0c1a36]">
                  <Phone size={18} strokeWidth={2} />
                </span>
                <span>{siteConfig.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* HORIZONTAL DIVIDER */}
        <div className="mt-12 mb-7 h-px w-full bg-white/[0.08]" aria-hidden="true" />

        {/* BOTTOM BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[14px] font-semibold text-[#F5F7FA]">
              © {currentYear} Garuda. All rights reserved.
            </p>
            <p className="mt-1 text-[13px] text-[#A6AFBE]">
              Built with intention. Designed for a better web.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <a
                href={siteConfig.github || "https://github.com/Bharat0264"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/15 bg-[#060a14] text-[#F5F7FA] transition-all duration-200 hover:border-[#168BFF] hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF]"
              >
                <svg className="h-[16px] w-[16px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
              <a
                href={siteConfig.linkedin || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/15 bg-[#060a14] text-[#F5F7FA] transition-all duration-200 hover:border-[#168BFF] hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF]"
              >
                <svg className="h-[16px] w-[16px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0-.01-3.34 1.67 1.67 0 0 0 .01 3.34M7.85 18.5V10.1H5.06v8.4h2.79z"/>
                </svg>
              </a>
              <a
                href={siteConfig.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/15 bg-[#060a14] text-[#F5F7FA] transition-all duration-200 hover:border-[#168BFF] hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF]"
              >
                <svg className="h-[16px] w-[16px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a
                href={siteConfig.twitter || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/15 bg-[#060a14] text-[#F5F7FA] transition-all duration-200 hover:border-[#168BFF] hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF]"
              >
                <svg className="h-[14px] w-[14px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            <span className="hidden sm:block h-6 w-px bg-white/15 mx-2.5 sm:mx-3" aria-hidden="true" />

            <button
              onClick={scrollToTop}
              type="button"
              aria-label="Back to top"
              className="group flex items-center gap-2.5 text-[14px] font-medium text-[#F5F7FA] transition-colors duration-200 hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF] rounded-full cursor-pointer py-1"
            >
              <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/20 bg-[#060a14] text-[#F5F7FA] transition-all duration-200 group-hover:border-[#168BFF] group-hover:text-[#168BFF]">
                <ArrowUp size={16} strokeWidth={2} />
              </span>
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
export function CTA(){return <section className="wrap py-24"><div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_75%_0%,rgba(124,108,255,.23),transparent_34%),#101014] px-7 py-14 text-center sm:px-12"><p className="eyebrow">Let’s make it useful</p><h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-.055em] sm:text-6xl">Have an idea? Let’s turn it into something people love using.</h2><div className="mt-8 flex justify-center"><Link className="button" href="/contact">Start a project <ArrowUpRight size={16}/></Link></div></div></section>}
