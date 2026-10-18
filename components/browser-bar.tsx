"use client";

import { useState, useEffect, useRef } from "react";
import { Lock } from "lucide-react";

interface BrowserBarProps {
  domain: string;
  className?: string;
}

/**
 * Formats a domain string using middle ellipsis, keeping the domain beginning
 * and ending suffix (e.g. .vercel.app, .onrender.com, .co.in) visible.
 */
export function formatDomainWithMiddleEllipsis(domain: string, targetLength: number): string {
  if (domain.length <= targetLength || targetLength < 7) {
    return domain;
  }

  // Match known platform / multi-part suffixes or standard TLDs
  const knownMatch = domain.match(
    /(\.(?:vercel\.app|onrender\.com|co\.in|github\.io|[a-z0-9-]+\.[a-z]{2,}))$/i
  );
  let suffix = knownMatch ? knownMatch[1] : "";

  // If suffix is too long to leave at least 3 characters for the prefix + 1 for ellipsis:
  if (!suffix || suffix.length >= targetLength - 3) {
    const lastDot = domain.lastIndexOf(".");
    if (lastDot !== -1 && domain.length - lastDot < targetLength - 3) {
      suffix = domain.slice(lastDot);
    } else {
      const suffixLen = Math.max(3, Math.floor((targetLength - 1) / 3));
      suffix = domain.slice(-suffixLen);
    }
  }

  // Clean leading dot so ellipsis replaces it cleanly without double-dotting (e.g. rainbow…vercel.app)
  const cleanSuffix = suffix.startsWith(".") ? suffix.slice(1) : suffix;
  const prefixLen = Math.max(2, targetLength - 1 - cleanSuffix.length);
  const prefix = domain.slice(0, prefixLen);
  return `${prefix}…${cleanSuffix}`;
}

export function BrowserBar({ domain, className = "" }: BrowserBarProps) {
  const pillRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState<string>(domain);
  const [fontSize, setFontSize] = useState<number | null>(null);

  useEffect(() => {
    setDisplayText(domain);
    setFontSize(null);
  }, [domain]);

  useEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;

    const measureAndFit = () => {
      // Content width minus lock icon (11px) and gap (6px) and 2px buffer
      const availableWidth = Math.max(30, pill.clientWidth - 24 - 11 - 6 - 2);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const fontFam =
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

      // Base font size derived from clamp(10px, 0.9vw, 12.5px)
      const vw = typeof window !== "undefined" ? window.innerWidth * 0.009 : 12;
      const baseFontSize = Math.min(12.5, Math.max(10, Number(vw.toFixed(2))));

      // 1. Try base font size down to 9.5px
      let currentSize = baseFontSize;
      ctx.font = `500 ${currentSize}px ${fontFam}`;
      let textWidth = ctx.measureText(domain).width;

      if (textWidth <= availableWidth) {
        setFontSize(currentSize);
        setDisplayText(domain);
        return;
      }

      // Step down font size towards 9.5px
      while (currentSize > 9.5) {
        currentSize = Math.max(9.5, Number((currentSize - 0.25).toFixed(2)));
        ctx.font = `500 ${currentSize}px ${fontFam}`;
        textWidth = ctx.measureText(domain).width;
        if (textWidth <= availableWidth) {
          setFontSize(currentSize);
          setDisplayText(domain);
          return;
        }
      }

      // 2. If still overflows at minimum 9.5px, apply middle ellipsis as last resort
      setFontSize(9.5);
      ctx.font = `500 9.5px ${fontFam}`;

      let low = 6;
      let high = domain.length - 1;
      let bestFittingText = formatDomainWithMiddleEllipsis(domain, low);

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const candidate = formatDomainWithMiddleEllipsis(domain, mid);
        const w = ctx.measureText(candidate).width;
        if (w <= availableWidth) {
          bestFittingText = candidate;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      setDisplayText(bestFittingText);
    };

    measureAndFit();

    const ro = new ResizeObserver(() => {
      measureAndFit();
    });
    ro.observe(pill);

    return () => ro.disconnect();
  }, [domain]);

  return (
    <div
      className={`h-[30px] sm:h-[34px] px-[14px] flex items-center gap-[12px] bg-white/[0.04] border-b border-white/[0.08] shrink-0 w-full z-20 select-none ${className}`}
    >
      {/* Left: Window Control Dots (3 x 10px dots with 7px gap = 44px total width) */}
      <div className="flex items-center gap-[7px] shrink-0" aria-hidden="true">
        <span className="w-[10px] h-[10px] rounded-full bg-[#FF5F57] block" />
        <span className="w-[10px] h-[10px] rounded-full bg-[#FEBC2E] block" />
        <span className="w-[10px] h-[10px] rounded-full bg-[#28C840] block" />
      </div>

      {/* Middle: Address Pill taking all remaining width (flex: 1) */}
      <div
        ref={pillRef}
        className="flex-1 h-[24px] rounded-full bg-white/[0.07] border border-white/10 px-3 flex items-center justify-center gap-1.5 min-w-0 overflow-hidden"
      >
        <Lock
          className="w-[11px] h-[11px] shrink-0 text-white/60"
          strokeWidth={2.2}
          aria-hidden="true"
        />
        <span
          className="whitespace-nowrap font-mono font-medium text-white/80 tracking-normal leading-none"
          style={{
            fontSize: fontSize ? `${fontSize}px` : "clamp(10px, 0.9vw, 12.5px)",
          }}
          title={domain}
        >
          {displayText}
        </span>
      </div>

      {/* Right: Invisible Spacer (44px) so the address pill is mathematically centered in the bar */}
      <div className="w-[44px] shrink-0 pointer-events-none" aria-hidden="true" />
    </div>
  );
}
