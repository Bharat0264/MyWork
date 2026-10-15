"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, Project } from "@/data/projects";

// Short category labels as requested: All, Creation, Redesign, Full-stack, E-commerce, SEO, Marketing
const categoryItems = [
  { short: "All", full: "All" },
  { short: "Creation", full: "Website Creation" },
  { short: "Redesign", full: "Website Redesign" },
  { short: "Full-stack", full: "Full-stack Development" },
  { short: "E-commerce", full: "E-commerce" },
  { short: "SEO", full: "SEO & Performance" },
  { short: "Marketing", full: "Digital Marketing" },
] as const;

function matchesCategory(project: Project, category: string): boolean {
  if (category === "All") return true;
  if (category === "Full-stack Development") {
    return (
      project.categories.includes("Web Development") ||
      project.categories.includes("Full-stack Development") ||
      project.services.some(
        (s) => s.toLowerCase().includes("full-stack") || s.toLowerCase().includes("development")
      )
    );
  }
  if (category === "SEO & Performance") {
    return (
      project.technologies.some(
        (t) => t.toLowerCase().includes("seo") || t.toLowerCase().includes("performance")
      ) ||
      project.services.some(
        (s) => s.toLowerCase().includes("performance") || s.toLowerCase().includes("seo")
      ) ||
      project.categories.includes("Business Websites")
    );
  }
  if (category === "Digital Marketing") {
    return (
      project.categories.includes("Web Applications") ||
      project.services.some((s) => s.toLowerCase().includes("marketing"))
    );
  }
  return project.categories.includes(category);
}

// Auto-fit font size for vertical title so full name fits within stage height minus 64px
function getVerticalTitleRem(title: string): number {
  const len = title.length;
  if (len <= 8) return 2.6;
  if (len <= 12) return 2.2;
  if (len <= 16) return 1.85;
  if (len <= 20) return 1.6;
  return 1.5;
}

