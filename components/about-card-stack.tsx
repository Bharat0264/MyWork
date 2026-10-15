"use client";

import { useState, useRef, useEffect, type KeyboardEvent, type MouseEvent, type TouchEvent } from "react";
import { Layout, Server, Database, Cpu, ArrowRight } from "lucide-react";

export interface SkillGroup {
  name: string;
  icon: typeof Layout;
  tools: string[];
  initials: { code: string; label: string }[];
}

export const skillGroups: SkillGroup[] = [
  {
    name: "Frontend",
    icon: Layout,
    tools: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML / CSS"],
    initials: [
      { code: "Re", label: "React" },
      { code: "Nx", label: "Next.js" },
    ],
  },
  {
    name: "Backend",
    icon: Server,
    tools: ["Node.js", "Express", "REST APIs", "Authentication"],
    initials: [
      { code: "No", label: "Node.js" },
      { code: "Ex", label: "Express" },
    ],
  },
  {
    name: "Data",
    icon: Database,
    tools: ["MongoDB", "SQL", "Cloud databases"],
    initials: [
      { code: "Mg", label: "MongoDB" },
      { code: "SQL", label: "SQL" },
    ],
  },
  {
    name: "Tools & Growth",
    icon: Cpu,
    tools: ["Git / GitHub", "Vercel", "Render", "SEO", "Analytics", "Payment integration"],
    initials: [
      { code: "Git", label: "Git" },
      { code: "Vc", label: "Vercel" },
    ],
  },
];

