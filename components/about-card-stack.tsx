"use client";

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Transition,
} from "framer-motion";
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

/* ─── 4 Decorative Route/Line Visuals (Simple line-only SVG, #8FB0D6 at 60%, 0.9s ease-out) ─── */
function FrontendVisual() {
  return (
    <svg viewBox="0 0 100 60" className="w-[100px] h-[60px]" fill="none" aria-hidden="true">
      {/* Outer layout frame */}
      <motion.rect
        x="4"
        y="4"
        width="92"
        height="52"
        rx="4"
        stroke="rgba(143,176,214,0.6)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
      {/* Top navbar line */}
      <motion.line
        x1="4"
        y1="16"
        x2="96"
        y2="16"
        stroke="rgba(143,176,214,0.6)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
      />
      {/* Left sidebar block */}
      <motion.rect
        x="9"
        y="21"
        width="22"
        height="30"
        rx="2"
        stroke="rgba(143,176,214,0.6)"
        strokeWidth="1.2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.35, ease: "easeOut" }}
      />
      {/* Main card 1 */}
      <motion.rect
        x="36"
        y="21"
        width="55"
        height="13"
        rx="2"
        stroke="rgba(143,176,214,0.6)"
        strokeWidth="1.2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.5, ease: "easeOut" }}
      />
      {/* Main card 2 */}
      <motion.rect
        x="36"
        y="38"
        width="55"
        height="13"
        rx="2"
        stroke="rgba(143,176,214,0.6)"
        strokeWidth="1.2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.65, ease: "easeOut" }}
      />
    </svg>
  );
}

function BackendVisual() {
  return (
    <svg viewBox="0 0 100 60" className="w-[100px] h-[60px]" fill="none" aria-hidden="true">
      {/* Connection lines */}
      <motion.line
        x1="18"
        y1="30"
        x2="50"
        y2="16"
        stroke="rgba(143,176,214,0.6)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.line
        x1="50"
        y1="16"
        x2="82"
        y2="42"
        stroke="rgba(143,176,214,0.6)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
      />
      {/* 3 Nodes */}
      <circle cx="18" cy="30" r="4" stroke="rgba(143,176,214,0.7)" strokeWidth="1.5" />
      <circle cx="50" cy="16" r="4" stroke="rgba(143,176,214,0.7)" strokeWidth="1.5" />
      <circle cx="82" cy="42" r="4" stroke="rgba(143,176,214,0.7)" strokeWidth="1.5" />
      {/* Traveling pulse dot */}
      <motion.circle
        r="3"
        fill="#8FB0D6"
        initial={{ cx: 18, cy: 30, opacity: 0 }}
        animate={{
          cx: [18, 50, 82],
          cy: [30, 16, 42],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.5, 1],
          ease: "easeInOut",
        }}
      />
    </svg>
  );
}

function DataVisual() {
  return (
    <svg viewBox="0 0 100 60" className="w-[100px] h-[60px]" fill="none" aria-hidden="true">
      {/* Bottom disk */}
      <motion.g
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0, ease: "easeOut" }}
      >
        <path d="M 22 44 C 22 49 78 49 78 44" stroke="rgba(143,176,214,0.6)" strokeWidth="1.5" />
        <line x1="22" y1="38" x2="22" y2="44" stroke="rgba(143,176,214,0.6)" strokeWidth="1.5" />
        <line x1="78" y1="38" x2="78" y2="44" stroke="rgba(143,176,214,0.6)" strokeWidth="1.5" />
      </motion.g>
      {/* Middle disk */}
      <motion.g
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
      >
        <path d="M 22 30 C 22 35 78 35 78 30" stroke="rgba(143,176,214,0.6)" strokeWidth="1.5" />
        <line x1="22" y1="24" x2="22" y2="30" stroke="rgba(143,176,214,0.6)" strokeWidth="1.5" />
        <line x1="78" y1="24" x2="78" y2="30" stroke="rgba(143,176,214,0.6)" strokeWidth="1.5" />
      </motion.g>
      {/* Top disk */}
      <motion.g
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.4, ease: "easeOut" }}
      >
        <ellipse cx="50" cy="14" rx="28" ry="6" stroke="rgba(143,176,214,0.6)" strokeWidth="1.5" />
        <path d="M 22 14 C 22 19 78 19 78 14" stroke="rgba(143,176,214,0.6)" strokeWidth="1.5" />
        <line x1="22" y1="8" x2="22" y2="14" stroke="rgba(143,176,214,0.6)" strokeWidth="1.5" />
        <line x1="78" y1="8" x2="78" y2="14" stroke="rgba(143,176,214,0.6)" strokeWidth="1.5" />
      </motion.g>
    </svg>
  );
}

