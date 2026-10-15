"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, AlertCircle } from "lucide-react";
import type { Project } from "@/data/projects";

interface ViewProjectLiquidButtonProps {
  project: Pick<Project, "title" | "slug"> & { liveUrl?: string };
  className?: string;
}

export function ViewProjectLiquidButton({
  project,
  className = "",
}: ViewProjectLiquidButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [travelDistance, setTravelDistance] = useState(142);

  const containerRef = useRef<HTMLButtonElement | null>(null);
  const orbRef = useRef<HTMLSpanElement | null>(null);
  const discRef = useRef<HTMLSpanElement | null>(null);
  const unavailableTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check system prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Measure exact pixel distance between the left orb and right arrow disc
  const measureDistance = useCallback(() => {
    if (orbRef.current && discRef.current) {
      const orbBox = orbRef.current.getBoundingClientRect();
      const discBox = discRef.current.getBoundingClientRect();
      const dist = discBox.left - orbBox.left;
      if (dist > 50) {
        setTravelDistance(dist);
      }
    }
  }, []);

  useEffect(() => {
    measureDistance();
    window.addEventListener("resize", measureDistance);
    return () => window.removeEventListener("resize", measureDistance);
  }, [measureDistance]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (unavailableTimerRef.current) {
        clearTimeout(unavailableTimerRef.current);
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Prevent multiple clicks while the animation is running
    if (isAnimating) return;

    measureDistance();
    const liveUrl = project.liveUrl;

    // Unavailable state: do not redirect, show feedback
    if (!liveUrl) {
      setIsUnavailable(true);
      if (unavailableTimerRef.current) clearTimeout(unavailableTimerRef.current);
      unavailableTimerRef.current = setTimeout(() => {
        setIsUnavailable(false);
      }, 2500);
      return;
    }

    // Available state: run animation then redirect
    setIsAnimating(true);

    if (prefersReducedMotion) {
      setTimeout(() => {
        window.location.href = liveUrl;
      }, 320);
      return;
    }

    // Premium liquid animation completes at ~800ms, then redirect to project.liveUrl
    setTimeout(() => {
      window.location.href = liveUrl;
    }, 820);
  };

  return (
    <motion.button
      ref={containerRef}
      type="button"
      onClick={handleClick}
      disabled={isAnimating}
      aria-label={
        isUnavailable
          ? "Live preview unavailable"
          : `View ${project.title} live project`
      }
      aria-busy={isAnimating}
      animate={
        isUnavailable
          ? { x: [0, -4, 4, -3, 3, -1, 1, 0], transition: { duration: 0.4 } }
          : isAnimating
          ? {
              scale: [1, 1, 1.025, 1],
              transition: { duration: 0.8, times: [0, 0.65, 0.82, 1] },
            }
          : { scale: 1, x: 0 }
      }
      whileHover={!isAnimating ? { y: -1 } : undefined}
      whileTap={!isAnimating ? { scale: 0.98 } : undefined}
      className={`btn-view-project group ${className}`.trim()}
    >
      {/* Top Half Glossy Highlight Pill */}
      <span className="btn-view-project__gloss" aria-hidden="true" />

      {/* Liquid Sheen Sweep (sweeps across on travel) */}
      <motion.span
        className="btn-view-project__sheen"
        aria-hidden="true"
        animate={
          isAnimating
            ? {
                left: ["-80%", "200%"],
                opacity: [0, 1, 1, 0],
                transition: { duration: 0.78, ease: "easeInOut" },
              }
            : { left: "-80%", opacity: 0 }
        }
      />

      {/* Liquid Wake & Refraction Wave (trails behind traveling orb) */}
      <motion.span
        className="btn-view-project__ripple"
        aria-hidden="true"
        animate={
          isAnimating
            ? {
                x: [0, travelDistance],
                scaleX: [0.6, 1.6, 1.3, 0.4],
                opacity: [0, 0.75, 0.45, 0],
                transition: {
                  duration: 0.78,
                  ease: [0.34, 1.2, 0.64, 1],
                },
              }
            : { x: 0, opacity: 0 }
        }
      />

      {/* LEFT: Blue Circular Play Button (Orb) */}
      <motion.span
        ref={orbRef}
        className="btn-view-project__orb"
        aria-hidden="true"
        animate={
          isAnimating
            ? {
                x: [0, travelDistance],
                scaleX: [1, 1.25, 1.15, 0.92, 1],
                scaleY: [1, 0.85, 0.92, 1.08, 1],
                boxShadow: [
                  "inset 0 1.5px 2px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,25,80,0.45), 0 2px 8px rgba(26,115,232,0.4)",
                  "inset 0 1.5px 2px rgba(255,255,255,0.95), inset 0 -2px 4px rgba(0,25,80,0.35), 0 0 26px rgba(47,139,255,0.9), 0 0 12px rgba(143,204,255,1)",
                  "inset 0 1.5px 2px rgba(255,255,255,0.95), inset 0 -2px 4px rgba(0,25,80,0.35), 0 0 28px rgba(47,139,255,0.95), 0 0 14px rgba(143,204,255,1)",
                  "inset 0 1.5px 2px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,25,80,0.45), 0 4px 16px rgba(26,115,232,0.5)",
                ],
                transition: {
                  duration: 0.78,
                  ease: [0.34, 1.2, 0.64, 1],
                },
              }
            : { x: 0, scaleX: 1, scaleY: 1 }
        }
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="h-[13px] w-[13px] fill-current ml-[1px]"
          animate={
            isAnimating
              ? {
                  opacity: [1, 0.9, 0.7, 1],
                  scale: [1, 0.95, 0.85, 1],
                  transition: { duration: 0.78, times: [0, 0.4, 0.75, 1] },
                }
              : { opacity: 1, scale: 1 }
          }
        >
          {/* Rounded play triangle */}
          <path d="M8 5.5v13a1 1 0 0 0 1.55.83l10-6.5a1 1 0 0 0 0-1.66l-10-6.5A1 1 0 0 0 8 5.5z" />
        </motion.svg>
      </motion.span>

      {/* CENTER: Text label or "Live preview unavailable" state */}
      <div className="btn-view-project__content">
        <AnimatePresence mode="wait">
          {isUnavailable ? (
            <motion.span
              key="unavailable"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2 }}
              className="btn-view-project__unavailable"
            >
              <AlertCircle size={13} className="shrink-0 text-amber-500" />
              <span>Live preview unavailable</span>
            </motion.span>
          ) : (
            <motion.span
              key="label"
              animate={
                isAnimating
                  ? {
                      opacity: [1, 0],
                      x: [0, 10],
                      filter: ["blur(0px)", "blur(4px)"],
                      transition: { duration: 0.26, ease: "easeOut" },
                    }
                  : { opacity: 1, x: 0, filter: "blur(0px)" }
              }
              className="btn-view-project__label"
            >
              View project
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT: Circular Arrow Button */}
      <span ref={discRef} className="btn-view-project__disc" aria-hidden="true">
        <motion.span
          className="flex items-center justify-center"
          animate={
            isAnimating
              ? {
                  rotate: [0, 0, 45, 90, 45],
                  scale: [1, 1, 1.25, 1],
                  color: ["#14264A", "#14264A", "#1B6DF5", "#14264A"],
                  transition: {
                    duration: 0.8,
                    times: [0, 0.45, 0.72, 0.88, 1],
                    ease: "easeInOut",
                  },
                }
              : { rotate: 0, scale: 1, color: "#14264A" }
          }
        >
          <ArrowUpRight size={15} strokeWidth={2.4} />
        </motion.span>
      </span>
    </motion.button>
  );
}
