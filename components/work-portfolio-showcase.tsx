"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { projects, Project } from "@/data/projects";
import { ViewProjectGlassButton } from "@/components/view-project-button";
import { Container } from "@/components/container";

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

export function WorkPortfolioShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [railScrollOffset, setRailScrollOffset] = useState<number>(0);
  const isReducedMotion = useReducedMotion() ?? false;
  const touchStartXRef = useRef<number | null>(null);

  // Filter projects by category
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => matchesCategory(p, activeCategory));

  const totalCount = filteredProjects.length;
  const safeIndex = Math.min(currentIndex, Math.max(0, totalCount - 1));
  const currentProject: Project = filteredProjects[safeIndex] || projects[0];


  const visibleRailOffset = safeIndex < railScrollOffset
    ? safeIndex
    : safeIndex >= railScrollOffset + 3 ? safeIndex - 2 : railScrollOffset;

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

  const scrollRailUp = () => {
    if (visibleRailOffset > 0) {
      setRailScrollOffset(visibleRailOffset - 1);
    } else if (totalCount > 3) {
      setRailScrollOffset(totalCount - 3);
    }
    handlePrev();
  };

  const scrollRailDown = () => {
    if (visibleRailOffset < Math.max(0, totalCount - 3)) {
      setRailScrollOffset(visibleRailOffset + 1);
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
  const visibleRailProjects = filteredProjects.slice(visibleRailOffset, visibleRailOffset + 3);
  if (visibleRailProjects.length < 3 && filteredProjects.length >= 3) {
    const needed = 3 - visibleRailProjects.length;
    visibleRailProjects.push(...filteredProjects.slice(0, needed));
  }

  // Count categories excluding "All"
  const totalCategoriesCount = categoryItems.length - 1;

  return (
    <Container as="section" id="work" className="pt-0 pb-0">

      {/* ========================================================
          1. HEADER (LEFT-ALIGNED BLOCK, NO LOGO, REAL STATS ON RIGHT)
          Spacing: 40px above navbar (via main), var(--header-gap) below
          ======================================================== */}
      <motion.div
        initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-[var(--header-gap)]"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Left Block: Eyebrow, Heading, Paragraph */}
          <div className="max-w-[760px]">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#A9C8EB] flex items-center gap-2.5 md:text-[12px] md:tracking-[0.2em]">
              <span className="inline-block w-6 h-px bg-[#8FB0D6]" aria-hidden="true" />
              <span>SELECTED WORK</span>
            </p>
            <h1 className="mt-3 font-semibold text-white tracking-[-0.02em] leading-[1.1] text-[clamp(36px,9vw,40px)] md:text-[clamp(2.2rem,4.4vw,3.4rem)]">
              Websites built to perform.
            </h1>
            <p className="mt-4 max-w-[560px] text-[16px] leading-[1.6] text-[#B8C9DE] md:text-[17px] md:leading-[1.7] md:text-[#9FB3CC]">
              A selection of websites and web apps we designed and developed, each built around a real business goal.
            </p>
          </div>

          {/* Right Block: Stats Summary (replaces the removed logo) */}
          <div className="flex items-center gap-6 sm:gap-8 shrink-0 pb-1">
            <div>
              <p className="text-[32px] font-semibold text-white leading-none">
                {projects.length}
              </p>
              <p className="mt-1 text-[13px] font-medium uppercase tracking-wider text-[#B8C9DE] md:text-[12px] md:text-[#9FB3CC]">
                Projects
              </p>
            </div>
            <div className="h-10 w-px bg-[rgba(143,176,214,0.2)]" aria-hidden="true" />
            <div>
              <p className="text-[32px] font-semibold text-white leading-none">
                {totalCategoriesCount}
              </p>
              <p className="mt-1 text-[13px] font-medium uppercase tracking-wider text-[#B8C9DE] md:text-[12px] md:text-[#9FB3CC]">
                Categories
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* HORIZONTAL CATEGORY MENU (CLEAN, READABLE TABS ACROSS ALL SCREENS) */}
      <div className="mb-6 w-full">
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
                className={`min-h-11 rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-200 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] active:scale-[0.97] ${
                  isActive
                    ? "bg-white text-[#141E30] font-semibold border border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                    : "border border-white/[0.12] bg-[#141E30]/70 text-[#B8C9DE] hover:border-white/25 hover:text-white"
                }`}
              >
                {item.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          2. THE STAGE (MAIN SHOWCASE CONTAINER)
          Fluid container width, radius 32px, min-height 640px, padding 36px
          Background: linear-gradient(145deg, #1B2B45 0%, #141E30 60%, #0F1829 100%)
          1px border rgba(143,176,214,0.18), shadow 0 24px 60px rgba(4,9,18,0.5), faint grain overlay 0.03
          ======================================================== */}
      <motion.div
        initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        tabIndex={0}
        role="region"
        aria-label="Project showcase environment"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative mx-auto w-full min-w-0 overflow-hidden rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45] via-[#141E30] to-[#0F1829] p-5 sm:rounded-[32px] sm:p-7 lg:p-9 shadow-[0_24px_60px_rgba(4,9,18,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] min-h-0 sm:min-h-[640px] flex flex-col justify-between"
      >
        {/* Faint grain overlay (0.03) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[32px] opacity-[0.03] bg-[radial-gradient(rgba(255,255,255,0.8)_1px,_transparent_1px)] bg-[size:16px_16px]"
          aria-hidden="true"
        />

        {/* ========================================================
            DESKTOP LAYOUT (>= 1200px):
            Grid: 232px | minmax(280px, 360px) | minmax(0, 1fr)
            Gap: 32px, align-items: center
            ======================================================== */}
        <div className="hidden xl:grid w-full grid-cols-[232px_minmax(280px,360px)_minmax(0,1fr)] gap-[clamp(20px,2vw,32px)] items-center relative z-10 flex-1 py-4">
          
          {/* ─── COLUMN 1: THE RAIL (232px) ─── */}
          <div className="flex flex-col items-center justify-center w-[232px]">
            {/* Scroll Up Button */}
            <button
              onClick={scrollRailUp}
              type="button"
              aria-label="Previous project thumbnail"
              className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer mb-3 shrink-0"
            >
              <ChevronUp size={18} strokeWidth={2.2} />
            </button>

            {/* 3 Visible Thumbnails */}
            <div role="tablist" aria-label="Projects rail" className="flex flex-col gap-2.5 w-full">
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
                    className={`group relative h-[92px] w-[232px] rounded-[16px] p-2.5 flex items-center gap-3 text-left transition-all duration-300 backdrop-blur-[12px] cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] ${
                      isActive
                        ? "border border-white/30 bg-white/[0.08] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:rounded-r before:bg-[#5F86B0]"
                        : "border border-white/[0.12] bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07] opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* 56px Rounded Thumbnail */}
                    <div className="relative h-[56px] w-[56px] shrink-0 rounded-[12px] overflow-hidden border border-white/10 bg-[#0A0F1D]">
                      <Image
                        src={`/projects/${item.slug}.webp`}
                        alt={`Thumbnail for ${item.title}`}
                        width={56}
                        height={56}
                        sizes="56px"
                        className="h-full w-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[13px] font-semibold text-white leading-snug truncate"
                        title={item.title}
                      >
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#9FB3CC] font-normal truncate">
                        {item.category}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#6F86A3] font-mono">
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
              className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer mt-3 shrink-0"
            >
              <ChevronDown size={18} strokeWidth={2.2} />
            </button>

            {/* Horizontal Position Dots under rail (centered) */}
            <div className="flex items-center justify-center gap-1.5 mt-3 select-none" aria-hidden="true">
              {filteredProjects.map((p, idx) => {
                const isActive = idx === safeIndex;
                return (
                  <button
                    key={p.slug}
                    onClick={() => setCurrentIndex(idx)}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "h-[5px] w-[18px] bg-[#8FB0D6]"
                        : "h-[5px] w-[5px] bg-white/25 hover:bg-white/50"
                    }`}
                    aria-label={`Go to ${p.title}`}
                  />
                );
              })}
            </div>
          </div>

          {/* ─── COLUMN 2: THE INFO (minmax(280px, 340px), VERTICALLY CENTERED) ─── */}
          <div className="flex flex-col justify-center min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.slug}
                initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-4"
              >
                {/* Category & Year */}
                <p className="text-[12px] uppercase font-semibold tracking-wider text-[#8FB0D6]">
                  {currentProject.category} · {currentProject.year}
                </p>

                {/* Project Name (Normal Horizontal Heading, 38px, replaces vertical title) */}
                <h2 className="text-[34px] xl:text-[38px] font-semibold text-white leading-[1.1] tracking-tight">
                  {currentProject.title}
                </h2>

                {/* Description (max 4 lines) */}
                <p className="text-[15px] leading-[1.7] text-[#9FB3CC] line-clamp-4">
                  {currentProject.shortDescription}
                </p>

                {/* Tag Chips (max 4, 12px, radius 999px, padding 6px 12px) */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {currentProject.services.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[12px] rounded-full px-3 py-1.5 bg-white/[0.06] border border-white/[0.14] text-[#E8EEF7] font-medium leading-none"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Button: "View project" liquid glass pill AND Live site link */}
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <ViewProjectGlassButton project={currentProject} />
                  {currentProject.liveUrl && (
                    <a
                      href={currentProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open live website for ${currentProject.title} (opens in new tab)`}
                      className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#8FB0D6] hover:text-white transition-colors"
                    >
                      <span>Live site</span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── COLUMN 3: THE DEVICE (Tablet / Browser Mockup, centered and fluid) ─── */}
          <div className="flex min-w-0 flex-col items-center justify-center w-full" style={{ perspective: "1000px" }}>
            {/* Top Corners: Category Chip (Left) & Live Project Chip (Right) OUT of the screen */}
            <div className="flex items-center justify-between w-[90%] max-w-[700px] mb-2.5 px-1 select-none">
              {/* Category chip above top-left corner */}
              <span className="inline-flex items-center rounded-full border border-[rgba(143,176,214,0.35)] bg-[#141E30]/80 px-2.5 py-0.5 text-[11px] font-medium text-[#8FB0D6]">
                {currentProject.category}
              </span>

              {/* Live Project chip above top-right corner */}
              {currentProject.liveUrl && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(143,176,214,0.35)] bg-[#141E30]/80 px-2.5 py-0.5 text-[11px] font-medium text-[#E8EEF7]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5BD6A0]" />
                  Live Project
                </span>
              )}
            </div>

            {/* Device Mockup */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.slug}
                initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="relative w-[90%] max-w-[700px] aspect-[4/3] rounded-[24px] border border-white/20 bg-[#0B1322] p-2.5 shadow-[0_24px_50px_rgba(0,0,0,0.6)] flex flex-col"
                style={{
                  transform: isReducedMotion ? "none" : "rotate(-3deg)",
                }}
              >
                {/* Display Screen */}
                <div className="relative flex-1 w-full overflow-hidden rounded-[16px] bg-[#0A0F1D] flex flex-col">
                  {/* Clean 28px Browser Bar on top (Dots + Domain Pill only, NO overlapping chips) */}
                  <div className="h-[28px] shrink-0 border-b border-white/10 bg-[#0B1322]/90 backdrop-blur-md px-3 flex items-center justify-between z-20">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#FF5F56]/80" />
                      <span className="h-2 w-2 rounded-full bg-[#FFBD2E]/80" />
                      <span className="h-2 w-2 rounded-full bg-[#27C93F]/80" />
                      {/* Rounded Address Pill showing real domain */}
                      <div className="ml-2 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-mono text-white/60 truncate max-w-[240px]">
                        {currentProject.liveUrl
                          ? currentProject.liveUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
                          : `${currentProject.slug}.com`}
                      </div>
                    </div>
                  </div>

                  {/* Real Home Page Full Screenshot with Slow Scroll on Hover */}
                  <DeviceScreen project={currentProject} isReducedMotion={isReducedMotion} />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Soft Neutral Floor Shadow (No Glow) */}
            <div
              aria-hidden="true"
              className="pointer-events-none w-[75%] h-[16px] rounded-[100%] bg-black/45 blur-[14px] mt-3"
            />
          </div>
        </div>

        {/* ========================================================
            MEDIUM VIEW (1024px to 1199px):
            Grid: 200px | minmax(0, 1fr)
            Info placed under device in middle column
            ======================================================== */}
        <div className="hidden lg:grid xl:hidden w-full grid-cols-[200px_minmax(0,1fr)] gap-6 items-center relative z-10 flex-1 py-4">
          {/* Column 1: Rail 200px */}
          <div className="flex flex-col items-center justify-center w-[200px]">
            <button
              onClick={scrollRailUp}
              type="button"
              aria-label="Previous project thumbnail"
              className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 hover:bg-white/[0.16] cursor-pointer mb-2.5"
            >
              <ChevronUp size={18} strokeWidth={2.2} />
            </button>
            <div role="tablist" aria-label="Projects rail" className="flex flex-col gap-2.5 w-full">
              {visibleRailProjects.map((item, idx) => {
                const origIndex = filteredProjects.findIndex((p) => p.slug === item.slug);
                const isActive = origIndex === safeIndex;
                return (
                  <button
                    key={`${item.slug}-${idx}`}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => setCurrentIndex(origIndex)}
                    className={`group relative h-[88px] w-full rounded-[14px] p-2 flex items-center gap-2.5 text-left transition-all duration-300 backdrop-blur-[12px] cursor-pointer overflow-hidden ${
                      isActive
                        ? "border border-white/30 bg-white/[0.08] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:rounded-r before:bg-[#5F86B0]"
                        : "border border-white/[0.12] bg-white/[0.04] opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="relative h-[50px] w-[50px] shrink-0 rounded-[10px] overflow-hidden border border-white/10 bg-[#0A0F1D]">
                      <Image
                        src={`/projects/${item.slug}.webp`}
                        alt={`Thumbnail for ${item.title}`}
                        width={50}
                        height={50}
                        sizes="50px"
                        className="h-full w-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold text-white truncate" title={item.title}>
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#9FB3CC] truncate">{item.category}</p>
                      <p className="mt-0.5 text-[10px] text-[#6F86A3] font-mono">{item.year}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={scrollRailDown}
              type="button"
              aria-label="Next project thumbnail"
              className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 hover:bg-white/[0.16] cursor-pointer mt-2.5"
            >
              <ChevronDown size={18} strokeWidth={2.2} />
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-2.5" aria-hidden="true">
              {filteredProjects.map((p, idx) => (
                <button
                  key={p.slug}
                  onClick={() => setCurrentIndex(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    idx === safeIndex ? "h-[5px] w-[18px] bg-[#8FB0D6]" : "h-[5px] w-[5px] bg-white/25"
                  }`}
                  aria-label={`Go to ${p.title}`}
                />
              ))}
            </div>
          </div>

          {/* Middle Column: Device on Top + Info Below */}
          <div className="flex flex-col items-center gap-6 w-full">
            {/* Device */}
            <div className="flex flex-col items-center w-full max-w-[500px]">
              <div className="flex items-center justify-between w-full mb-2 px-1 select-none">
                <span className="inline-flex items-center rounded-full border border-[rgba(143,176,214,0.35)] bg-[#141E30]/80 px-2.5 py-0.5 text-[11px] font-medium text-[#8FB0D6]">
                  {currentProject.category}
                </span>
                {currentProject.liveUrl && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(143,176,214,0.35)] bg-[#141E30]/80 px-2.5 py-0.5 text-[11px] font-medium text-[#E8EEF7]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5BD6A0]" />
                    Live Project
                  </span>
                )}
              </div>
              <div
                className="relative w-full aspect-[4/3] rounded-[22px] border border-white/20 bg-[#0B1322] p-2.5 shadow-[0_20px_48px_rgba(0,0,0,0.6)] flex flex-col"
                style={{ transform: isReducedMotion ? "none" : "rotate(-3deg)" }}
              >
                <div className="relative flex-1 w-full overflow-hidden rounded-[14px] bg-[#0A0F1D] flex flex-col">
                  <div className="h-[28px] shrink-0 border-b border-white/10 bg-[#0B1322]/90 backdrop-blur-md px-3 flex items-center gap-1.5 z-20">
                    <span className="h-2 w-2 rounded-full bg-[#FF5F56]/80" />
                    <span className="h-2 w-2 rounded-full bg-[#FFBD2E]/80" />
                    <span className="h-2 w-2 rounded-full bg-[#27C93F]/80" />
                    <div className="ml-2 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-mono text-white/60 truncate max-w-[200px]">
                      {currentProject.liveUrl
                        ? currentProject.liveUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
                        : `${currentProject.slug}.com`}
                    </div>
                  </div>
                  <DeviceScreen project={currentProject} isReducedMotion={isReducedMotion} />
                </div>
              </div>
              <div aria-hidden="true" className="w-[75%] h-[14px] rounded-[100%] bg-black/45 blur-[12px] mt-2.5" />
            </div>

            {/* Info Under Device */}
            <div className="flex flex-col items-center text-center max-w-[480px] gap-3">
              <h2 className="text-[28px] font-semibold text-white leading-tight">
                {currentProject.title}
              </h2>
              <p className="text-[14px] leading-relaxed text-[#9FB3CC] line-clamp-3">
                {currentProject.shortDescription}
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {currentProject.services.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-[12px] rounded-full px-3 py-1 bg-white/[0.06] border border-white/[0.14] text-[#E8EEF7]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-2">
                <ViewProjectGlassButton project={currentProject} />
                {currentProject.liveUrl && (
                  <a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open live website for ${currentProject.title} (opens in new tab)`}
                    className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#8FB0D6] hover:text-white transition-colors"
                  >
                    <span>Live site</span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            TABLET VIEW (768px to 1023px)
            Single column stage with device on top, info under, horizontal rail under
            ======================================================== */}
        <div className="hidden md:flex lg:hidden flex-col items-center gap-6 py-4 relative z-10 w-full">
          {/* Device */}
          <div className="flex flex-col items-center w-full max-w-[500px]">
            <div className="flex items-center justify-between w-full mb-2 px-1 select-none">
              <span className="inline-flex items-center rounded-full border border-[rgba(143,176,214,0.35)] bg-[#141E30]/80 px-2.5 py-0.5 text-[11px] font-medium text-[#8FB0D6]">
                {currentProject.category}
              </span>
              {currentProject.liveUrl && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(143,176,214,0.35)] bg-[#141E30]/80 px-2.5 py-0.5 text-[11px] font-medium text-[#E8EEF7]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5BD6A0]" />
                  Live Project
                </span>
              )}
            </div>
            <div
              className="relative w-full aspect-[4/3] rounded-[22px] border border-white/20 bg-[#0B1322] p-2.5 shadow-[0_20px_48px_rgba(0,0,0,0.6)] flex flex-col"
              style={{ transform: isReducedMotion ? "none" : "rotate(-2deg)" }}
            >
              <div className="relative flex-1 w-full overflow-hidden rounded-[14px] bg-[#0A0F1D] flex flex-col">
                <div className="h-[28px] shrink-0 border-b border-white/10 bg-[#0B1322]/90 backdrop-blur-md px-3 flex items-center gap-1.5 z-20">
                  <span className="h-2 w-2 rounded-full bg-[#FF5F56]/80" />
                  <span className="h-2 w-2 rounded-full bg-[#FFBD2E]/80" />
                  <span className="h-2 w-2 rounded-full bg-[#27C93F]/80" />
                  <div className="ml-2 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-mono text-white/60 truncate max-w-[200px]">
                    {currentProject.liveUrl
                      ? currentProject.liveUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
                      : `${currentProject.slug}.com`}
                  </div>
                </div>
                <DeviceScreen project={currentProject} isReducedMotion={isReducedMotion} />
              </div>
            </div>
            <div aria-hidden="true" className="w-[75%] h-[14px] rounded-[100%] bg-black/45 blur-[12px] mt-2.5" />
          </div>

          {/* Info */}
          <div className="flex flex-col items-center text-center max-w-[520px] gap-3">
            <h2 className="text-[30px] font-semibold text-white leading-tight">
              {currentProject.title}
            </h2>
            <p className="text-[15px] leading-relaxed text-[#9FB3CC] line-clamp-3">
              {currentProject.shortDescription}
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {currentProject.services.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] rounded-full px-3 py-1 bg-white/[0.06] border border-white/[0.14] text-[#E8EEF7]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-2">
              <ViewProjectGlassButton project={currentProject} />
              {currentProject.liveUrl && (
                <a
                  href={currentProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open live website for ${currentProject.title} (opens in new tab)`}
                  className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#8FB0D6] hover:text-white transition-colors"
                >
                  <span>Live site</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {/* Horizontal Rail of Cards */}
          <div className="w-full pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar justify-center">
              {filteredProjects.map((p, idx) => {
                const isActive = idx === safeIndex;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex h-[76px] w-[170px] shrink-0 items-center gap-2.5 rounded-xl p-2 text-left transition-all ${
                      isActive
                        ? "border border-white/35 bg-white/[0.12]"
                        : "border border-white/10 bg-white/[0.05] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="relative h-[44px] w-[44px] shrink-0 rounded-lg overflow-hidden bg-[#0A0F1D]">
                      <Image
                        src={`/projects/${p.slug}.webp`}
                        alt={p.title}
                        width={44}
                        height={44}
                        sizes="44px"
                        loading="lazy"
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
            MOBILE SINGLE COLUMN LAYOUT (<= 768px)
            Sequence: Counter, Device (94%, tilt -2deg), Project Name (28px),
            Description, Chips, Buttons, Swipeable Thumbnail Row, Round Prev/Next Buttons
            Stage padding: 20px
            ======================================================== */}
        <div className="flex md:hidden flex-col text-left items-start relative z-10 w-full">
          {/* 1. Category label */}
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8FB0D6]">
            {currentProject.category}
          </div>

          {/* 16px gap */}
          <div className="h-4" aria-hidden="true" />

          {/* 2. Project name */}
          <h2 className="text-[clamp(1.6rem,7vw,2rem)] font-semibold text-white leading-[1.15] tracking-tight">
            {currentProject.title}
          </h2>

          {/* 16px gap */}
          <div className="h-4" aria-hidden="true" />

          {/* 3. Short description */}
          <p className="text-[15px] leading-[1.55] text-[#B8C9DE] line-clamp-3">
            {currentProject.shortDescription}
          </p>

          {/* 20px gap */}
          <div className="h-5" aria-hidden="true" />

          {/* 4. Tech / deliverables chips (flex-wrap, 8px gap) */}
          <div className="flex flex-wrap gap-2 w-full">
            {(currentProject.technologies && currentProject.technologies.length > 0
              ? currentProject.technologies.slice(0, 5)
              : currentProject.services.slice(0, 4)
            ).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center text-[13px] rounded-full px-3 py-1 bg-white/[0.06] border border-white/[0.14] text-[#E8EEF7]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 24px gap */}
          <div className="h-6" aria-hidden="true" />

          {/* 5. Buttons row: View project button (Live site link hidden on mobile <= 768px) */}
          <div className="flex items-center justify-start gap-4">
            <ViewProjectGlassButton project={currentProject} className="!h-[48px] !px-6" />
            {currentProject.liveUrl && (
              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open live website for ${currentProject.title} (opens in new tab)`}
                className="hidden md:inline-flex items-center gap-1.5 text-[15px] font-medium text-[#8FB0D6] hover:text-white transition-colors"
              >
                <span>Live site</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}
          </div>

          {/* 28px gap */}
          <div className="h-7" aria-hidden="true" />

          {/* 6. Thumbnail row: horizontal swipe/scroll strip of project cards */}
          <div className="w-full overflow-hidden">
            <div
              tabIndex={0}
              role="region"
              aria-label="Project thumbnails"
              className="flex items-center gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory no-scrollbar"
            >
              {filteredProjects.map((p, idx) => {
                const isActive = idx === safeIndex;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    title={`${p.title} — ${p.category}`}
                    aria-label={`Select ${p.title}`}
                    className={`flex min-w-[232px] w-[232px] shrink-0 snap-start items-center gap-3 rounded-2xl p-2.5 text-left transition-all cursor-pointer ${
                      isActive
                        ? "border border-white/35 bg-white/[0.12] shadow-sm"
                        : "border border-white/10 bg-white/[0.05] opacity-75 hover:opacity-100 hover:border-white/20"
                    }`}
                  >
                    <div className="relative h-[52px] w-[52px] shrink-0 rounded-xl overflow-hidden bg-[#0A0F1D]">
                      <Image
                        src={`/projects/${p.slug}.webp`}
                        alt={p.title}
                        width={52}
                        height={52}
                        sizes="52px"
                        loading="lazy"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-white leading-snug line-clamp-2 [word-break:break-word]">
                        {p.title}
                      </p>
                      <p className="text-[12px] text-[#8FB0D6] truncate mt-0.5">
                        {p.category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 12px gap */}
          <div className="h-3" aria-hidden="true" />

          {/* 7. Carousel controls: Prev/next arrows (round external-link button hidden on mobile <= 768px) */}
          <div className="flex items-center justify-start gap-3">
            <button
              onClick={handlePrev}
              type="button"
              aria-label="Previous project"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 hover:bg-white/[0.16] cursor-pointer active:scale-95 transition-all"
            >
              <ChevronLeft size={18} strokeWidth={2.2} />
            </button>
            <button
              onClick={handleNext}
              type="button"
              aria-label="Next project"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 hover:bg-white/[0.16] cursor-pointer active:scale-95 transition-all"
            >
              <ChevronRight size={18} strokeWidth={2.2} />
            </button>
            {currentProject.liveUrl && (
              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open live website for ${currentProject.title}`}
                aria-label={`Open live website for ${currentProject.title}`}
                className="hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 hover:bg-white/[0.16] active:scale-95 transition-all"
              >
                <ExternalLink size={16} strokeWidth={2.2} />
              </a>
            )}
          </div>
        </div>

        {/* ========================================================
            BOTTOM BAR INSIDE THE STAGE (DESKTOP & TABLET >= 768px)
            Below grid, full width, 1px top divider rgba(143,176,214,0.14), 20px padding above
            Right: 3 round buttons (40px, glass style)
            ======================================================== */}
        <div className="hidden md:flex items-center justify-end w-full mt-6 pt-5 border-t border-[rgba(143,176,214,0.14)] relative z-20">
          {/* Three Round Buttons (Previous, Next, Open live site) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrev}
              type="button"
              aria-label="Previous project"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer"
            >
              <ChevronLeft size={18} strokeWidth={2.2} />
            </button>

            <button
              onClick={handleNext}
              type="button"
              aria-label="Next project"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer"
            >
              <ChevronRight size={18} strokeWidth={2.2} />
            </button>

            {currentProject.liveUrl && (
              <a
                href={currentProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open live website for ${currentProject.title}`}
                className="flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.08] text-white/90 transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
              >
                <ExternalLink size={16} strokeWidth={2.2} />
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Accessible SEO Fallback for search engines & assistive technology */}
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
    </Container>
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
  const [failedSlug, setFailedSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const imageSrc = failedSlug === project.slug && project.previewImage
    ? project.previewImage : `/projects/${project.slug}-full.webp`;
  const isHovered = hoveredSlug === project.slug;

  const measureOverflow = () => {
    if (imgRef.current && containerRef.current) {
      const imgHeight = imgRef.current.clientHeight;
      const contHeight = containerRef.current.clientHeight;
      setMaxScroll(Math.max(0, imgHeight - contHeight));
    }
  };

  const translateY = isHovered && !isReducedMotion ? -maxScroll : 0;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        measureOverflow();
        setHoveredSlug(project.slug);
      }}
      onMouseLeave={() => setHoveredSlug(null)}
      onTouchStart={() => {
        measureOverflow();
        setHoveredSlug((prev) => prev === project.slug ? null : project.slug);
      }}
      className="relative flex-1 w-full h-[calc(100%-28px)] overflow-hidden cursor-pointer bg-[#0A0F1D]"
    >
      <Image
        ref={imgRef}
        src={imageSrc}
        alt={`Home page of ${project.title}`}
        width={1440}
        height={900}
        sizes="(max-width: 699px) calc(100vw - 80px), (max-width: 1024px) 70vw, 600px"
        loading="lazy"
        onLoad={measureOverflow}
        onError={() => { if (project.previewImage && imageSrc !== project.previewImage) setFailedSlug(project.slug); }}
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
