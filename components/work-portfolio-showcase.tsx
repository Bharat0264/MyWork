"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, Project } from "@/data/projects";

const categories = [
  "All",
  "Website Creation",
  "Website Redesign",
  "Web Development",
  "E-commerce",
  "Business Websites",
  "Web Applications",
] as const;

export function WorkPortfolioShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Filter projects by category
  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.categories.includes(activeCategory));

  // Current active project
  const currentProject: Project = filteredProjects[currentIndex] || filteredProjects[0] || projects[0];
  const totalCount = filteredProjects.length;

  // Reset index when category changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentIndex(0);
  };

  const handleNext = useCallback(() => {
    if (totalCount <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalCount);
  }, [totalCount]);

  const handlePrev = useCallback(() => {
    if (totalCount <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalCount) % totalCount);
  }, [totalCount]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  // Side preview items (surrounding items)
  const getSideItems = () => {
    if (filteredProjects.length <= 1) return { left: [], right: [] };
    const leftIndex = (currentIndex - 1 + totalCount) % totalCount;
    const rightIndex = (currentIndex + 1) % totalCount;
    const secondLeft = (currentIndex - 2 + totalCount) % totalCount;
    const secondRight = (currentIndex + 2) % totalCount;

    return {
      left: [filteredProjects[secondLeft], filteredProjects[leftIndex]],
      right: [filteredProjects[rightIndex], filteredProjects[secondRight]],
    };
  };

  const sideItems = getSideItems();

  const formattedIndex = String(currentIndex + 1).padStart(2, "0");
  const formattedTotal = String(totalCount).padStart(2, "0");
  const progressPercent = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;

  return (
    <section
      id="work"
      aria-label="Garuda Portfolio Showcase"
      className="relative w-full overflow-hidden bg-[#03060B] py-24 sm:py-32 text-[#F7F9FC]"
    >
      {/* ATMOSPHERIC BACKGROUND LIGHTING & CURVED PLANETARY HORIZON */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Subtle technical grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,160,210,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,160,210,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Ambient cyan and electric-blue radial glow */}
        <div className="absolute -top-40 right-1/4 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(22,139,255,0.18)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute top-1/3 left-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(113,91,255,0.12)_0%,transparent_70%)] blur-[90px]" />
        <div className="absolute bottom-10 right-10 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(22,139,255,0.14)_0%,transparent_70%)] blur-[120px]" />

        {/* Curved glowing horizon line across the lower canvas */}
        <div
          className="absolute -bottom-1/2 left-1/2 h-[900px] w-[1800px] -translate-x-1/2 rounded-[50%] border-t border-[rgba(22,139,255,0.45)] shadow-[0_-8px_40px_rgba(22,139,255,0.35)] opacity-80"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(16,42,85,0.45) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1480px] px-6 sm:px-10 lg:px-14">
        {/* SECTION INTRODUCTION & SIGNATURE GARUDA ARTWORK */}
        <div className="relative mb-14 sm:mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow flex items-center gap-2.5 text-[#3DA5FF]">
              <span className="h-2 w-2 rounded-full bg-[#168BFF]" />
              OUR WORK
            </p>
            <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl leading-[1.08]">
              Work with a reason <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#168BFF] via-[#4BA2FF] to-[#715BFF] bg-clip-text text-transparent">
                to exist.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#A8B4C7] sm:text-lg">
              A selection of websites, products and digital experiences shaped around real business goals and user needs.
            </p>
          </div>

          {/* Garuda Signature Water-Eagle Artwork */}
          <div className="relative flex shrink-0 items-center justify-center lg:mb-2">
            {/* Soft radial glow behind eagle */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(22,139,255,0.35)_0%,transparent_70%)] blur-2xl" />
            <div className="relative garuda-floating-eagle">
              <Image
                src="/logo-eagle.png"
                alt="Garuda Web Designer and Developer Emblem"
                width={200}
                height={200}
                priority
                className="h-[120px] w-auto sm:h-[150px] lg:h-[185px] object-contain drop-shadow-[0_0_24px_rgba(22,139,255,0.45)]"
              />
            </div>
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="mb-12 sm:mb-16">
          <div
            role="tablist"
            aria-label="Portfolio Category Filters"
            className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 no-scrollbar"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors duration-200 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98] ${
                    isActive
                      ? "bg-white text-[#03060B] font-semibold border border-transparent shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                      : "border border-white/12 bg-[#08111F] text-[#A8B4C7] hover:border-white/25 hover:bg-[#0c182c] hover:text-[#F7F9FC]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN INTERACTIVE SHOWCASE ENVIRONMENT */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative min-h-[580px] lg:min-h-[660px] rounded-[32px] sm:rounded-[40px] border border-[rgba(120,160,210,0.18)] bg-[#050B14]/80 p-6 sm:p-10 lg:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden"
        >
          {/* Inner ambient horizon lighting */}
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-[340px] w-[800px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgba(22,139,255,0.25)_0%,transparent_70%)] blur-3xl" />

          {/* Left Arrow Button */}
          {totalCount > 1 && (
            <button
              onClick={handlePrev}
              type="button"
              aria-label="Previous project"
              className="absolute left-4 sm:left-7 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-[#08111F] text-white transition-colors duration-200 hover:border-white/25 hover:bg-[#0d1d36] active:scale-[0.98] shadow-[0_4px_12px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
            >
              <ChevronLeft size={22} strokeWidth={2.2} />
            </button>
          )}

          {/* Right Arrow Button */}
          {totalCount > 1 && (
            <button
              onClick={handleNext}
              type="button"
              aria-label="Next project"
              className="absolute right-4 sm:right-7 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-[#08111F] text-white transition-colors duration-200 hover:border-white/25 hover:bg-[#0d1d36] active:scale-[0.98] shadow-[0_4px_12px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
            >
              <ChevronRight size={22} strokeWidth={2.2} />
            </button>
          )}

          {/* CORE SHOWCASE CONTENT GRID */}
          <div className="grid grid-cols-1 items-center gap-10 xl:grid-cols-[140px_1fr_1.45fr_140px] lg:grid-cols-[1fr_1.35fr]">
            {/* 1. LEFT PERSPECTIVE PREVIEWS TRAY (DESKTOP) */}
            <div className="hidden xl:flex flex-col gap-4 perspective-[1000px] z-20">
              {sideItems.left.map((item, idx) => {
                if (!item) return null;
                const origIndex = filteredProjects.findIndex((p) => p.slug === item.slug);
                return (
                  <button
                    key={`${item.slug}-left-${idx}`}
                    onClick={() => setCurrentIndex(origIndex)}
                    type="button"
                    title={`View ${item.title}`}
                    className="group relative h-[105px] w-[135px] rounded-[18px] border border-white/12 bg-[#091222] p-1.5 transition-colors duration-200 hover:border-white/25 active:scale-[0.98] shadow-[0_4px_12px_rgba(0,0,0,0.35)] cursor-pointer overflow-hidden opacity-70 hover:opacity-100"
                    style={{
                      transform: "rotateY(16deg) rotateX(2deg)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="relative h-full w-full rounded-[12px] overflow-hidden bg-[#0a1426]">
                      <MiniPreviewScreen project={item} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A]/90 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[10px] font-semibold text-white/90 truncate">{item.title}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 2. PROJECT DETAILS & METADATA (LEFT COLUMN) */}
            <div className="flex flex-col justify-center z-20 pl-2 sm:pl-6 xl:pl-4">
              {/* Counter and Animated Progress Line */}
              <div className="flex items-center gap-4">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#3DA5FF]">
                  {formattedIndex}
                </span>
                <span className="text-sm font-semibold text-[#6680A6]">
                  / {formattedTotal}
                </span>
                <div className="h-[2.5px] w-24 sm:w-32 rounded-full bg-[rgba(120,160,210,0.2)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#168BFF] to-[#715BFF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Category Pill Tag */}
              <div className="mt-5">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-[#168BFF]/40 bg-[#168BFF]/10 px-3 py-1 text-[11px] font-bold tracking-[0.16em] uppercase text-[#3DA5FF]">
                  <Sparkles size={11} />
                  {currentProject.category}
                </span>
              </div>

              {/* Huge Display Heading with Gradient Second Half */}
              <div className="mt-5">
                <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05]">
                  {currentProject.titlePrefix} <br />
                  <span className="bg-gradient-to-r from-[#168BFF] via-[#3DA5FF] to-[#715BFF] bg-clip-text text-transparent">
                    {currentProject.titleSuffix}
                  </span>
                </h3>
              </div>

              {/* Short Description */}
              <p className="mt-5 max-w-md text-[15px] sm:text-[16px] leading-relaxed text-[#A8B4C7]">
                {currentProject.shortDescription}
              </p>

              {/* Interactive Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {currentProject.liveUrl && (
                  <a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 rounded-full bg-[#168BFF] px-6 py-3.5 text-sm font-semibold text-white border border-white/12 shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-colors duration-200 hover:bg-[#1E90FF] hover:border-white/25 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <span>View Project</span>
                    <ArrowUpRight size={17} />
                  </a>
                )}

                <Link
                  href={`/work/${currentProject.slug}`}
                  aria-label={`Read case study for ${currentProject.title}`}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-[#08111F] text-[#F7F9FC] transition-colors duration-200 hover:border-white/25 hover:bg-[#0e1d38] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <ExternalLink size={18} />
                </Link>
              </div>
            </div>

            {/* 3. CENTRAL 3D ANGLED TABLET SHOWCASE */}
            <div className="perspective-[1400px] z-20 flex justify-center py-4">
              <motion.div
                key={currentProject.slug}
                initial={{ opacity: 0, scale: 0.94, rotateY: -16 }}
                animate={{ opacity: 1, scale: 1, rotateY: isHovered ? -5 : -10 }}
                transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative w-full max-w-[680px] rounded-[28px] sm:rounded-[36px] border border-[rgba(120,160,210,0.35)] bg-[#080E1B] p-2.5 sm:p-3.5 shadow-[0_30px_80px_rgba(0,0,0,0.85)] transition-transform duration-500 hover:shadow-[0_35px_90px_rgba(0,0,0,0.9)]"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Device Camera Bezel Dot */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-white/20 border border-white/10" />

                {/* Tablet Display Screen */}
                <div className="relative aspect-[16/10.5] w-full overflow-hidden rounded-[20px] sm:rounded-[26px] bg-[#0A0F1D] shadow-inner">
                  <ProjectTabletScreen project={currentProject} />
                </div>

                {/* Glass specular rim reflection */}
                <div className="pointer-events-none absolute inset-0 rounded-[28px] sm:rounded-[36px] border-t border-white/20" />
              </motion.div>
            </div>

            {/* 4. RIGHT PERSPECTIVE PREVIEWS TRAY (DESKTOP) */}
            <div className="hidden xl:flex flex-col gap-4 perspective-[1000px] z-20">
              {sideItems.right.map((item, idx) => {
                if (!item) return null;
                const origIndex = filteredProjects.findIndex((p) => p.slug === item.slug);
                return (
                  <button
                    key={`${item.slug}-right-${idx}`}
                    onClick={() => setCurrentIndex(origIndex)}
                    type="button"
                    title={`View ${item.title}`}
                    className="group relative h-[105px] w-[135px] rounded-[18px] border border-white/12 bg-[#091222] p-1.5 transition-colors duration-200 hover:border-white/25 active:scale-[0.98] shadow-[0_4px_12px_rgba(0,0,0,0.35)] cursor-pointer overflow-hidden opacity-70 hover:opacity-100"
                    style={{
                      transform: "rotateY(-16deg) rotateX(2deg)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="relative h-full w-full rounded-[12px] overflow-hidden bg-[#0a1426]">
                      <MiniPreviewScreen project={item} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A]/90 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[10px] font-semibold text-white/90 truncate">{item.title}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. BOTTOM METADATA ROW */}
          <div className="mt-12 sm:mt-16 border-t border-[rgba(120,160,210,0.14)] pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-20 relative">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-white">
                Project Overview
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px] text-[#A8B4C7]">
                {currentProject.services.map((service, i) => (
                  <span key={service} className="flex items-center gap-2">
                    {i > 0 && <span className="h-1 w-1 rounded-full bg-[#168BFF]" />}
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="max-w-xl">
              <p className="text-[14px] leading-relaxed text-[#A8B4C7]">
                {currentProject.overviewNarrative}
              </p>
            </div>
          </div>
        </div>
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
        <div className="flex h-10 sm:h-12 items-center justify-between border-b border-[#E2D8C3] bg-[#FAF6EE]/95 px-3 sm:px-5">
          <div className="flex items-center gap-2">
            {/* Rainbow Arc Logo */}
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🌈</span>
              <div className="flex flex-col">
                <span className="text-[11px] sm:text-[13px] font-black text-[#D92D3A] tracking-tight leading-none">Rainbow</span>
                <span className="text-[8px] sm:text-[9px] font-bold text-[#1E40AF] tracking-widest uppercase leading-none">DIGI SCHOOL</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[10px] sm:text-[11px] font-semibold text-[#475569]">
            <span className="text-[#1E40AF]">Home</span>
            <span>About</span>
            <span>Programs</span>
            <span>Activities</span>
            <span>Admissions</span>
            <span>Contact</span>
          </div>

          <div className="flex items-center">
            <span className="rounded-full bg-[#E11D48] px-2.5 py-1 text-[9px] sm:text-[10px] font-bold text-white shadow-sm">
              Enquiry
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative flex-1 grid grid-cols-1 sm:grid-cols-2 p-3 sm:p-6 items-center overflow-hidden">
          {/* Left Text */}
          <div className="z-10 flex flex-col justify-center">
            <span className="text-[11px] sm:text-[13px] font-bold text-[#475569]">
              Welcome to
            </span>
            <h4 className="text-lg sm:text-2xl lg:text-3xl font-black text-[#1E40AF] leading-tight">
              Rainbow <span className="text-[#10B981]">Digi</span> <span className="text-[#F59E0B]">School</span>
            </h4>
            <p className="mt-1 text-[10px] sm:text-[12px] text-[#64748B] leading-snug max-w-[240px]">
              A joyful place to learn, grow and build a brighter future.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full bg-[#E11D48] px-3 py-1 text-[9px] sm:text-[10px] font-bold text-white shadow">
                Explore Programs
              </span>
              <span className="rounded-full border border-[#CBD5E1] bg-white px-3 py-1 text-[9px] sm:text-[10px] font-semibold text-[#334155]">
                Get in Touch
              </span>
            </div>
          </div>

          {/* Right Hero Illustration with Monkey & Treehouse */}
          <div className="relative h-full w-full flex items-center justify-center">
            {/* Hillside & Tree artwork */}
            <div className="relative w-full h-[120px] sm:h-[180px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#BAE6FD] via-[#D1FAE5] to-[#86EFAC] p-3 flex items-center justify-center shadow-inner">
              {/* Sun & Clouds */}
              <div className="absolute top-2 left-4 h-6 w-6 rounded-full bg-[#FDE047]" />
              <div className="absolute top-3 left-14 h-3 w-8 rounded-full bg-white/80" />
              <div className="absolute top-2 right-8 h-4 w-12 rounded-full bg-white/70" />

              {/* Treehouse in the back */}
              <div className="absolute right-4 bottom-2 text-2xl sm:text-4xl">🏡</div>

              {/* Monkey hanging from branch */}
              <div className="relative z-10 flex flex-col items-center animate-bounce duration-1000">
                <span className="text-3xl sm:text-5xl">🐒</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#1E3A8A] bg-white/85 px-2 py-0.5 rounded-full shadow-sm">
                  Kandlakoya Campus
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Bottom Feature Cards */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-3 border-t border-[#E2D8C3] bg-[#FAF6EE] px-3 sm:px-5 py-2 sm:py-3">
          {[
            { icon: "🦁", title: "Play" },
            { icon: "📖", title: "Learn" },
            { icon: "🌱", title: "Grow" },
            { icon: "⭐", title: "Explore" },
          ].map((c) => (
            <div key={c.title} className="flex flex-col items-center justify-center rounded-xl bg-white p-1.5 sm:p-2 shadow-sm border border-[#E2D8C3]/50">
              <span className="text-sm sm:text-lg">{c.icon}</span>
              <span className="text-[9px] sm:text-[11px] font-bold text-[#334155]">{c.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Generic High-Fidelity Themed Preview for other projects
  return (
    <div
      className="relative h-full w-full select-none font-sans flex flex-col justify-between p-4 sm:p-6 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 80% 20%, ${project.accent}25 0%, #080D1A 70%)`,
      }}
    >
      {/* Top Browser Bar */}
      <div className="flex h-8 items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="ml-2 text-[10px] sm:text-[11px] font-mono text-white/50 truncate max-w-[200px]">
            {project.liveUrl?.replace(/^https?:\/\//, "") || `${project.slug}.com`}
          </span>
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/15"
          style={{ color: project.accent, borderColor: `${project.accent}40` }}
        >
          {project.category}
        </span>
      </div>

      {/* Main Preview Content */}
      <div className="my-auto py-2">
        <div className="max-w-md">
          <span
            className="text-[11px] font-bold tracking-widest uppercase"
            style={{ color: project.accent }}
          >
            {project.client}
          </span>
          <h4 className="mt-1 text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            {project.title}
          </h4>
          <p className="mt-2 text-[12px] sm:text-[13px] text-white/70 leading-relaxed line-clamp-3">
            {project.fullDescription}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-white/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status Row */}
      <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px] sm:text-[11px] text-white/50">
        <span>Year: {project.year}</span>
        <span className="flex items-center gap-1 text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live Project
        </span>
      </div>
    </div>
  );
}

// ==========================================
// MINI PREVIEW SCREEN (SIDE TRAYS)
// ==========================================
function MiniPreviewScreen({ project }: { project: Project }) {
  if (project.slug === "rainbow-digi-school") {
    return (
      <div className="h-full w-full bg-[#FAF6EE] p-1.5 flex flex-col justify-between text-[#1E293B]">
        <div className="flex items-center gap-1">
          <span className="text-[10px]">🌈</span>
          <span className="text-[8px] font-bold text-[#1E40AF]">Rainbow</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xl">🐒</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full p-2 flex flex-col justify-between text-white"
      style={{
        background: `linear-gradient(135deg, ${project.accent}30 0%, #070D18 100%)`,
      }}
    >
      <div className="h-1.5 w-8 rounded-full bg-white/20" />
      <div className="text-[10px] font-bold text-white/90 truncate">{project.title}</div>
    </div>
  );
}