export function WorkPortfolioShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [railScrollOffset, setRailScrollOffset] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const touchStartXRef = useRef<number | null>(null);

  // Filter projects by category
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => matchesCategory(p, activeCategory));

  const totalCount = filteredProjects.length;
  const safeIndex = Math.min(currentIndex, Math.max(0, totalCount - 1));
  const currentProject: Project = filteredProjects[safeIndex] || projects[0];

  const nextIndex = (safeIndex + 1) % (totalCount || 1);
  const nextProject = filteredProjects[nextIndex] || currentProject;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentIndex(0);
    setRailScrollOffset(0);
  };

  const handleNext = useCallback(() => {
    if (totalCount <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalCount);
  }, [totalCount]);

  const handlePrev = useCallback(() => {
    if (totalCount <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalCount) % totalCount);
  }, [totalCount]);

  // Keep rail scroll window centered on active project
  useEffect(() => {
    if (safeIndex < railScrollOffset) {
      setRailScrollOffset(safeIndex);
    } else if (safeIndex >= railScrollOffset + 3) {
      setRailScrollOffset(safeIndex - 2);
    }
  }, [safeIndex, railScrollOffset]);

  const scrollRailUp = () => {
    if (railScrollOffset > 0) {
      setRailScrollOffset((prev) => Math.max(0, prev - 1));
    } else if (totalCount > 3) {
      setRailScrollOffset(totalCount - 3);
    }
    handlePrev();
  };

  const scrollRailDown = () => {
    if (railScrollOffset < Math.max(0, totalCount - 3)) {
      setRailScrollOffset((prev) => prev + 1);
    } else {
      setRailScrollOffset(0);
    }
    handleNext();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        handlePrev();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    touchStartXRef.current = null;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
  };

  const formattedIndex = String(safeIndex + 1).padStart(2, "0");
  const formattedTotal = String(totalCount).padStart(2, "0");

  const ghostWord =
    currentProject.titleSuffix ||
    currentProject.titlePrefix ||
    currentProject.title.toUpperCase();

  // Rail visible window (3 items on desktop)
  const visibleRailProjects = filteredProjects.slice(railScrollOffset, railScrollOffset + 3);
  if (visibleRailProjects.length < 3 && filteredProjects.length >= 3) {
    const needed = 3 - visibleRailProjects.length;
    visibleRailProjects.push(...filteredProjects.slice(0, needed));
  }

  const verticalTitleRem = getVerticalTitleRem(currentProject.title);

  return (
    <section id="work" className="wrap pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-20">
      {/* Preload next project screenshot */}
      <link rel="preload" as="image" href={`/projects/${nextProject.slug}-full.webp`} />

      {/* 0. INTRO HEADING WITH EAGLE GRAPHIC */}
      <div className="mb-10 sm:mb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--steel-light)]" />
              OUR WORK
            </p>
            <h2 className="section-heading mt-4 font-semibold tracking-[-0.02em] text-[var(--text)] text-3xl sm:text-5xl lg:text-6xl">
              Work with a reason <br className="hidden sm:inline" />
              <span className="text-[var(--mist)]">to exist.</span>
            </h2>
            <p className="mt-4 max-w-xl text-[15px] sm:text-[16px] leading-relaxed text-[var(--text-muted)]">
              A selection of websites, products and digital experiences shaped around real business goals and user needs.
            </p>
          </div>

          {/* Garuda Eagle Emblem */}
          <div className="shrink-0 select-none hidden md:block">
            <Image
              src="/logo-eagle.png"
              alt="Garuda Web Designer and Developer Emblem"
              width={160}
              height={160}
              priority
              className="h-[105px] w-auto lg:h-[130px] object-contain"
            />
          </div>
        </div>
      </div>

      {/* HORIZONTAL CATEGORY MENU (TABLET & MOBILE <1024px) */}
      <div className="mb-6 lg:hidden">
        <div
          role="tablist"
          aria-label="Filter projects"
          className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar"
        >
          {categoryItems.map((item) => {
            const isActive = activeCategory === item.full;
            return (
              <button
                key={item.short}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(item.full)}
                title={item.full}
                aria-label={item.full}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] ${
                  isActive
                    ? "bg-white text-[#141E30] font-semibold border border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                    : "border border-white/[0.12] bg-[#141E30]/70 text-[#9FB3CC] hover:border-white/25 hover:text-white"
                }`}
              >
                {item.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          1. THE STAGE (MAIN SHOWCASE CONTAINER)
          Strict CSS Grid on Desktop:
          grid-template-columns: 224px 64px minmax(240px, 300px) minmax(0, 1fr) 72px;
          column-gap: 24px; padding: 32px; min-height: 640px;
          ======================================================== */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Project showcase environment"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-[32px] border border-[rgba(143,176,214,0.22)] bg-gradient-to-br from-[#141E30] via-[#1E3250] to-[#35577D] shadow-[0_24px_60px_rgba(4,9,18,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] min-h-[640px]"
      >
        {/* Subtle ambient accent glow & grain texture */}
        <div
          className="pointer-events-none absolute inset-0 transition-colors duration-700 ease-out"
          style={{
            background: `radial-gradient(ellipse at 65% 50%, ${currentProject.accent}14 0%, transparent 65%)`,
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[32px] opacity-[0.04] bg-[radial-gradient(rgba(255,255,255,0.8)_1px,_transparent_1px)] bg-[size:16px_16px]"
          aria-hidden="true"
        />

        {/* GHOST WORD (BEHIND HERO IMAGE, OPACITY 0.05, NOT VISIBLE THROUGH TEXT) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[58%] top-1/2 -translate-x-1/2 -translate-y-1/2 select-none z-0 whitespace-nowrap leading-none transition-opacity duration-500 ease-out text-white/[0.05] font-extrabold tracking-[-0.03em] hidden sm:block"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: "clamp(160px, 20vw, 290px)",
          }}
        >
          {ghostWord}
        </div>

        {/* TOP-RIGHT COUNTER (Inside padding, left of right gutter) */}
        <div
          aria-label={`Project ${formattedIndex} of ${formattedTotal}`}
          className="absolute top-6 right-8 lg:top-8 lg:right-[104px] z-30 font-mono text-[13px] font-bold tracking-[0.14em] text-[#8FB0D6] select-none"
        >
          {formattedIndex} / {formattedTotal}
        </div>

        {/* ========================================================
            DESKTOP & TABLET GRID LAYOUT (>= 700px)
            Strict grid: [Col 1: Rail 224px] [Col 2: Vertical Title 64px] [Col 3: Info 240-300px] [Col 4: Device flex] [Col 5: Right Gutter 72px]
            ======================================================== */}
        <div className="hidden min-[700px]:grid w-full h-full min-h-[640px] p-6 lg:p-8 gap-5 lg:gap-6 grid-cols-[200px_minmax(240px,280px)_minmax(0,1fr)] xl:grid-cols-[224px_64px_minmax(240px,300px)_minmax(0,1fr)_72px] lg:grid-cols-[200px_minmax(240px,280px)_minmax(0,1fr)_72px] items-center relative z-10">
          
          {/* ─── COLUMN 1: THE RAIL (224px / 200px) ─── */}
          <div className="flex flex-col items-center justify-center h-full max-h-[580px]">
            {/* Scroll Up Button */}
            <button
              onClick={scrollRailUp}
              type="button"
              aria-label="Previous project thumbnail"
              className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer mb-2.5 shrink-0"
            >
              <ChevronUp size={18} strokeWidth={2.2} />
            </button>

            {/* Thumbnail Cards and Position Dots side-by-side (NO overlap) */}
            <div className="flex items-center gap-2.5 w-full">
              {/* 3 Visible Thumbnails */}
              <div role="tablist" aria-label="Projects rail" className="flex flex-col gap-2.5 flex-1 min-w-0">
                {visibleRailProjects.map((item, idx) => {
                  const origIndex = filteredProjects.findIndex((p) => p.slug === item.slug);
                  const isActive = origIndex === safeIndex;

                  return (
                    <button
                      key={`${item.slug}-${idx}`}
                      role="tab"
                      type="button"
                      aria-selected={isActive}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => setCurrentIndex(origIndex)}
                      className={`group relative h-[94px] w-full rounded-[18px] p-2 flex items-center gap-2.5 text-left transition-all duration-300 backdrop-blur-[12px] cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] ${
                        isActive
                          ? "border border-white/35 bg-white/[0.12] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2.5px] before:rounded-r before:bg-[#5F86B0]"
                          : "border border-white/[0.12] bg-white/[0.06] hover:border-white/25 hover:bg-white/[0.09] opacity-80 hover:opacity-100"
                      }`}
                    >
                      {/* Real thumbnail screen preview */}
                      <div className="relative h-[48px] w-[54px] shrink-0 rounded-[10px] overflow-hidden border border-white/10 bg-[#0A0F1D]">
                        <img
                          src={`/projects/${item.slug}.webp`}
                          alt={`Thumbnail for ${item.title}`}
                          className="h-full w-full object-cover object-top"
                          loading="lazy"
                        />
                      </div>

                      {/* Metadata: Fits "Royal Mechanics" cleanly */}
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-white leading-snug line-clamp-2">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#9FB3CC] font-medium truncate">
                          {item.category}
                        </p>
                        <p className="mt-1 text-[10px] text-[#6F86A3] font-mono">
                          {item.year}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Vertical position indicator dots to the right (NO overlap) */}
              <div className="flex flex-col items-center gap-1.5 py-1 shrink-0" aria-hidden="true">
                {filteredProjects.map((p, idx) => {
                  const isActive = idx === safeIndex;
                  return (
                    <button
                      key={p.slug}
                      onClick={() => setCurrentIndex(idx)}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "h-[18px] w-[4px] bg-[#8FB0D6]"
                          : "h-[4px] w-[4px] bg-white/25 hover:bg-white/50"
                      }`}
                      aria-label={`Go to ${p.title}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Scroll Down Button */}
            <button
              onClick={scrollRailDown}
              type="button"
              aria-label="Next project thumbnail"
              className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer mt-2.5 shrink-0"
            >
              <ChevronDown size={18} strokeWidth={2.2} />
            </button>
          </div>

          {/* ─── COLUMN 2: VERTICAL TITLE (64px, visible >= 1200px) ─── */}
          <div className="hidden xl:flex flex-col justify-end items-center h-full pb-8 select-none">
            <h3
              className="font-extrabold uppercase tracking-[-0.03em] leading-none text-white transition-all duration-300"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontSize: `${verticalTitleRem}rem`,
              }}
            >
              <span>{currentProject.titlePrefix}</span>{" "}
              <span className="text-[#8FB0D6]">{currentProject.titleSuffix || ""}</span>
            </h3>
          </div>

          {/* ─── COLUMN 3: THE INFO (240px to 300px) ─── */}
          <div className="flex flex-col justify-center gap-6 h-full py-4 min-w-0">
            {/* Fallback heading when vertical title is hidden (<1200px) */}
            <div className="xl:hidden">
              <h3 className="text-[26px] sm:text-[28px] font-extrabold uppercase tracking-tight text-white leading-tight">
                {currentProject.titlePrefix}{" "}
                <span className="text-[#8FB0D6]">{currentProject.titleSuffix || ""}</span>
              </h3>
            </div>

            {/* Tagline */}
            <p className="text-[14px] leading-[1.6] text-[#9FB3CC] line-clamp-4">
              {currentProject.shortDescription}
            </p>

            {/* Chips (wrapping, max 4) */}
            <div className="flex flex-wrap gap-1.5">
              {currentProject.services.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/[0.12] bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-[#E8EEF7]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* View Project Button */}
            <div>
              <Link
                href={currentProject.liveUrl || `/work/${currentProject.slug}`}
                target={currentProject.liveUrl ? "_blank" : undefined}
                rel={currentProject.liveUrl ? "noopener noreferrer" : undefined}
                aria-label={`View ${currentProject.title} project`}
                className="group inline-flex items-center gap-2 rounded-full border border-[rgba(53,87,125,0.22)] bg-gradient-to-b from-white to-[#EEF3FB] px-3 py-1.5 text-[12px] font-semibold text-[#141E30] shadow-[0_4px_12px_rgba(4,9,18,0.25)] transition-all duration-200 hover:bg-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
              >
                <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#2F8BFF] to-[#1B5FD6] text-white">
                  <svg className="h-[12px] w-[12px] fill-current" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </span>
                <span className="font-semibold text-[#141E30]">View project</span>
                <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full border border-[rgba(53,87,125,0.15)] bg-gradient-to-b from-white to-[#DFE7F2] text-[#141E30]">
                  <ArrowUpRight size={13} strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </div>

          {/* ─── COLUMN 4: THE DEVICE (Flexible, centered, aspect 4/3, tilt rotate(-4deg) rotateY(-8deg)) ─── */}
          <div className="flex flex-col items-center justify-center h-full p-4 lg:p-6 w-full min-w-0" style={{ perspective: "1200px" }}>
            {/* Small Category label ABOVE tablet (instead of on the screen) */}
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-0.5 text-[11px] font-medium text-[#8FB0D6] mb-3 select-none">
              {currentProject.category}
            </span>

            {/* Tablet Mockup */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.slug}
                initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-[480px] aspect-[4/3] rounded-[24px] border border-white/20 bg-[#0B1322] p-2.5 shadow-[0_20px_48px_rgba(4,9,18,0.55)] transition-transform duration-500 ease-out flex flex-col"
                style={{
                  transform: isReducedMotion
                    ? "none"
                    : "rotate(-4deg) rotateY(-8deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Camera dot */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-white/20" />

                {/* Display Screen */}
                <div className="relative flex-1 w-full overflow-hidden rounded-[16px] bg-[#0A0F1D] flex flex-col">
                  {/* Slim 28px Browser Bar in Dark Glass */}
                  <div className="h-[28px] shrink-0 border-b border-white/10 bg-[#0B1322]/90 backdrop-blur-md px-3 flex items-center justify-between z-20">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-400" />
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      {/* Rounded Address Pill showing real domain */}
                      <div className="ml-2 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-mono text-white/60 truncate max-w-[170px]">
                        {currentProject.liveUrl
                          ? currentProject.liveUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
                          : `${currentProject.slug}.com`}
                      </div>
                    </div>

                    {/* Thin Live Project Chip if live */}
                    {currentProject.liveUrl && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live Project
                      </span>
                    )}
                  </div>

                  {/* Real Home Page Full Screenshot with Slow Scroll on Hover */}
                  <DeviceScreen project={currentProject} isReducedMotion={isReducedMotion} />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Soft Neutral Floor Shadow (No Glow) */}
            <div
              aria-hidden="true"
              className="pointer-events-none w-[75%] h-[16px] rounded-[100%] bg-black/40 blur-[14px] mt-2"
            />
          </div>

          {/* ─── COLUMN 5: RIGHT GUTTER (72px, vertical category menu on desktop >= 1024px) ─── */}
          <div
            role="tablist"
            aria-label="Category navigation"
            className="hidden lg:flex flex-col items-center justify-center gap-[18px] select-none h-full py-6"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            {categoryItems.map((item) => {
              const isActive = activeCategory === item.full;
              return (
                <button
                  key={item.short}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => handleCategoryChange(item.full)}
                  title={item.full}
                  aria-label={item.full}
                  className={`text-[12px] tracking-[0.14em] font-medium uppercase transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] py-1 ${
                    isActive
                      ? "text-white font-semibold relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[2px] after:h-3 after:bg-[#5F86B0]"
                      : "text-[#9FB3CC] hover:text-white"
                  }`}
                  style={{
                    writingMode: "vertical-rl",
                  }}
                >
                  {item.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            MOBILE SINGLE COLUMN LAYOUT (< 700px)
            Sequence: Counter, Heading, Device (width 92%, tilt -2deg), Tagline, Chips, Button, Horizontal Thumbnails, 3 Buttons
            ======================================================== */}
        <div className="flex min-[700px]:hidden flex-col gap-5 p-5 pt-8 relative z-10">
          {/* 1. Heading */}
          <div>
            <h3 className="text-2xl font-extrabold uppercase tracking-tight text-white leading-tight">
              {currentProject.titlePrefix}{" "}
              <span className="text-[#8FB0D6]">{currentProject.titleSuffix || ""}</span>
            </h3>
          </div>

          {/* 2. Device Mockup (width 92%, tilt -2deg) */}
          <div className="flex flex-col items-center justify-center w-full my-1">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-[#8FB0D6] mb-2">
              {currentProject.category}
            </span>

            <div
              className="relative w-[92%] aspect-[4/3] rounded-[20px] border border-white/20 bg-[#0B1322] p-2 shadow-[0_16px_36px_rgba(4,9,18,0.55)] flex flex-col"
              style={{
                transform: isReducedMotion ? "none" : "rotate(-2deg)",
              }}
            >
              <div className="relative flex-1 w-full overflow-hidden rounded-[14px] bg-[#0A0F1D] flex flex-col">
                {/* 28px Browser Bar */}
                <div className="h-[28px] shrink-0 border-b border-white/10 bg-[#0B1322]/90 backdrop-blur-md px-2.5 flex items-center justify-between z-20">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <div className="ml-1.5 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-mono text-white/60 truncate max-w-[130px]">
                      {currentProject.liveUrl
                        ? currentProject.liveUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
                        : `${currentProject.slug}.com`}
                    </div>
                  </div>
                  {currentProject.liveUrl && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-400">
                      Live
                    </span>
                  )}
                </div>

                <DeviceScreen project={currentProject} isReducedMotion={isReducedMotion} />
              </div>
            </div>

            {/* Floor shadow */}
            <div
              aria-hidden="true"
              className="pointer-events-none w-[70%] h-[12px] rounded-[100%] bg-black/40 blur-[10px] mt-2"
            />
          </div>

          {/* 3. Tagline */}
          <p className="text-[14px] leading-[1.6] text-[#9FB3CC]">
            {currentProject.shortDescription}
          </p>

          {/* 4. Chips */}
          <div className="flex flex-wrap gap-1.5">
            {currentProject.services.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/[0.12] bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-[#E8EEF7]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 5. View project button */}
          <div>
            <Link
              href={currentProject.liveUrl || `/work/${currentProject.slug}`}
              target={currentProject.liveUrl ? "_blank" : undefined}
              rel={currentProject.liveUrl ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-2 rounded-full border border-[rgba(53,87,125,0.22)] bg-gradient-to-b from-white to-[#EEF3FB] px-3.5 py-2 text-[12px] font-semibold text-[#141E30] shadow-[0_4px_12px_rgba(4,9,18,0.25)]"
            >
              <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#2F8BFF] to-[#1B5FD6] text-white">
                <svg className="h-[12px] w-[12px] fill-current" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </span>
              <span>View project</span>
              <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full border border-[rgba(53,87,125,0.15)] bg-gradient-to-b from-white to-[#DFE7F2] text-[#141E30]">
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </span>
            </Link>
          </div>

          {/* 6. Horizontal Thumbnails Row with Swipe */}
          <div className="pt-3 border-t border-white/10">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9FB3CC] mb-2">
              All Projects
            </p>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
              {filteredProjects.map((p, idx) => {
                const isActive = idx === safeIndex;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex h-[76px] w-[160px] shrink-0 items-center gap-2.5 rounded-xl p-2 text-left transition-all ${
                      isActive
                        ? "border border-white/35 bg-white/[0.12]"
                        : "border border-white/10 bg-white/[0.05] opacity-75"
                    }`}
                  >
                    <div className="relative h-[42px] w-[48px] shrink-0 rounded-lg overflow-hidden bg-[#0A0F1D]">
                      <img
                        src={`/projects/${p.slug}.webp`}
                        alt={p.title}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-bold text-white truncate">{p.title}</p>
                      <p className="text-[10px] text-[#9FB3CC] truncate">{p.category}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================
            THREE ROUND BUTTONS (Previous, Next, Open live site)
            Bottom right inside stage with 24px from edges, 36px each, 10px gap
            On mobile (<700px), centered below
            ======================================================== */}
        <div className="flex min-[700px]:absolute min-[700px]:bottom-6 min-[700px]:right-8 z-30 items-center justify-center min-[700px]:justify-end gap-[10px] p-4 min-[700px]:p-0">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            type="button"
            aria-label="Previous project"
            className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer"
          >
            <ChevronLeft size={17} strokeWidth={2.2} />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            type="button"
            aria-label="Next project"
            className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer"
          >
            <ChevronRight size={17} strokeWidth={2.2} />
          </button>

          {/* Open Live Site Button */}
          {currentProject.liveUrl && (
            <a
              href={currentProject.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open live website for ${currentProject.title}`}
              className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
            >
              <ExternalLink size={15} strokeWidth={2.2} />
            </a>
          )}
        </div>
      </div>

      {/* Complete Accessible SEO Fallback for all projects */}
      <div className="sr-only">
        <h2>All Portfolio Projects</h2>
        <ul>
          {projects.map((p) => (
            <li key={p.slug}>
              <h3>{p.title}</h3>
              <p>{p.fullDescription}</p>
              <p>Category: {p.category}</p>
              <p>Services: {p.services.join(", ")}</p>
              <p>Technologies: {p.technologies.join(", ")}</p>
              {p.liveUrl && <a href={p.liveUrl}>Visit {p.title} live</a>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ==========================================
// REAL SCREENSHOT VIEWER WITH 6s SLOW SCROLL
// ==========================================
function DeviceScreen({
  project,
  isReducedMotion,
}: {
  project: Project;
  isReducedMotion: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);

  const measureOverflow = () => {
    if (imgRef.current && containerRef.current) {
      const imgHeight = imgRef.current.clientHeight;
      const contHeight = containerRef.current.clientHeight;
      setMaxScroll(Math.max(0, imgHeight - contHeight));
    }
  };

  useEffect(() => {
    setIsHovered(false);
    measureOverflow();
  }, [project.slug]);

  const translateY = isHovered && !isReducedMotion ? -maxScroll : 0;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        measureOverflow();
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => {
        measureOverflow();
        setIsHovered((prev) => !prev);
      }}
      className="relative flex-1 w-full h-[calc(100%-28px)] overflow-hidden cursor-pointer bg-[#0A0F1D]"
    >
      <img
        ref={imgRef}
        src={`/projects/${project.slug}-full.webp`}
        alt={`Home page of ${project.title}`}
        width={1440}
        height={900}
        onLoad={measureOverflow}
        onError={(e) => {
          if (project.previewImage && e.currentTarget.src !== project.previewImage) {
            e.currentTarget.src = project.previewImage;
          }
        }}
        className="w-full h-auto block select-none pointer-events-none"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isReducedMotion ? "none" : "transform 6s ease-in-out",
          willChange: isHovered ? "transform" : "auto",
        }}
      />
    </div>
  );
}
