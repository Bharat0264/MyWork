"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  Monitor,
  Code2,
  RefreshCw,
  Layout,
  PenTool,
  Cpu,
  MoreHorizontal,
  X,
} from "lucide-react";
import styles from "./liquid-glass-service-picker.module.css";

export interface ServiceItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  color: string;
  bgTint: string;
  borderTint: string;
}

export const LIQUID_GLASS_SERVICES: ServiceItem[] = [
  {
    id: "website-design",
    name: "Website Design",
    icon: Monitor,
    color: "#38BDF8",
    bgTint: "rgba(56, 189, 248, 0.14)",
    borderTint: "rgba(56, 189, 248, 0.32)",
  },
  {
    id: "website-development",
    name: "Website Development",
    icon: Code2,
    color: "#818CF8",
    bgTint: "rgba(129, 140, 248, 0.14)",
    borderTint: "rgba(129, 140, 248, 0.32)",
  },
  {
    id: "redesign",
    name: "Redesign",
    icon: RefreshCw,
    color: "#34D399",
    bgTint: "rgba(52, 211, 153, 0.14)",
    borderTint: "rgba(52, 211, 153, 0.32)",
  },
  {
    id: "landing-page",
    name: "Landing Page",
    icon: Layout,
    color: "#FBBF24",
    bgTint: "rgba(251, 191, 36, 0.14)",
    borderTint: "rgba(251, 191, 36, 0.32)",
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    icon: PenTool,
    color: "#F472B6",
    bgTint: "rgba(244, 114, 182, 0.14)",
    borderTint: "rgba(244, 114, 182, 0.32)",
  },
  {
    id: "ai-integration",
    name: "AI Integration",
    icon: Cpu,
    color: "#60A5FA",
    bgTint: "rgba(96, 165, 250, 0.16)",
    borderTint: "rgba(96, 165, 250, 0.36)",
  },
  {
    id: "something-else",
    name: "Something else",
    icon: MoreHorizontal,
    color: "#CBD5E1",
    bgTint: "rgba(203, 213, 225, 0.14)",
    borderTint: "rgba(203, 213, 225, 0.28)",
  },
];

interface LiquidGlassServicePickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: string;
  onSelectService: (serviceName: string) => void;
}

export function LiquidGlassServicePicker({
  isOpen,
  onClose,
  selectedService,
  onSelectService,
}: LiquidGlassServicePickerProps) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const startYRef = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const cardsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll while open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Swipe-down on mobile to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow swipe down if the cards list is scrolled to the top
    if (cardsListRef.current && cardsListRef.current.scrollTop > 5) {
      return;
    }
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const delta = currentY - startYRef.current;
    if (delta > 0) {
      // Damped downward drag
      setDragY(delta);
    } else {
      setDragY(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 80) {
      onClose();
    }
    setDragY(0);
  };

  const handleSelect = useCallback(
    (name: string) => {
      onSelectService(name);
      // Brief spring delay so the user sees the active selection highlight before closing
      setTimeout(() => {
        onClose();
      }, 260);
    },
    [onSelectService, onClose]
  );

  const handleListKeyDown = (e: ReactKeyboardEvent) => {
    const currentIndex = LIQUID_GLASS_SERVICES.findIndex(
      (s) => s.name === selectedService
    );

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % LIQUID_GLASS_SERVICES.length;
      onSelectService(LIQUID_GLASS_SERVICES[nextIndex].name);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex =
        (currentIndex - 1 + LIQUID_GLASS_SERVICES.length) %
        LIQUID_GLASS_SERVICES.length;
      onSelectService(LIQUID_GLASS_SERVICES[prevIndex].name);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="liquid-glass-service-title"
      aria-describedby="liquid-glass-service-desc"
    >
      <div
        ref={sheetRef}
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? "none" : undefined,
        }}
      >
        {/* Subtle chromatic light refractions around edges (blue, purple, pink, orange) */}
        <div className={styles.chromaticRefraction} aria-hidden="true" />

        {/* Specular glass reflection sheen */}
        <div className={styles.specularSheen} aria-hidden="true" />

        {/* Mobile Horizontal Drag Handle */}
        <div className={styles.dragHandleContainer} aria-hidden="true">
          <div className={styles.dragHandle} />
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTextGroup}>
            <h2 id="liquid-glass-service-title" className={styles.title}>
              Choose a service
            </h2>
            <p id="liquid-glass-service-desc" className={styles.subtitle}>
              Select the service you&apos;re interested in
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close service selector"
            className={styles.closeButton}
          >
            <X size={17} />
          </button>
        </div>

        {/* Service Options Cards List */}
        <div
          ref={cardsListRef}
          className={styles.cardsList}
          role="radiogroup"
          aria-labelledby="liquid-glass-service-title"
          tabIndex={0}
          onKeyDown={handleListKeyDown}
        >
          {LIQUID_GLASS_SERVICES.map((item) => {
            const isSelected = selectedService === item.name;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleSelect(item.name)}
                className={`${styles.card} ${
                  isSelected ? styles.cardSelected : ""
                }`}
              >
                <div className={styles.cardLeft}>
                  {/* Translucent rounded-square icon container */}
                  <div
                    className={styles.iconContainer}
                    style={{
                      background: item.bgTint,
                      borderColor: item.borderTint,
                      color: item.color,
                    }}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  {/* Service name */}
                  <span className={styles.serviceName}>{item.name}</span>
                </div>

                {/* Clean circular radio button */}
                <div
                  className={`${styles.radioButton} ${
                    isSelected ? styles.radioButtonSelected : ""
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <span className={styles.radioDot} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Section with subtle divider and close action */}
        <div className={styles.bottomSection}>
          <div className={styles.divider} />
          <div className={styles.bottomActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            {selectedService && (
              <button
                type="button"
                onClick={onClose}
                className={styles.doneButton}
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
