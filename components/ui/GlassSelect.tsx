"use client";

import React, {
  useCallback,
  useEffect,
  useId,
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
  const [recentlySelected, setRecentlySelected] = useState(false);

  // Drag-to-dismiss states
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef(0);
  const dragStartTimeRef = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  const titleText = sheetTitle || label || placeholder;
  const subtitleText =
    sheetSubtitle || (allowClear ? "Select your budget range" : "Choose the option that fits best");

  // Selected option item
  const selectedOption = options.find((opt) => opt.value === value || opt.label === value);

  // Hydration & viewport detection (< 900px is mobile bottom sheet)
  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(max-width: 899px)");
    const updateMobile = () => setIsMobile(mediaQuery.matches);
    updateMobile();
    mediaQuery.addEventListener("change", updateMobile);
    return () => mediaQuery.removeEventListener("change", updateMobile);
  }, []);

  // Sync highlighted index when opened
  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex((opt) => opt.value === value || opt.label === value);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, options, value]);

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

  // Click outside to close (desktop)
  useEffect(() => {
    if (!isOpen || isMobile) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isMobile, onBlur]);

  // Close helper returning focus to trigger
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setDragY(0);
    setIsDragging(false);
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

  // Option selection handler
  const handleSelect = (option: GlassOption) => {
    // Light tactile haptic vibration where supported
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

    // 220ms delay on mobile so user sees the shared lozenge glide and radio check pop in
    if (isMobile) {
      setTimeout(() => {
        handleClose();
      }, 220);
    } else {
      setTimeout(() => {
        handleClose();
      }, 160);
    }
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
    }, 180);
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
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      }
      case "Home": {
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      }
      case "End": {
        e.preventDefault();
        setHighlightedIndex(options.length - 1);
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelect(options[highlightedIndex]);
        }
        break;
      }
      case "Tab": {
        handleClose();
        break;
      }
      default: {
        // Type-ahead by single key character
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const char = e.key.toLowerCase();
          const matchIdx = options.findIndex((opt) =>
            opt.label.toLowerCase().startsWith(char)
          );
          if (matchIdx >= 0) {
            setHighlightedIndex(matchIdx);
          }
        }
        break;
      }
    }
  };

  // Touch drag-to-dismiss gesture handling
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
      // Damped rubber-band downward drag
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

    // Velocity flick or distance threshold (> 70px or velocity > 0.5)
    if (dragY > 70 || velocity > 0.5) {
      handleClose();
    }
    setDragY(0);
  };

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
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
        animate={
          recentlySelected && !prefersReducedMotion
            ? { scale: [1, 1.015, 1], transition: { duration: 0.3 } }
            : {}
        }
        className={`${styles.trigger} ${hasError ? styles.triggerError : ""}`}
      >
        <div className={styles.triggerContent}>
          {TriggerIcon && (
            <div className={styles.triggerIconTile} aria-hidden="true">
              <TriggerIcon size={16} strokeWidth={2.2} />
            </div>
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
                    ? { duration: 0.2 }
                    : { duration: 0.3, ease: "easeOut" }
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
                          : { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
                      }
                }
                exit={
                  prefersReducedMotion
                    ? { opacity: 0, transition: { duration: 0.2 } }
                    : { y: "100%", transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } }
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

                {/* Staggered Options List */}
                <div
                  ref={listRef}
                  className={styles.optionsList}
                  role="radiogroup"
                  aria-labelledby={`${id}-sheet-title`}
                  onKeyDown={handleKeyDown}
                >
                  {options.map((opt, idx) => {
                    const isSelected = opt.value === value || opt.label === value;
                    const Icon = opt.icon;

                    return (
                      <motion.button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={isSelected ? 0 : -1}
                        onClick={() => handleSelect(opt)}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                        initial={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: 8 }
                        }
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : {
                                opacity: 1,
                                y: 0,
                                transition: {
                                  delay: Math.min(idx * 0.03, 0.24),
                                  duration: 0.35,
                                  ease: [0.22, 1, 0.36, 1],
                                },
                              }
                        }
                        className={styles.optionCard}
                      >
                        {/* Shared lozenge selection indicator glides between options */}
                        {isSelected && (
                          <motion.div
                            layoutId={`glass-select-highlight-${id}`}
                            className={styles.selectedLozenge}
                            transition={
                              prefersReducedMotion
                                ? { duration: 0 }
                                : { type: "spring", stiffness: 380, damping: 30 }
                            }
                          />
                        )}

                        <div className={styles.optionLeft}>
                          {Icon && (
                            <div className={styles.iconTile} aria-hidden="true">
                              <Icon size={20} strokeWidth={2.2} />
                            </div>
                          )}
                          <div className={styles.optionText}>
                            <span className={styles.optionTitle}>{opt.label}</span>
                            {opt.hint && <span className={styles.optionHint}>{opt.hint}</span>}
                          </div>
                        </div>

                        <div className={styles.optionRight}>
                          {isSelected ? (
                            <motion.div
                              className={styles.checkCircle}
                              initial={prefersReducedMotion ? false : { scale: 0.4, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 420, damping: 24 }}
                            >
                              <Check size={14} strokeWidth={3} />
                            </motion.div>
                          ) : (
                            <div className={styles.ringIndicator} />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}

                  {/* Footnote for Budget or details */}
                  {footnote && <p className={styles.footnote}>{footnote}</p>}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ====================================================================
          DESKTOP POPOVER (>= 900px)
          ==================================================================== */}
      {!isMobile && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={styles.popover}
              role="dialog"
              aria-modal="false"
              aria-label={titleText}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, y: -6 }
              }
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
              }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.97, y: -4, transition: { duration: 0.18 } }
              }
            >
              <div
                className={styles.popoverList}
                role="radiogroup"
                aria-label={titleText}
                onKeyDown={handleKeyDown}
              >
                {options.map((opt, idx) => {
                  const isSelected = opt.value === value || opt.label === value;
                  const Icon = opt.icon;

                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => handleSelect(opt)}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                      className={`${styles.optionCard} ${styles.desktopCard}`}
                    >
                      {/* Shared lozenge selection indicator glides between options */}
                      {isSelected && (
                        <motion.div
                          layoutId={`glass-select-highlight-${id}`}
                          className={styles.selectedLozenge}
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 380, damping: 30 }
                          }
                        />
                      )}

                      <div className={styles.optionLeft}>
                        {Icon && (
                          <div className={styles.iconTile} aria-hidden="true">
                            <Icon size={16} strokeWidth={2.2} />
                          </div>
                        )}
                        <div className={styles.optionText}>
                          <span className={styles.optionTitle}>{opt.label}</span>
                          {opt.hint && <span className={styles.optionHint}>{opt.hint}</span>}
                        </div>
                      </div>

                      <div className={styles.optionRight}>
                        {isSelected ? (
                          <motion.div
                            className={styles.checkCircle}
                            initial={prefersReducedMotion ? false : { scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 420, damping: 24 }}
                          >
                            <Check size={12} strokeWidth={3} />
                          </motion.div>
                        ) : (
                          <div className={styles.ringIndicator} />
                        )}
                      </div>
                    </motion.button>
                  );
                })}

                {/* Footnote for Budget or details */}
                {footnote && <p className={styles.desktopFootnote}>{footnote}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
