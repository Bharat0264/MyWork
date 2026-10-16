"use client";

import { useEffect, useRef, useState } from "react";
import { Clock3, ScanLine, Smartphone, Gauge, MessagesSquare, RefreshCw, HeartHandshake, Check } from "lucide-react";

// Edit the promises here; the cards, dots, and labels update together.
const commitments = [
  { title: "On-time delivery", promise: "We agree on a deadline and stick to it.", tag: "Commitment", icon: Clock3 },
  { title: "Pixel-perfect quality", promise: "Every spacing, font and color is checked before launch.", tag: "Quality", icon: ScanLine },
  { title: "Mobile-first", promise: "Optimized on real phones so you look great on every device.", tag: "User Experience", icon: Smartphone },
  { title: "Fast and SEO-ready", promise: "Built for speed so customers and Google both stay.", tag: "Performance", icon: Gauge },
  { title: "Clear Communication", promise: "Regular updates, simple process, no surprises.", tag: "Collaboration", icon: MessagesSquare },
  { title: "Free revisions", promise: "We keep improving until you are happy.", tag: "Satisfaction", icon: RefreshCw },
  { title: "After-launch support", promise: "We stay with you after the website goes live.", tag: "Care", icon: HeartHandshake },
] as const;

const AUTOPLAY_MS = 3500;

export function CommitmentSlider() {
  const [active, setActive] = useState(3);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((index) => (index + 1) % commitments.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const onTouchEnd = (x: number) => {
    if (touchX.current !== null) {
      const delta = x - touchX.current;
      if (Math.abs(delta) > 30) {
        setActive((index) => (index + (delta < 0 ? 1 : commitments.length - 1)) % commitments.length);
      }
    }
    touchX.current = null;
    setPaused(false);
  };

  return (
    <div
      className="commitment-slider"
      aria-label="Our commitments"
      onMouseEnter={() => { if (window.matchMedia("(hover: hover)").matches) setPaused(true); }}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
    >
      <div
        className="commitment-frame"
        onTouchStart={(event) => { touchX.current = event.touches[0].clientX; setPaused(true); }}
        onTouchEnd={(event) => onTouchEnd(event.changedTouches[0].clientX)}
        onTouchCancel={() => { touchX.current = null; setPaused(false); }}
      >
        <div className="commitment-glow" aria-hidden="true" />
        <div className="commitment-stage">
          {commitments.map((item, index) => {
            const raw = (index - active + commitments.length) % commitments.length;
            const offset = raw > Math.floor(commitments.length / 2) ? raw - commitments.length : raw;
            const visible = Math.abs(offset) <= 1;
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                type="button"
                className="commitment-card"
                data-position={offset}
                data-active={offset === 0}
                aria-label={`Show ${item.title} commitment`}
                aria-pressed={offset === 0}
                tabIndex={visible ? 0 : -1}
                onClick={() => setActive(index)}
                style={{
                  opacity: visible ? (offset === 0 ? 1 : 0.92) : 0,
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                <span className="commitment-promise-pill"><span className="commitment-pulse" />Promise</span>
                <span className="commitment-icon"><Icon size={36} strokeWidth={1.5} aria-hidden="true" /></span>
                <span className="commitment-card-title">{item.title}</span>
                <span className="commitment-card-copy">{item.promise}</span>
                <span className="commitment-card-bottom">
                  <span className="commitment-tag">{item.tag}</span>
                  {offset === 0 && <span className="commitment-check" key={active} aria-hidden="true"><Check size={15} strokeWidth={2.4} /></span>}
                </span>
              </button>
            );
          })}
        </div>
        <span className="commitment-frame-label">Design × Technology</span>
      </div>
      <div className="commitment-dots" aria-label="Choose a commitment">
        {commitments.map((item, index) => (
          <button key={item.title} type="button" aria-label={`Show ${item.title}`} aria-pressed={active === index} onClick={() => setActive(index)}>
            <span data-active={active === index} />
          </button>
        ))}
      </div>
    </div>
  );
}