function ToolsVisual() {
  return (
    <svg viewBox="0 0 100 60" className="w-[100px] h-[60px]" fill="none" aria-hidden="true">
      {/* Rising growth curve */}
      <motion.path
        d="M 12 48 Q 45 42, 60 26 T 84 14"
        stroke="rgba(143,176,214,0.6)"
        strokeWidth="1.8"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      {/* Peak dot */}
      <motion.circle
        cx="84"
        cy="14"
        r="3.5"
        fill="#8FB0D6"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.25, ease: "backOut" }}
      />
    </svg>
  );
}

/* ─── Rolling Odometer for Tools Count ─── */
function Odometer({ count }: { count: number }) {
  return (
    <div className="relative h-[44px] overflow-hidden flex items-baseline">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={count}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-[44px] font-semibold text-white leading-none tracking-tight inline-block"
        >
          {count}
        </motion.span>
      </AnimatePresence>
      <span className="ml-2 text-[18px] font-medium text-[#9FB3CC]">tools</span>
    </div>
  );
}

/* ─── Main Component ─── */
export function AboutCardStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  const stageRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const prefersReducedMotion = useReducedMotion();

  // Desktop subtle pointer parallax (max 2deg tilt, opposite 4px on captions)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 28, stiffness: 140 };
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [2, -2]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-2, 2]), springConfig);
  const captionX = useSpring(useTransform(mouseX, [-1, 1], [4, -4]), springConfig);
  const captionY = useSpring(useTransform(mouseY, [-1, 1], [4, -4]), springConfig);

  const total = skillGroups.length;
  const currentGroup = skillGroups[activeIndex];
  const CurrentIcon = currentGroup.icon;

  // Detect mobile width (<768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // IntersectionObserver for entrance animation
  useEffect(() => {
    if (!stageRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  // Pause autoplay when document tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Autoplay: advance every 4s after viewport entrance, stop on user interaction, pause on >1s hover
  useEffect(() => {
    if (!hasEntered || userInteracted || isHoverPaused || !isTabVisible || prefersReducedMotion) {
      return;
    }
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [hasEntered, userInteracted, isHoverPaused, isTabVisible, prefersReducedMotion, total]);

  const stopAutoplay = () => {
    setUserInteracted(true);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleStageMouseEnter = () => {
    if (userInteracted) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoverPaused(true);
    }, 1000);
  };

  const handleStageMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHoverPaused(false);
  };

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
      stopAutoplay();
      nextGroup();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      stopAutoplay();
      prevGroup();
    } else if (e.key === "Home") {
      e.preventDefault();
      stopAutoplay();
      selectGroup(0);
    } else if (e.key === "End") {
      e.preventDefault();
      stopAutoplay();
      selectGroup(total - 1);
    }
  };

  // Pointer parallax handler
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    handleStageMouseLeave();
  };

  // Slider interaction
  const updateFromPosition = (clientX: number) => {
    if (!sliderTrackRef.current) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const target = Math.round(ratio * (total - 1));
    selectGroup(target);
  };

  const handleSliderClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    stopAutoplay();
    updateFromPosition(e.clientX);
  };

  const handleThumbMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    stopAutoplay();
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
  const ringCircumference = 94.25; // 2 * PI * 15

  // Spring transition for the iOS morph
  const morphTransition: Transition = prefersReducedMotion
    ? { duration: 0.2 }
    : { type: "spring", stiffness: 260, damping: 28, mass: 1 };

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      role="region"
      aria-label="Skill stack interactive viewer"
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onMouseEnter={handleStageMouseEnter}
      className="relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-[32px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-b from-[#1B2B45] via-[#141E30] to-[#0B1322] shadow-[0_24px_60px_rgba(4,9,18,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] select-none [-webkit-tap-highlight-color:transparent]"
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

      {/* 4 Corner Captions with subtle counter-parallax */}
      <motion.span
        style={prefersReducedMotion ? undefined : { x: captionX, y: captionY }}
        className="pointer-events-none absolute top-6 left-7 sm:left-9 text-[13px] font-medium text-[#6F86A3] tracking-wide select-none z-20"
      >
        Skills
      </motion.span>
      <motion.span
        style={prefersReducedMotion ? undefined : { x: captionX, y: captionY }}
        className="pointer-events-none absolute top-6 right-7 sm:right-9 text-[13px] font-medium text-[#6F86A3] tracking-wide select-none z-20"
      >
        Stack
      </motion.span>
      <motion.span
        style={prefersReducedMotion ? undefined : { x: captionX, y: captionY }}
        className="pointer-events-none absolute bottom-6 left-7 sm:left-9 text-[13px] font-medium text-[#6F86A3] tracking-wide select-none hidden sm:block z-20"
      >
        Garuda
      </motion.span>
      <motion.p
        style={prefersReducedMotion ? undefined : { x: captionX, y: captionY }}
        className="pointer-events-none absolute bottom-6 right-7 sm:right-9 max-w-[220px] text-right text-[13px] font-medium text-[#6F86A3] leading-relaxed select-none hidden sm:block z-20"
      >
        These cards outline the tools I build with.
      </motion.p>

      {/* Center Stage: Constant height reserved, tilting subtly towards pointer */}
      <div className="relative z-10 flex min-h-[560px] md:min-h-[580px] w-full flex-col items-center justify-center px-4 py-16 sm:px-8 sm:py-20 md:py-24">
        <motion.div
          role="tablist"
          aria-label="Skill categories"
          style={
            prefersReducedMotion
              ? undefined
              : {
                  rotateX,
                  rotateY,
                  transformPerspective: 1000,
                }
          }
          className="relative flex w-full max-w-[640px] flex-col items-center gap-[10px]"
        >
          {skillGroups.map((group, index) => {
            const isActive = index === activeIndex;
            const distance = Math.abs(index - activeIndex);
            const Icon = group.icon;

            // Width narrowing and opacity per depth level
            const pillWidthPercent = Math.max(76, 100 - distance * (isMobile ? 7 : 6));
            const pillOpacity = Math.max(0.72, 1 - distance * 0.08);

            if (isActive) {
              return (
                /* ─── Active Expanded Main Card ─── */
                <motion.div
                  layout
                  key={group.name}
                  id="about-main-panel"
                  role="tabpanel"
                  aria-labelledby={`tab-${group.name.toLowerCase().replace(/\s+/g, "-")}`}
                  transition={morphTransition}
                  initial={
                    !hasEntered
                      ? { scale: 0.94, opacity: 0 }
                      : false
                  }
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative z-10 w-full rounded-[28px] border border-white/[0.14] bg-gradient-to-br from-[#35577D] via-[#1E3250] to-[#141E30] p-5 sm:p-7 shadow-[0_20px_48px_rgba(4,9,18,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.4}
                  onDragStart={() => stopAutoplay()}
                  onDragEnd={(_, info) => {
                    stopAutoplay();
                    const threshold = 40;
                    const velocityThreshold = 300;
                    if (info.offset.y < -threshold || info.velocity.y < -velocityThreshold) {
                      nextGroup();
                    } else if (info.offset.y > threshold || info.velocity.y > velocityThreshold) {
                      prevGroup();
                    }
                  }}
                >
                  {/* Top Row: Group name + Progress Badge + Next Button */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <CurrentIcon size={20} className="shrink-0 text-[#8FB0D6]" />
                      <h3
                        id={`title-${group.name}`}
                        aria-live="polite"
                        className="text-[18px] font-semibold text-white tracking-tight"
                      >
                        {group.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Round 1/4 badge with animated SVG stroke-dashoffset ring */}
                      <div
                        aria-label={`Step ${activeIndex + 1} of ${total}`}
                        className="relative flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white/5"
                      >
                        <svg
                          className="absolute inset-0 -rotate-90 pointer-events-none"
                          width="36"
                          height="36"
                          viewBox="0 0 36 36"
                          aria-hidden="true"
                        >
                          <circle
                            cx="18"
                            cy="18"
                            r="15"
                            fill="none"
                            stroke="rgba(255,255,255,0.16)"
                            strokeWidth="2"
                          />
                          <motion.circle
                            cx="18"
                            cy="18"
                            r="15"
                            fill="none"
                            stroke="#8FB0D6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray={ringCircumference}
                            animate={{
                              strokeDashoffset:
                                ringCircumference * (1 - (activeIndex + 1) / total),
                            }}
                            transition={morphTransition}
                          />
                        </svg>
                        <span className="relative z-10 text-[12px] font-semibold text-white/90">
                          {activeIndex + 1}/{total}
                        </span>
                      </div>

                      {/* Next Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          stopAutoplay();
                          nextGroup();
                        }}
                        aria-label="Next skill group"
                        className="flex h-[36px] items-center gap-1.5 rounded-full border border-white/[0.18] bg-white/[0.08] px-3.5 text-[13px] font-medium text-white transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer"
                      >
                        <span>Next</span>
                        <ArrowRight size={14} className="stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  {/* Stat Row: Technologies count + Decorative Visual + Focus name */}
                  <div className="mt-5 sm:mt-6 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-medium uppercase tracking-wider text-[#9FB3CC]">
                        Technologies
                      </p>
                      <div className="mt-1">
                        <Odometer count={group.tools.length} />
                      </div>
                    </div>

                    {/* Decorative Route/Line Graphic (hidden <600px, plays once 0.9s ease-out) */}
                    <div className="hidden min-[600px]:flex items-center justify-center shrink-0 pointer-events-none select-none">
                      <AnimatePresence mode="wait">
                        {activeIndex === 0 && <FrontendVisual key="frontend" />}
                        {activeIndex === 1 && <BackendVisual key="backend" />}
                        {activeIndex === 2 && <DataVisual key="data" />}
                        {activeIndex === 3 && <ToolsVisual key="tools" />}
                      </AnimatePresence>
                    </div>

                    {/* Focus name sliding in with blur-in */}
                    <div className="text-right">
                      <p className="text-[12px] font-medium uppercase tracking-wider text-[#9FB3CC]">
                        Focus
                      </p>
                      <div className="relative overflow-hidden h-[36px] flex items-center justify-end">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.p
                            key={group.name}
                            initial={{ y: 10, opacity: 0, filter: "blur(6px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -6, opacity: 0, filter: "blur(4px)" }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="text-[24px] sm:text-[28px] font-semibold text-white leading-tight tracking-tight inline-block"
                          >
                            {group.name}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Slider with spring-gliding thumb and filled track */}
                  <div className="my-5 sm:my-6">
                    <div
                      ref={sliderTrackRef}
                      onClick={handleSliderClick}
                      role="slider"
                      aria-valuemin={1}
                      aria-valuemax={total}
                      aria-valuenow={activeIndex + 1}
                      aria-valuetext={group.name}
                      tabIndex={0}
                      onKeyDown={handleKeyDown}
                      className="relative h-[6px] w-full rounded-full bg-white/[0.12] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
                    >
                      {/* Filled track portion */}
                      <motion.div
                        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#5F86B0] to-[#8FB0D6]"
                        animate={{ width: `${progressPercent}%` }}
                        transition={morphTransition}
                      />

                      {/* Draggable Thumb */}
                      <motion.div
                        onMouseDown={handleThumbMouseDown}
                        className={`absolute -top-[6px] h-[18px] w-[18px] -translate-x-1/2 rounded-full bg-white shadow-[0_2px_8px_rgba(4,9,18,0.45)] cursor-grab ${
                          isDragging ? "cursor-grabbing scale-110" : ""
                        }`}
                        animate={{ left: `${progressPercent}%` }}
                        transition={morphTransition}
                      />
                    </div>

                    {/* 4 Category labels under track with 0.3s color transition */}
                    <div className="mt-3 flex items-center justify-between gap-1 text-[11px]">
                      {skillGroups.map((g, idx) => {
                        const isCurrent = idx === activeIndex;
                        return (
                          <button
                            key={g.name}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              stopAutoplay();
                              selectGroup(idx);
                            }}
                            className={`transition-colors duration-300 cursor-pointer text-left sm:text-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8FB0D6] rounded px-1 ${
                              isCurrent ? "font-semibold text-white" : "text-[#9FB3CC] hover:text-white"
                            }`}
                          >
                            {g.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Area: Left divider + Tag chips (40ms stagger) + Right 2 initials tiles */}
                  <div className="mt-5 sm:mt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Left accent divider bar */}
                      <div className="h-10 w-[2px] shrink-0 rounded-full bg-[#5F86B0]" aria-hidden="true" />

                      {/* Tag chips with 40ms stagger rising 8px scale 0.96->1 */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={group.name}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: {
                                staggerChildren: 0.04,
                                delayChildren: 0.06,
                              },
                            },
                            exit: {
                              opacity: 0,
                              transition: { duration: 0.15 },
                            },
                          }}
                          className="flex flex-wrap gap-2"
                        >
                          {group.tools.map((tool) => (
                            <motion.span
                              key={tool}
                              variants={{
                                hidden: { opacity: 0, y: 8, scale: 0.96 },
                                visible: {
                                  opacity: 1,
                                  y: 0,
                                  scale: 1,
                                  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                                },
                                exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
                              }}
                              className="inline-flex items-center rounded-full border border-white/[0.14] bg-white/[0.06] px-3 py-1.5 text-[12px] font-normal text-[#E8EEF7]"
                            >
                              {tool}
                            </motion.span>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Right: 2 small rounded square tiles showing first 2 tools initials */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={group.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="hidden sm:flex items-center gap-2.5 shrink-0 pl-2"
                      >
                        {group.initials.map((tile) => (
                          <div
                            key={tile.label}
                            title={tile.label}
                            className="flex h-[56px] w-[56px] flex-col items-center justify-center rounded-[14px] border border-white/[0.12] bg-white/[0.06] text-center shadow-sm backdrop-blur-sm transition-transform hover:scale-105"
                          >
                            <span className="text-[14px] font-bold text-white tracking-wide leading-none">
                              {tile.code}
                            </span>
                            <span className="mt-1 max-w-[48px] truncate text-[9px] font-medium text-[#8FB0D6] leading-none">
                              {tile.label}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            }

            /* ─── Collapsed Pill (Stacked Above or Below) ─── */
            return (
              <motion.div
                layout
                key={group.name}
                transition={morphTransition}
                initial={
                  !hasEntered
                    ? { y: 0, opacity: 0, scale: 0.9 }
                    : false
                }
                animate={{
                  y: 0,
                  opacity: pillOpacity,
                  scale: 1,
                }}
                className="flex w-full justify-center"
              >
                <motion.button
                  type="button"
                  role="tab"
                  id={`tab-${group.name.toLowerCase().replace(/\s+/g, "-")}`}
                  aria-selected={false}
                  aria-controls="about-main-panel"
                  aria-label={`Switch to ${group.name}`}
                  onClick={() => {
                    stopAutoplay();
                    selectGroup(index);
                  }}
                  whileHover={
                    !prefersReducedMotion
                      ? { y: -2, scale: 1.02, transition: { duration: 0.25, ease: "easeOut" } }
                      : undefined
                  }
                  whileTap={!prefersReducedMotion ? { scale: 0.97 } : undefined}
                  className="group flex h-[40px] md:h-[44px] items-center justify-between rounded-full border border-[rgba(143,176,214,0.2)] bg-[#0E1626] px-4 md:px-5 text-left transition-colors hover:border-[rgba(143,176,214,0.38)] hover:bg-[#141F33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6] cursor-pointer select-none"
                  style={{
                    width: `${pillWidthPercent}%`,
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={18}
                      className="shrink-0 text-[#8FB0D6] transition-colors group-hover:text-white"
                    />
                    <span className="text-[13px] md:text-[14px] font-medium text-white">
                      {group.name}
                    </span>
                  </div>
                  <span className="text-[12px] md:text-[13px] text-[#9FB3CC] font-normal">
                    {group.tools.length} tools
                  </span>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
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
