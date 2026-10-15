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
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, Project } from "@/data/projects";

const categories = [
  "All",
  "Website Creation",
  "Website Redesign",
  "Full-stack Development",
  "E-commerce",
  "SEO & Performance",
  "Digital Marketing",
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
      project.technologies.some((t) => t.toLowerCase().includes("seo") || t.toLowerCase().includes("performance")) ||
      project.services.some((s) => s.toLowerCase().includes("performance") || s.toLowerCase().includes("seo")) ||
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

export function WorkPortfolioShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [railScrollOffset, setRailScrollOffset] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const touchStartXRef = useRef<number | null>(null);

  // Filter projects by category
  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => matchesCategory(p, activeCategory));

  const totalCount = filteredProjects.length;
  const safeIndex = Math.min(currentIndex, Math.max(0, totalCount - 1));
  const currentProject: Project = filteredProjects[safeIndex] || projects[0];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Reset index and rail offset when category changes
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

  // Ghost word: rotated 90deg bottom-to-top
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

  return (
    <section id="work" className="wrap pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-20">
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
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] ${
                  isActive
                    ? "bg-white text-[#141E30] font-semibold border border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                    : "border border-white/[0.12] bg-[#141E30]/70 text-[#9FB3CC] hover:border-white/25 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. THE STAGE (MAIN SHOWCASE CONTAINER) */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Project showcase showcase environment"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-[32px] border border-[rgba(143,176,214,0.22)] bg-gradient-to-br from-[#141E30] via-[#1E3250] to-[#35577D] shadow-[0_24px_60px_rgba(4,9,18,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] min-h-[580px] lg:h-[600px] flex flex-col justify-between p-6 sm:p-8 lg:p-0"
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

        {/* TOP-RIGHT COUNTER */}
        <div
          aria-label={`Project ${formattedIndex} of ${formattedTotal}`}
          className="lg:absolute lg:top-7 lg:right-16 z-30 font-mono text-[13px] font-bold tracking-[0.14em] text-[#8FB0D6] select-none flex items-center justify-between lg:justify-start"
        >
          <span>{formattedIndex} / {formattedTotal}</span>
          <span className="lg:hidden text-[11px] font-sans font-medium uppercase tracking-wider text-[#9FB3CC]">
            {currentProject.category}
          </span>
        </div>

        {/* GHOST WORD (BEHIND HERO IMAGE) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[56%] top-1/2 -translate-x-1/2 -translate-y-1/2 select-none z-0 whitespace-nowrap leading-none transition-opacity duration-500 ease-out text-white/[0.05] font-extrabold tracking-[-0.03em] hidden sm:block"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: "clamp(160px, 20vw, 290px)",
          }}
        >
          {ghostWord}
        </div>

        {/* 4. LEFT RAIL: VERTICAL THUMBNAIL CARDS (DESKTOP >= 1024px) */}
        <div className="absolute left-6 xl:left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex items-center gap-3">
          <div className="flex flex-col items-center gap-2">
            {/* Scroll Up Button */}
            <button
              onClick={scrollRailUp}
              type="button"
              aria-label="Previous project thumbnail"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer"
            >
              <ChevronUp size={18} strokeWidth={2.2} />
            </button>

            {/* 3 Visible Thumbnails */}
            <div role="tablist" aria-label="Projects rail" className="flex flex-col gap-2.5">
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
                    className={`group relative h-[94px] w-[184px] rounded-[18px] p-2.5 flex items-center gap-2.5 text-left transition-all duration-300 backdrop-blur-[12px] cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] ${
                      isActive
                        ? "border border-white/35 bg-white/[0.12] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2.5px] before:rounded-r before:bg-[#5F86B0]"
                        : "border border-white/[0.12] bg-white/[0.06] hover:border-white/25 hover:bg-white/[0.09] opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* Small thumbnail screen preview */}
                    <div className="relative h-[44px] w-[50px] shrink-0 rounded-[10px] overflow-hidden border border-white/10 bg-[#0A0F1D]">
                      <MiniPreviewScreen project={item} />
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-white leading-snug truncate">
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

            {/* Scroll Down Button */}
            <button
              onClick={scrollRailDown}
              type="button"
              aria-label="Next project thumbnail"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer"
            >
              <ChevronDown size={18} strokeWidth={2.2} />
            </button>
          </div>

          {/* Vertical position indicator dots */}
          <div className="flex flex-col items-center gap-1.5 py-2" aria-hidden="true">
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

        {/* 3. TOP-LEFT TITLE BLOCK (VERTICAL TITLE + TAGLINE + BUTTON) */}
        <div className="lg:absolute lg:left-[275px] xl:left-[300px] lg:top-1/2 lg:-translate-y-1/2 z-20 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-5 max-w-[270px] xl:max-w-[290px] mt-4 lg:mt-0">
          {/* Vertical Title (Desktop) / Horizontal Title (Mobile) */}
          <div
            className="select-none font-extrabold uppercase tracking-[-0.03em] whitespace-nowrap leading-none text-2xl sm:text-3xl lg:text-[clamp(1.8rem,2.4vw,2.5rem)] text-white"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            <span>{currentProject.titlePrefix}</span>{" "}
            <span className="text-[#8FB0D6]">{currentProject.titleSuffix || ""}</span>
          </div>

          {/* Mobile title fallback (horizontal) */}
          <div className="lg:hidden">
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              {currentProject.titlePrefix}{" "}
              <span className="text-[#8FB0D6]">{currentProject.titleSuffix || ""}</span>
            </h3>
          </div>

          {/* Tagline, Chips & View Project Button */}
          <div className="flex flex-col gap-3">
            <p className="text-[13px] leading-relaxed text-[#9FB3CC] line-clamp-3">
              {currentProject.shortDescription}
            </p>

            {/* Tags (at most 4 chips) */}
            <div className="flex flex-wrap gap-1.5">
              {currentProject.services.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/[0.12] bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-[#E8EEF7]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* View Project Button (Frosted Pill Style with Blue Circle and Arrow) */}
            <div className="pt-1">
              <Link
                href={currentProject.liveUrl || `/work/${currentProject.slug}`}
                target={currentProject.liveUrl ? "_blank" : undefined}
                rel={currentProject.liveUrl ? "noopener noreferrer" : undefined}
                aria-label={`View ${currentProject.title} project`}
                className="group inline-flex items-center gap-2 rounded-full border border-[rgba(53,87,125,0.22)] bg-gradient-to-b from-white to-[#EEF3FB] px-2.5 py-1.5 text-[12px] font-semibold text-[#141E30] shadow-[0_4px_12px_rgba(4,9,18,0.25)] transition-all duration-200 hover:bg-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
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
        </div>

        {/* 2. HERO VISUAL (CENTER-RIGHT TABLET SHOWCASE WITH TILT & FLOOR SHADOW) */}
        <div className="lg:absolute lg:right-[60px] xl:right-[80px] lg:top-1/2 lg:-translate-y-1/2 z-10 w-full lg:w-[50%] xl:w-[54%] max-w-[580px] xl:max-w-[620px] my-6 lg:my-0 flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.slug}
              initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, x: 45, rotate: -3 }}
              animate={isReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, rotate: -6 }}
              exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, x: -45, rotate: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={`relative w-full rounded-[26px] sm:rounded-[32px] border border-white/20 bg-[#0B1322] p-2.5 sm:p-3.5 shadow-[0_24px_50px_rgba(4,9,18,0.65)] hero-float-anim ${
                isReducedMotion ? "" : "animate-[heroFloat_6s_ease-in-out_infinite]"
              }`}
            >
              {/* Device Bezel camera dot */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-white/25 border border-white/10" />

              {/* Tablet Display Screen */}
              <div className="relative aspect-[16/10.2] w-full overflow-hidden rounded-[18px] sm:rounded-[22px] bg-[#0A0F1D] shadow-inner">
                <ProjectTabletScreen project={currentProject} />
              </div>

              {/* Specular glass reflection */}
              <div className="pointer-events-none absolute inset-0 rounded-[26px] sm:rounded-[32px] border-t border-white/25" />
            </motion.div>
          </AnimatePresence>

          {/* Floor Shadow Ellipse */}
          <div
            aria-hidden="true"
            className="pointer-events-none w-[80%] h-[20px] mx-auto rounded-[100%] bg-[rgba(4,9,18,0.6)] blur-[18px] translate-y-2"
          />
        </div>

        {/* 5. RIGHT SIDE (VERTICAL CATEGORY MENU ON DESKTOP) */}
        <div
          role="tablist"
          aria-label="Category navigation"
          className="absolute right-5 xl:right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-7 select-none"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(cat)}
                className={`text-[12.5px] tracking-[0.14em] font-medium uppercase transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] ${
                  isActive
                    ? "text-white font-semibold relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[2px] after:h-4 after:bg-[#5F86B0]"
                    : "text-[#9FB3CC] hover:text-white"
                }`}
                style={{
                  writingMode: "vertical-rl",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 5b. BOTTOM-RIGHT 4 GLASS BUTTONS (PREV, NEXT, LIVE SITE, GITHUB) */}
        <div className="lg:absolute lg:bottom-6 lg:right-8 z-30 flex items-center justify-between sm:justify-end gap-2.5 mt-4 lg:mt-0">
          <div className="flex items-center gap-2">
            {/* Prev Button */}
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

            {/* Live Link Button */}
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

            {/* GitHub Repo Button */}
            {currentProject.githubUrl && (
              <a
                href={currentProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View GitHub source code for ${currentProject.title}`}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
              >
                <svg className="h-[15px] w-[15px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* 4b. MOBILE HORIZONTAL RAIL (CARDS ROW AT BOTTOM) */}
        <div className="lg:hidden mt-6 pt-4 border-t border-white/10">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9FB3CC] mb-2.5">
            More Projects
          </p>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {filteredProjects.map((p, idx) => {
              const isActive = idx === safeIndex;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex h-[76px] w-[150px] shrink-0 items-center gap-2 rounded-xl p-2 text-left transition-all ${
                    isActive
                      ? "border border-white/35 bg-white/[0.12]"
                      : "border border-white/10 bg-white/[0.05] opacity-75"
                  }`}
                >
                  <div className="relative h-[36px] w-[42px] shrink-0 rounded-lg overflow-hidden bg-[#0B1322]">
                    <MiniPreviewScreen project={p} />
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
// CENTRAL HIGH-FIDELITY TABLET SCREEN
// ==========================================
function ProjectTabletScreen({ project }: { project: Project }) {
  if (project.slug === "rainbow-digi-school") {
    return (
      <div className="relative h-full w-full select-none bg-[#F7F2E7] text-[#1E293B] font-sans flex flex-col justify-between overflow-hidden">
        {/* Top Navbar */}
        <div className="flex h-10 sm:h-11 items-center justify-between border-b border-[#E2D8C3] bg-[#FAF6EE]/95 px-3 sm:px-4">
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg">🌈</span>
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-[12px] font-black text-[#D92D3A] tracking-tight leading-none">Rainbow</span>
              <span className="text-[8px] font-bold text-[#1E40AF] tracking-widest uppercase leading-none">DIGI SCHOOL</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[10px] font-semibold text-[#475569]">
            <span className="text-[#1E40AF]">Home</span>
            <span>About</span>
            <span>Programs</span>
            <span>Admissions</span>
          </div>

          <div className="flex items-center">
            <span className="rounded-full bg-[#E11D48] px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
              Enquiry
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative flex-1 grid grid-cols-1 sm:grid-cols-2 p-3 sm:p-5 items-center overflow-hidden">
          <div className="z-10 flex flex-col justify-center">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#475569]">
              Welcome to
            </span>
            <h4 className="text-base sm:text-2xl font-black text-[#1E40AF] leading-tight">
              Rainbow <span className="text-[#10B981]">Digi</span> <span className="text-[#F59E0B]">School</span>
            </h4>
            <p className="mt-1 text-[9px] sm:text-[11px] text-[#64748B] leading-snug max-w-[220px]">
              A joyful place to learn, grow and build a brighter future.
            </p>

            <div className="mt-2.5 flex items-center gap-2">
              <span className="rounded-full bg-[#E11D48] px-2.5 py-1 text-[8px] sm:text-[9px] font-bold text-white shadow">
                Explore Programs
              </span>
              <span className="rounded-full border border-[#CBD5E1] bg-white px-2.5 py-1 text-[8px] sm:text-[9px] font-semibold text-[#334155]">
                Get in Touch
              </span>
            </div>
          </div>

          <div className="relative h-full w-full flex items-center justify-center">
            <div className="relative w-full h-[100px] sm:h-[140px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#BAE6FD] via-[#D1FAE5] to-[#86EFAC] p-2 flex items-center justify-center shadow-inner">
              <div className="absolute top-1.5 left-3 h-5 w-5 rounded-full bg-[#FDE047]" />
              <div className="absolute top-2 left-10 h-2.5 w-6 rounded-full bg-white/80" />
              <div className="absolute right-3 bottom-1.5 text-xl sm:text-3xl">🏡</div>
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-2xl sm:text-4xl animate-bounce">🐒</span>
                <span className="text-[8px] font-bold text-[#1E3A8A] bg-white/85 px-1.5 py-0.5 rounded-full shadow-sm">
                  Kandlakoya Campus
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Bottom Cards */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 border-t border-[#E2D8C3] bg-[#FAF6EE] px-2 sm:px-4 py-1.5 sm:py-2">
          {[
            { icon: "🦁", title: "Play" },
            { icon: "📖", title: "Learn" },
            { icon: "🌱", title: "Grow" },
            { icon: "⭐", title: "Explore" },
          ].map((c) => (
            <div key={c.title} className="flex flex-col items-center justify-center rounded-lg bg-white p-1 shadow-sm border border-[#E2D8C3]/50">
              <span className="text-xs sm:text-sm">{c.icon}</span>
              <span className="text-[8px] sm:text-[9px] font-bold text-[#334155]">{c.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Generic Themed Screen for other projects
  return (
    <div
      className="relative h-full w-full select-none font-sans flex flex-col justify-between p-3.5 sm:p-5 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 80% 20%, ${project.accent}25 0%, #080D1A 70%)`,
      }}
    >
      {/* Top Browser Bar */}
      <div className="flex h-7 items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="ml-2 text-[10px] font-mono text-white/50 truncate max-w-[180px]">
            {project.liveUrl?.replace(/^https?:\/\//, "") || `${project.slug}.com`}
          </span>
        </div>
        <span
          className="text-[9px] font-semibold px-2 py-0.5 rounded-full border border-white/15"
          style={{ color: project.accent, borderColor: `${project.accent}40` }}
        >
          {project.category}
        </span>
      </div>

      {/* Main Preview Content */}
      <div className="my-auto py-2">
        <div className="max-w-md">
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: project.accent }}
          >
            {project.client}
          </span>
          <h4 className="mt-1 text-lg sm:text-2xl font-extrabold text-white tracking-tight">
            {project.title}
          </h4>
          <p className="mt-1.5 text-[11px] sm:text-[12px] text-white/70 leading-relaxed line-clamp-2 sm:line-clamp-3">
            {project.fullDescription}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-white/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status Row */}
      <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[9px] sm:text-[10px] text-white/50">
        <span>Year: {project.year}</span>
        <span className="flex items-center gap-1 text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live Project
        </span>
      </div>
    </div>
  );
}

// ==========================================
// MINI PREVIEW SCREEN (RAIL THUMBNAILS)
// ==========================================
function MiniPreviewScreen({ project }: { project: Project }) {
  if (project.previewImage) {
    return (
      <img
        src={project.previewImage}
        alt={project.title}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    );
  }

  if (project.slug === "rainbow-digi-school") {
    return (
      <div className="h-full w-full bg-[#FAF6EE] p-1 flex flex-col justify-between text-[#1E293B]">
        <div className="flex items-center gap-1">
          <span className="text-[9px]">🌈</span>
          <span className="text-[7px] font-bold text-[#1E40AF]">Rainbow</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-base">🐒</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full p-1.5 flex flex-col justify-between text-white"
      style={{
        background: `linear-gradient(135deg, ${project.accent}35 0%, #070D18 100%)`,
      }}
    >
      <div className="h-1 w-6 rounded-full bg-white/20" />
      <div className="text-[8px] font-bold text-white/90 truncate">{project.title}</div>
    </div>
  );
}
