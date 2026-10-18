"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, X } from "lucide-react";
import styles from "./glass-select.module.css";

export interface GlassOption {
  value: string;
  label: string;
  hint?: string;
  icon?: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

export interface GlassSelectProps {
  id: string;
  name: string;
  label?: string;
  labelledBy?: string;
  value: string;
  onChange: (value: string) => void;
  options: GlassOption[];
  placeholder?: string;
  required?: boolean;
  hasError?: boolean;
  sheetTitle?: string;
  sheetSubtitle?: string;
  footnote?: string;
  allowClear?: boolean;
  onBlur?: () => void;
}

export function GlassSelect({
  id,
  name,
  label,
  labelledBy,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  hasError = false,
  sheetTitle,
  sheetSubtitle,
  footnote,
  allowClear = false,
  onBlur,
}: GlassSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [recentlySelected, setRecentlySelected] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Trigger position for fixed portal positioning on desktop
  const [triggerRect, setTriggerRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    bottom: number;
  } | null>(null);

  // Drag-to-dismiss states on mobile
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef(0);
  const dragStartTimeRef = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  const titleText = sheetTitle || label || placeholder;
  const subtitleText =
    sheetSubtitle || (allowClear ? "Select your budget range" : "Choose the option that fits best");

  // Selected option item & index
  const selectedIndex = options.findIndex((opt) => opt.value === value || opt.label === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  // Hydration & viewport detection (< 900px is mobile bottom sheet)
  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(max-width: 899px)");
    const updateMobile = () => setIsMobile(mediaQuery.matches);
    updateMobile();
    mediaQuery.addEventListener("change", updateMobile);
    return () => mediaQuery.removeEventListener("change", updateMobile);
  }, []);