export function AboutCardStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Detect mobile width for responsive collapsed pill sizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const total = skillGroups.length;
  const currentGroup = skillGroups[activeIndex];
  const CurrentIcon = currentGroup.icon;

  // The two groups next in order after the active one
  const card1Index = (activeIndex + 1) % total;
  const card2Index = (activeIndex + 2) % total;
  const card1 = skillGroups[card1Index];
  const card2 = skillGroups[card2Index];
  const Card1Icon = card1.icon;
  const Card2Icon = card2.icon;

  const selectGroup = (index: number) => {
    setActiveIndex((index + total) % total);
  };

  const nextGroup = () => {
    selectGroup(activeIndex + 1);
  };

  const prevGroup = () => {
    selectGroup(activeIndex - 1);
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextGroup();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      prevGroup();
    } else if (e.key === "Home") {
      e.preventDefault();
      selectGroup(0);
    } else if (e.key === "End") {
      e.preventDefault();
      selectGroup(total - 1);
    }
  };

  // Touch swipe support
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    touchStartXRef.current = null;
    if (diff > 45) {
      nextGroup();
    } else if (diff < -45) {
      prevGroup();
    }
  };

  // Slider click & drag calculation
  const updateFromPosition = (clientX: number) => {
    if (!sliderTrackRef.current) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const target = Math.round(ratio * (total - 1));
    selectGroup(target);
  };

  const handleSliderClick = (e: MouseEvent<HTMLDivElement>) => {
    updateFromPosition(e.clientX);
  };

  const handleThumbMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);

    const onMouseMove = (moveEvent: globalThis.MouseEvent) => {
      updateFromPosition(moveEvent.clientX);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const progressPercent = (activeIndex / (total - 1)) * 100;

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Skill stack interactive viewer"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-[32px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-b from-[#1B2B45] via-[#141E30] to-[#0B1322] shadow-[0_24px_60px_rgba(4,9,18,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
    >
      {/* Subtle top ambient glow & grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(ellipse_at_top,_rgba(95,134,176,0.12)_0%,_transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[32px] opacity-[0.04] bg-[radial-gradient(rgba(255,255,255,0.8)_1px,_transparent_1px)] bg-[size:16px_16px]"
        aria-hidden="true"
      />

      {/* 4 Corner captions */}
      <span className="pointer-events-none absolute top-6 left-7 sm:left-9 text-[13px] font-medium text-[#6F86A3] tracking-wide select-none">
        Skills
      </span>
      <span className="pointer-events-none absolute top-6 right-7 sm:right-9 text-[13px] font-medium text-[#6F86A3] tracking-wide select-none">
        Stack
      </span>
      <span className="pointer-events-none absolute bottom-6 left-7 sm:left-9 text-[13px] font-medium text-[#6F86A3] tracking-wide select-none hidden sm:block">
        Garuda
      </span>
      <p className="pointer-events-none absolute bottom-6 right-7 sm:right-9 max-w-[220px] text-right text-[13px] font-medium text-[#6F86A3] leading-relaxed select-none hidden sm:block">
        These cards outline the tools I build with.
      </p>

      {/* Center Stage & Card Stack */}
      <div className="relative z-10 flex min-h-[520px] w-full flex-col items-center justify-center px-4 py-16 sm:px-8 sm:py-20 md:py-24">
        <div
          role="tablist"
          aria-label="Skill categories"
          className="relative flex w-full max-w-[640px] flex-col items-center pt-[80px] sm:pt-[112px]"
        >
          {/* Collapsed Card 2 (Topmost, smaller, peeking highest) */}
          <button
            type="button"
            role="tab"
            aria-selected={false}
            aria-controls="about-main-panel"
            aria-label={`Switch to ${card2.name}`}
            onClick={() => selectGroup(card2Index)}
            className="group absolute top-0 z-[1] flex h-[44px] items-center justify-between rounded-full border border-[rgba(143,176,214,0.2)] bg-[#0E1626] px-5 text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[rgba(143,176,214,0.38)] hover:bg-[#141F33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer"
            style={{
              width: isMobile ? "72%" : "64%",
              opacity: 0.8,
            }}
          >
            <div className="flex items-center gap-2.5">
              <Card2Icon size={18} className="shrink-0 text-[#8FB0D6] transition-colors group-hover:text-white" />
              <span className="text-[14px] font-medium text-white">{card2.name}</span>
            </div>
            <span className="text-[13px] text-[#9FB3CC] font-normal">{card2.tools.length} tools</span>
          </button>

          {/* Collapsed Card 1 (Middle, peeking above main card) */}
          <button
            type="button"
            role="tab"
            aria-selected={false}
            aria-controls="about-main-panel"
            aria-label={`Switch to ${card1.name}`}
            onClick={() => selectGroup(card1Index)}
            className="group absolute z-[2] flex h-[44px] items-center justify-between rounded-full border border-[rgba(143,176,214,0.2)] bg-[#0E1626] px-5 text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[rgba(143,176,214,0.38)] hover:bg-[#141F33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer"
            style={{
              width: isMobile ? "86%" : "78%",
              top: isMobile ? "40px" : "56px",
              opacity: 0.92,
            }}
          >
            <div className="flex items-center gap-2.5">
              <Card1Icon size={18} className="shrink-0 text-[#8FB0D6] transition-colors group-hover:text-white" />
              <span className="text-[14px] font-medium text-white">{card1.name}</span>
            </div>
            <span className="text-[13px] text-[#9FB3CC] font-normal">{card1.tools.length} tools</span>
          </button>

          {/* Main Card (Front & Expanded) */}
          <div
            id="about-main-panel"
            role="tabpanel"
            aria-labelledby={`tab-${currentGroup.name}`}
            className="relative z-10 w-full rounded-[28px] border border-white/[0.14] bg-gradient-to-br from-[#35577D] via-[#1E3250] to-[#141E30] p-6 sm:p-7 shadow-[0_20px_48px_rgba(4,9,18,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          >
            {/* Top Row: Group name + Progress Badge + Next Button */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CurrentIcon size={20} className="shrink-0 text-[#8FB0D6]" />
                <h3 className="text-[18px] font-semibold text-white tracking-tight">{currentGroup.name}</h3>
              </div>

              {/* Badge: e.g. 1/4 */}
              <div
                aria-label={`Step ${activeIndex + 1} of ${total}`}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white/30 bg-white/5 text-[12px] font-semibold text-white/90"
              >
                {activeIndex + 1}/{total}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={nextGroup}
                aria-label="Next skill group"
                className="flex h-[36px] items-center gap-1.5 rounded-full border border-white/[0.18] bg-white/[0.08] px-3.5 text-[13px] font-medium text-white transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight size={14} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Stat Row: Technologies count + Focus name */}
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-6">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wider text-[#9FB3CC]">Technologies</p>
                <div className="mt-1 flex items-baseline">
                  <span className="text-[44px] font-semibold text-white leading-none tracking-tight">
                    {currentGroup.tools.length}
                  </span>
                  <span className="ml-2 text-[18px] font-medium text-[#9FB3CC]">tools</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[12px] font-medium uppercase tracking-wider text-[#9FB3CC]">Focus</p>
                <p className="mt-1 text-[26px] sm:text-[28px] font-semibold text-white leading-tight tracking-tight">
                  {currentGroup.name}
                </p>
              </div>
            </div>

            {/* Slider */}
            <div className="my-6">
              <div
                ref={sliderTrackRef}
                onClick={handleSliderClick}
                role="slider"
                aria-valuemin={1}
                aria-valuemax={total}
                aria-valuenow={activeIndex + 1}
                aria-valuetext={currentGroup.name}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className="relative h-[6px] w-full rounded-full bg-white/[0.12] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
              >
                {/* Filled portion */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#5F86B0] to-[#8FB0D6] transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />

                {/* Draggable Thumb */}
                <div
                  onMouseDown={handleThumbMouseDown}
                  className={`absolute -top-[6px] h-[18px] w-[18px] -translate-x-1/2 rounded-full bg-white shadow-[0_2px_8px_rgba(4,9,18,0.45)] transition-all duration-300 ease-out cursor-grab ${
                    isDragging ? "cursor-grabbing scale-110" : ""
                  }`}
                  style={{ left: `${progressPercent}%` }}
                />
              </div>

              {/* 4 Category labels under track */}
              <div className="mt-3 flex items-center justify-between gap-1 text-[11px]">
                {skillGroups.map((group, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={group.name}
                      type="button"
                      onClick={() => selectGroup(idx)}
                      className={`transition-colors duration-200 cursor-pointer text-left sm:text-center ${
                        isActive ? "font-semibold text-white" : "text-[#9FB3CC] hover:text-white"
                      }`}
                    >
                      {group.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Area: Left divider + Tag chips + Right 2 tool square tiles */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Left accent divider bar */}
                <div className="h-10 w-[2px] shrink-0 rounded-full bg-[#5F86B0]" aria-hidden="true" />

                {/* Tag chips */}
                <div className="flex flex-wrap gap-2">
                  {currentGroup.tools.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center rounded-full border border-white/[0.14] bg-white/[0.06] px-3 py-1.5 text-[12px] font-normal text-[#E8EEF7]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: 2 small rounded square tiles showing first 2 tools initials/monograms */}
              <div className="hidden sm:flex items-center gap-2.5 shrink-0 pl-2">
                {currentGroup.initials.map((tile) => (
                  <div
                    key={tile.label}
                    title={tile.label}
                    className="flex h-[56px] w-[56px] flex-col items-center justify-center rounded-[14px] border border-white/[0.12] bg-white/[0.06] text-center shadow-sm backdrop-blur-sm transition-transform hover:scale-105"
                  >
                    <span className="text-[14px] font-bold text-white tracking-wide leading-none">{tile.code}</span>
                    <span className="mt-1 max-w-[48px] truncate text-[9px] font-medium text-[#8FB0D6] leading-none">
                      {tile.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen-reader and Search-engine complete accessibility listing */}
      <div className="sr-only">
        <h2>Complete Skills and Tools Overview</h2>
        {skillGroups.map((group) => (
          <div key={group.name}>
            <h3>{group.name}</h3>
            <ul>
              {group.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