  // Compute trigger coordinates on desktop and determine if flipped
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setTriggerRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
    });

    const GAP = 8;
    const PADDING = 16;
    // Estimated or measured height
    const panelHeight = popoverRef.current ? popoverRef.current.offsetHeight : options.length * 47 + 24;
    const spaceBelow = window.innerHeight - rect.bottom - GAP - PADDING;
    const spaceAbove = rect.top - GAP - PADDING;

    if (spaceBelow < panelHeight && spaceAbove > spaceBelow) {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  }, [options.length]);

  useEffect(() => {
    if (!isOpen || isMobile) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, isMobile, updatePosition]);

  // Sync highlighted index when opened
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      setHoveredIndex(null);
    }
  }, [isOpen, selectedIndex]);

  // Handle scroll lock & tab bar hide on mobile
  useEffect(() => {
    if (!isOpen || !isMobile) return;

    scrollPositionRef.current = window.scrollY;
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.setAttribute("data-glass-sheet-open", "true");

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.removeAttribute("data-glass-sheet-open");
      window.scrollTo(0, scrollPositionRef.current);
    };
  }, [isOpen, isMobile]);

  // Close helper returning focus to trigger
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setDragY(0);
    setIsDragging(false);
    setHoveredIndex(null);
    onBlur?.();
    triggerRef.current?.focus();
  }, [onBlur]);

  // Global escape key handler
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Option selection handler with 160ms timing
  const handleSelect = (option: GlassOption) => {
    if (!prefersReducedMotion && typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // Safe ignore
      }
    }

    onChange(option.value);

    // Brief animation trigger for field
    setRecentlySelected(true);
    setTimeout(() => setRecentlySelected(false), 350);

    // 160ms delay as specified: checkmark pops, panel closes after 160ms
    setTimeout(() => {
      handleClose();
    }, 160);
  };

  // Clear handler for optional field
  const handleClear = () => {
    if (!prefersReducedMotion && typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // Safe ignore
      }
    }
    onChange("");
    setRecentlySelected(true);
    setTimeout(() => setRecentlySelected(false), 350);
    setTimeout(() => {
      handleClose();
    }, 160);
  };

  // Keyboard navigation & type-ahead
  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % options.length);
        setHoveredIndex(null);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        setHoveredIndex(null);
        break;
      }
      case "Home": {
        e.preventDefault();
        setHighlightedIndex(0);
        setHoveredIndex(null);
        break;
      }
      case "End": {
        e.preventDefault();
        setHighlightedIndex(options.length - 1);
        setHoveredIndex(null);
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        const activeIdx = hoveredIndex !== null ? hoveredIndex : highlightedIndex;
        if (activeIdx >= 0 && activeIdx < options.length) {
          handleSelect(options[activeIdx]);
        }
        break;
      }
      case "Tab": {
        handleClose();
        break;
      }
      default: {
        // Type-ahead by single character
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const char = e.key.toLowerCase();
          const matchIdx = options.findIndex((opt) =>
            opt.label.toLowerCase().startsWith(char)
          );
          if (matchIdx >= 0) {
            setHighlightedIndex(matchIdx);
            setHoveredIndex(null);
          }
        }
        break;
      }
    }
  };

  // Mobile drag-to-dismiss gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (listRef.current && listRef.current.scrollTop > 5) return;
    dragStartYRef.current = e.touches[0].clientY;
    dragStartTimeRef.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const delta = currentY - dragStartYRef.current;
    if (delta > 0) {
      setDragY(delta);
    } else {
      setDragY(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const duration = Date.now() - dragStartTimeRef.current;
    const velocity = dragY / Math.max(duration, 1);

    if (dragY > 70 || velocity > 0.5) {
      handleClose();
    }
    setDragY(0);
  };

  // Compute active highlight index for shared lozenge
  const activeHighlightIndex =
    hoveredIndex !== null
      ? hoveredIndex
      : highlightedIndex >= 0
      ? highlightedIndex
      : selectedIndex >= 0
      ? selectedIndex
      : -1;

  // Compute desktop popover fixed coordinates
  const PADDING = 16;
  const GAP = 8;
  const panelWidth = triggerRect ? Math.max(triggerRect.width, 280) : 280;

  let computedLeft = triggerRect ? triggerRect.left : 0;
  if (typeof window !== "undefined") {
    if (computedLeft + panelWidth > window.innerWidth - PADDING) {
      computedLeft = window.innerWidth - PADDING - panelWidth;
    }
    if (computedLeft < PADDING) {
      computedLeft = PADDING;
    }
  }

  let computedTop = 0;
  if (triggerRect) {
    const panelHeight = popoverRef.current ? popoverRef.current.offsetHeight : options.length * 47 + 24;
    computedTop = isFlipped
      ? Math.max(PADDING, triggerRect.top - GAP - panelHeight)
      : triggerRect.bottom + GAP;
  }

  const TriggerIcon = selectedOption?.icon;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Visually hidden native <select> kept in sync for form autofill, submit, and validation */}
      <select
        name={name}
        id={`${id}-native`}
        value={value}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => onChange(e.target.value)}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: "1px",
          height: "1px",
          margin: "-1px",
          border: 0,
          padding: 0,
          clip: "rect(0 0 0 0)",
          overflow: "hidden",
        }}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Closed Field Trigger (Glass Pill 56px, radius 18px) */}
      <motion.button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-labelledby={labelledBy ? `${labelledBy} ${id}` : id}
        aria-required={required}
        aria-invalid={hasError}
        onClick={() => {
          updatePosition();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={handleKeyDown}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
        animate={
          recentlySelected && !prefersReducedMotion
            ? { scale: [1, 1.015, 1], transition: { duration: 0.25 } }
            : {}
        }
        className={`${styles.trigger} ${hasError ? styles.triggerError : ""}`}
      >
        <div className={styles.triggerContent}>
          {TriggerIcon && (
            <span className={styles.triggerPlainIcon} aria-hidden="true">
              <TriggerIcon size={19} strokeWidth={1.8} />
            </span>
          )}
          <span className={value ? styles.triggerText : styles.triggerPlaceholder}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          aria-hidden="true"
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
        />
      </motion.button>

      {/* ====================================================================
          MOBILE BOTTOM SHEET (< 900px)
          ==================================================================== */}
      {isMobile && mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div
              className={styles.backdrop}
              onClick={handleClose}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${id}-sheet-title`}
            >
              {/* Animated Backdrop Blur & Tint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 - Math.min(dragY / 260, 0.7) }}
                exit={{ opacity: 0 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.15 }
                    : { duration: 0.25, ease: "easeOut" }
                }
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                }}
              />

              {/* Bottom Sheet Modal */}
              <motion.div
                className={styles.sheet}
                onClick={(e) => e.stopPropagation()}
                initial={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : {
                        y: dragY > 0 ? dragY : 0,
                        transition: isDragging
                          ? { duration: 0 }
                          : { duration: 0.45, ease: [0.32, 0.72, 0, 1] },
                      }
                }
                exit={
                  prefersReducedMotion
                    ? { opacity: 0, transition: { duration: 0.18 } }
                    : { y: "100%", transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] } }
                }
              >
                {/* Grabber Area for Drag-to-dismiss */}
                <div
                  className={styles.grabberArea}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  aria-hidden="true"
                >
                  <div className={styles.grabber} />
                </div>

                {/* Sheet Header */}
                <div
                  className={styles.header}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className={styles.headerInfo}>
                    <h2 id={`${id}-sheet-title`} className={styles.headerTitle}>
                      {titleText}
                    </h2>
                    <p className={styles.headerSubtitle}>{subtitleText}</p>
                  </div>
                  <div className={styles.headerActions}>
                    {allowClear && Boolean(value) && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className={styles.clearBtn}
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleClose}
                      aria-label="Close"
                      className={styles.closeBtn}
                    >
                      <X size={18} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>

                {/* Mobile Flat Rows List */}
                <div
                  ref={listRef}
                  className={styles.sheetOptionsList}
                  role="radiogroup"
                  aria-labelledby={`${id}-sheet-title`}
                  onKeyDown={handleKeyDown}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {options.map((opt, idx) => {
                    const isSelected = opt.value === value || opt.label === value;
                    const isHighlighted = activeHighlightIndex === idx;
                    const Icon = opt.icon;

                    return (
                      <div key={opt.value} className={styles.rowItemWrapper}>
                        <motion.button
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={isSelected ? 0 : -1}
                          onClick={() => handleSelect(opt)}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                          className={styles.mobileRowButton}
                        >
                          {/* Shared glass lozenge highlight */}
                          {isHighlighted && (
                            <motion.div
                              layoutId={`glass-row-mobile-highlight-${id}`}
                              className={styles.rowHighlight}
                              transition={
                                prefersReducedMotion
                                  ? { duration: 0 }
                                  : { type: "spring", stiffness: 420, damping: 30, mass: 0.8 }
                              }
                            />
                          )}

                          <div className={styles.rowLeft}>
                            {Icon && (
                              <span className={styles.rowIcon} aria-hidden="true">
                                <Icon size={20} strokeWidth={1.8} />
                              </span>
                            )}
                            <div className={styles.mobileRowText}>
                              <span
                                className={`${styles.mobileRowTitle} ${
                                  isSelected ? styles.mobileRowTitleSelected : ""
                                }`}
                              >
                                {opt.label}
                              </span>
                              {opt.hint && (
                                <span className={styles.mobileRowHint}>{opt.hint}</span>
                              )}
                            </div>
                          </div>

                          <div className={styles.rowRight}>
                            {isSelected && (
                              <motion.span
                                className={styles.checkIcon}
                                initial={prefersReducedMotion ? false : { scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                              >
                                <Check size={17} strokeWidth={2.4} />
                              </motion.span>
                            )}
                          </div>
                        </motion.button>

                        {/* Hairline separator between rows, hidden adjacent to highlighted row */}
                        {idx < options.length - 1 && (
                          <div
                            className={styles.hairlineSeparator}
                            style={{
                              opacity:
                                activeHighlightIndex === idx || activeHighlightIndex === idx + 1
                                  ? 0
                                  : 1,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Footnote for Budget or details */}
                  {footnote && <p className={styles.sheetFootnote}>{footnote}</p>}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ====================================================================
          DESKTOP POPOVER (>= 900px) - Rendered via Portal into document.body
          ==================================================================== */}
      {!isMobile && mounted && createPortal(
        <AnimatePresence>
          {isOpen && triggerRect && (
            <>
              {/* 1. Fixed overlay (blur 6px) that fades in 0.25s like iOS */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={styles.desktopOverlay}
                onClick={handleClose}
              />

              {/* 2. Raised trigger above overlay (z-index: 95) so it stays sharp */}
              <div
                className={`${styles.trigger} ${styles.raisedTrigger} ${hasError ? styles.triggerError : ""}`}
                style={{
                  top: triggerRect.top,
                  left: triggerRect.left,
                  width: triggerRect.width,
                  height: triggerRect.height,
                }}
                onClick={handleClose}
                aria-hidden="true"
              >
                <div className={styles.triggerContent}>
                  {TriggerIcon && (
                    <span className={styles.triggerPlainIcon}>
                      <TriggerIcon size={19} strokeWidth={1.8} />
                    </span>
                  )}
                  <span className={value ? styles.triggerText : styles.triggerPlaceholder}>
                    {selectedOption ? selectedOption.label : placeholder}
                  </span>
                </div>
                <ChevronDown
                  aria-hidden="true"
                  className={`${styles.chevron} ${styles.chevronOpen}`}
                />
              </div>

              {/* 3. The Glass Popover Panel (z-index: 100) */}
              <motion.div
                ref={popoverRef}
                className={styles.popover}
                role="dialog"
                aria-modal="true"
                aria-label={titleText}
                style={{
                  top: computedTop,
                  left: computedLeft,
                  width: panelWidth,
                  minWidth: panelWidth,
                  transformOrigin: isFlipped ? "bottom right" : "top right",
                }}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.85,
                        y: isFlipped ? 6 : -6,
                      }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: prefersReducedMotion
                    ? { duration: 0.15 }
                    : { duration: 0.38, ease: [0.2, 0.9, 0.25, 1.12] },
                }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.96,
                        transition: { duration: 0.18, ease: "easeIn" },
                      }
                }
              >
                <div
                  className={styles.popoverList}
                  role="radiogroup"
                  aria-label={titleText}
                  onKeyDown={handleKeyDown}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {options.map((opt, idx) => {
                    const isSelected = opt.value === value || opt.label === value;
                    const isHighlighted = activeHighlightIndex === idx;
                    const Icon = opt.icon;

                    return (
                      <div key={opt.value} className={styles.rowItemWrapper}>
                        <motion.button
                          key={opt.value}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={isSelected ? 0 : -1}
                          onClick={() => handleSelect(opt)}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                          className={styles.rowButton}
                        >
                          {/* Shared glass lozenge highlight */}
                          {isHighlighted && (
                            <motion.div
                              layoutId={`glass-row-desktop-highlight-${id}`}
                              className={styles.rowHighlight}
                              transition={
                                prefersReducedMotion
                                  ? { duration: 0 }
                                  : { type: "spring", stiffness: 420, damping: 30, mass: 0.8 }
                              }
                            />
                          )}

                          <div className={styles.rowLeft}>
                            {Icon && (
                              <span className={styles.rowIcon} aria-hidden="true">
                                <Icon size={20} strokeWidth={1.8} />
                              </span>
                            )}
                            <span
                              className={`${styles.rowLabel} ${
                                isSelected ? styles.rowLabelSelected : ""
                              }`}
                            >
                              {opt.label}
                            </span>
                          </div>

                          <div className={styles.rowRight}>
                            {isSelected && (
                              <motion.span
                                className={styles.checkIcon}
                                initial={
                                  prefersReducedMotion ? false : { scale: 0.4, opacity: 0 }
                                }
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                              >
                                <Check size={17} strokeWidth={2.4} />
                              </motion.span>
                            )}
                          </div>
                        </motion.button>

                        {/* Hairline separator between rows, hidden adjacent to highlighted row */}
                        {idx < options.length - 1 && (
                          <div
                            className={styles.hairlineSeparator}
                            style={{
                              opacity:
                                activeHighlightIndex === idx || activeHighlightIndex === idx + 1
                                  ? 0
                                  : 1,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Footnote for Budget or details */}
                  {footnote && (
                    <>
                      <div className={styles.hairlineSeparator} />
                      <div className={styles.popoverFootnote}>{footnote}</div>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
