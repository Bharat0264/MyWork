"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Minus, Plus, Sparkles } from "lucide-react";
import {
  socialPackages,
  getMonthlyTotals,
  formatPackagePrice,
  getCustomPlanEstimate,
  comparisonTableFeatures,
  socialFaqs,
  socialProcessSteps,
  type SocialPackage,
} from "@/data/social-packages";

export function SocialMediaPlans() {
  // Custom builder state
  const [postsPerWeek, setPostsPerWeek] = useState<number>(3);
  const [videosPerWeek, setVideosPerWeek] = useState<number>(2);
  const [platforms, setPlatforms] = useState<number>(2);

  // FAQ accordion state: set of open FAQ indices
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Mobile comparison plan filter: "starter" | "growth" | "pro"
  const [mobileCompareTab, setMobileCompareTab] = useState<"starter" | "growth" | "pro">("growth");

  const customMonthly = getMonthlyTotals({
    postsPerWeek,
    videosPerWeek,
  });
  const customEstimate = getCustomPlanEstimate(postsPerWeek, videosPerWeek, platforms);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-[var(--section-gap)]">
      {/* ========================================================
          1. PACKAGES CARDS (Starter, Growth, Pro)
          Mobile: Stack with Growth first (order-1), Starter (order-2), Pro (order-3)
          Desktop: 3-column grid with Growth slightly raised
          ======================================================== */}
      <section aria-label="Monthly social media packages">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-4">
          {socialPackages.map((pkg: SocialPackage) => {
            const monthly = getMonthlyTotals(pkg);
            const isPopular = pkg.popular;
            const mobileOrder = isPopular ? "order-1" : pkg.id === "starter" ? "order-2" : "order-3";

            return (
              <article
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-[28px] border p-6 sm:p-8 lg:p-9 transition-all duration-300 ${mobileOrder} lg:order-none ${
                  isPopular
                    ? "border-[rgba(143,176,214,0.38)] bg-gradient-to-b from-[#1E2F4D]/90 to-[#141E30]/95 shadow-[0_20px_50px_rgba(4,9,18,0.5)] lg:-translate-y-2 lg:scale-[1.02] z-10"
                    : "border-[rgba(143,176,214,0.18)] bg-gradient-to-b from-[#18263D]/80 to-[#121A2B]/90 shadow-[0_12px_36px_rgba(4,9,18,0.4)]"
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(143,176,214,0.38)] bg-[#1B2B45] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#E8EEF7] shadow-[0_4px_12px_rgba(4,9,18,0.4)]">
                      <Sparkles size={12} className="text-[#8FB0D6]" />
                      Most popular
                    </span>
                  </div>
                )}

                <div>
                  {/* Header: Name & Tagline */}
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                      {pkg.name}
                    </h2>
                    <span className="text-[13px] font-medium text-[#8FB0D6] bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1">
                      {pkg.platformsLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#B8C9DE] min-h-[40px]">
                    {pkg.tagline}
                  </p>

                  {/* Price */}
                  <div className="mt-6 pt-4 border-t border-[rgba(143,176,214,0.14)]">
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8FB0D6]">
                      Monthly Investment
                    </p>
                    <p className="mt-1 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {formatPackagePrice(pkg.price)}
                    </p>
                  </div>

                  {/* Deliverables Callout */}
                  <div className="mt-6 rounded-2xl border border-[rgba(143,176,214,0.18)] bg-black/25 p-4 sm:p-5">
                    <p className="text-[12px] font-medium uppercase tracking-wider text-[#8FB0D6]">
                      Weekly Deliverables
                    </p>
                    <p className="mt-1.5 text-xl sm:text-2xl font-semibold text-white leading-snug">
                      {pkg.postsPerWeek} posts + {pkg.videosPerWeek} {pkg.videosPerWeek === 1 ? "video" : "videos"} / week
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[13px] text-[#A9C8EB] border-t border-white/[0.08] pt-2">
                      <span className="font-medium">{monthly.label}</span>
                      <span className="text-[11px] text-[#8FB0D6] opacity-80">4 weeks</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mt-6">
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8FB0D6] mb-3">
                      What&apos;s Included
                    </p>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#E8EEF7]">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[rgba(143,176,214,0.18)] text-[#8FB0D6]">
                            <Check size={11} strokeWidth={2.5} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8 pt-4">
                  <Link
                    href={`/contact?service=social-media&package=${pkg.id}`}
                    className="btn-glass w-full"
                  >
                    <span className="btn-glass__sheen" aria-hidden="true" />
                    <span className="btn-glass__label">Choose this plan</span>
                    <svg
                      className="btn-glass__arrow"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          2. BUILD YOUR OWN PLAN (Interactive Custom Builder)
          ======================================================== */}
      <section
        id="custom-plan"
        aria-labelledby="custom-plan-heading"
        className="rounded-[28px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45]/90 via-[#141E30]/85 to-[#0B1322]/90 p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(4,9,18,0.5)]"
      >
        <div className="max-w-2xl">
          <p className="eyebrow text-[#8FB0D6]">Custom Configuration</p>
          <h2
            id="custom-plan-heading"
            className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight"
          >
            Build your own plan.
          </h2>
          <p className="mt-3 text-[15px] sm:text-[16px] leading-relaxed text-[#B8C9DE]">
            Need a tailored schedule or multi-account coverage? Adjust the controls to set your ideal weekly deliverables.
          </p>
        </div>

        <div className="mt-8 lg:mt-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-start">
          {/* Controls Column */}
          <div className="space-y-6 sm:space-y-8">
            {/* Control 1: Posts per week */}
            <div className="rounded-2xl border border-[rgba(143,176,214,0.14)] bg-white/[0.03] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4 mb-3">
                <label htmlFor="posts-range" className="text-[15px] font-medium text-white">
                  Posts per week
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease posts per week"
                    disabled={postsPerWeek <= 1}
                    onClick={() => setPostsPerWeek((p) => Math.max(1, p - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(143,176,214,0.22)] bg-white/[0.05] text-white hover:bg-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-xl font-bold text-white tabular-nums">
                    {postsPerWeek}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase posts per week"
                    disabled={postsPerWeek >= 7}
                    onClick={() => setPostsPerWeek((p) => Math.min(7, p + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(143,176,214,0.22)] bg-white/[0.05] text-white hover:bg-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <input
                id="posts-range"
                type="range"
                min={1}
                max={7}
                step={1}
                value={postsPerWeek}
                onChange={(e) => setPostsPerWeek(Number(e.target.value))}
                className="w-full accent-[#8FB0D6] cursor-pointer"
              />
              <div className="mt-2 flex justify-between text-[11px] text-[#8FB0D6]">
                <span>1 post / wk</span>
                <span>7 posts / wk</span>
              </div>
            </div>

            {/* Control 2: Videos per week */}
            <div className="rounded-2xl border border-[rgba(143,176,214,0.14)] bg-white/[0.03] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4 mb-3">
                <label htmlFor="videos-range" className="text-[15px] font-medium text-white">
                  Short videos / Reels per week
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease videos per week"
                    disabled={videosPerWeek <= 0}
                    onClick={() => setVideosPerWeek((v) => Math.max(0, v - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(143,176,214,0.22)] bg-white/[0.05] text-white hover:bg-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-xl font-bold text-white tabular-nums">
                    {videosPerWeek}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase videos per week"
                    disabled={videosPerWeek >= 5}
                    onClick={() => setVideosPerWeek((v) => Math.min(5, v + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(143,176,214,0.22)] bg-white/[0.05] text-white hover:bg-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <input
                id="videos-range"
                type="range"
                min={0}
                max={5}
                step={1}
                value={videosPerWeek}
                onChange={(e) => setVideosPerWeek(Number(e.target.value))}
                className="w-full accent-[#8FB0D6] cursor-pointer"
              />
              <div className="mt-2 flex justify-between text-[11px] text-[#8FB0D6]">
                <span>0 videos</span>
                <span>5 videos / wk</span>
              </div>
            </div>

            {/* Control 3: Platforms */}
            <div className="rounded-2xl border border-[rgba(143,176,214,0.14)] bg-white/[0.03] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4 mb-3">
                <label htmlFor="platforms-range" className="text-[15px] font-medium text-white">
                  Platforms managed
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease platforms"
                    disabled={platforms <= 1}
                    onClick={() => setPlatforms((p) => Math.max(1, p - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(143,176,214,0.22)] bg-white/[0.05] text-white hover:bg-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-xl font-bold text-white tabular-nums">
                    {platforms}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase platforms"
                    disabled={platforms >= 4}
                    onClick={() => setPlatforms((p) => Math.min(4, p + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(143,176,214,0.22)] bg-white/[0.05] text-white hover:bg-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <input
                id="platforms-range"
                type="range"
                min={1}
                max={4}
                step={1}
                value={platforms}
                onChange={(e) => setPlatforms(Number(e.target.value))}
                className="w-full accent-[#8FB0D6] cursor-pointer"
              />
              <div className="mt-2 flex justify-between text-[11px] text-[#8FB0D6]">
                <span>1 platform</span>
                <span>4 platforms</span>
              </div>
            </div>
          </div>

          {/* Live Summary Column */}
          <div className="rounded-2xl border border-[rgba(143,176,214,0.22)] bg-[#121A2B]/95 p-6 sm:p-8 flex flex-col justify-between h-full shadow-[0_12px_32px_rgba(4,9,18,0.4)]">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8FB0D6]">
                Plan Summary
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white tracking-tight">
                {postsPerWeek} posts + {videosPerWeek} {videosPerWeek === 1 ? "video" : "videos"} / week
              </h3>

              <div className="mt-6 space-y-4 border-t border-[rgba(143,176,214,0.14)] pt-5">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#B8C9DE]">Monthly Deliverables:</span>
                  <span className="font-semibold text-white">{customMonthly.label}</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#B8C9DE]">Covered Platforms:</span>
                  <span className="font-semibold text-white">
                    {platforms} {platforms === 1 ? "platform" : "platforms"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#B8C9DE]">Billing Cycle:</span>
                  <span className="font-semibold text-white">Monthly (4 weeks)</span>
                </div>
                {customEstimate ? (
                  <div className="flex items-center justify-between text-[14px] border-t border-white/[0.08] pt-3">
                    <span className="text-[#8FB0D6]">Estimate:</span>
                    <span className="font-bold text-white">{customEstimate}</span>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 text-[13px] leading-relaxed text-[#B8C9DE]">
                Includes monthly calendar, on-brand graphics, captions, hashtags, and performance reporting.
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href={`/contact?service=social-media&package=custom&posts=${postsPerWeek}&videos=${videosPerWeek}&platforms=${platforms}`}
                className="btn-glass w-full"
              >
                <span className="btn-glass__sheen" aria-hidden="true" />
                <span className="btn-glass__label">Request this plan</span>
                <svg
                  className="btn-glass__arrow"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. COMPARE PLANS TABLE
          Desktop: Full grid comparison with highlighted Growth column
          Mobile: Plan tabs switcher with detailed feature list
          ======================================================== */}
      <section aria-labelledby="compare-heading">
        <div className="max-w-2xl mb-8">
          <p className="eyebrow text-[#8FB0D6]">Feature Comparison</p>
          <h2
            id="compare-heading"
            className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight"
          >
            Compare plans side-by-side.
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[#B8C9DE]">
            Detailed breakdown of deliverables, creative assets, and management across every package.
          </p>
        </div>

        {/* Mobile View: Tab selector + Card breakdown */}
        <div className="block lg:hidden">
          <div className="flex gap-2 rounded-xl border border-white/10 bg-[#121A2B] p-1.5 mb-6">
            {(["starter", "growth", "pro"] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setMobileCompareTab(id)}
                className={`flex-1 rounded-lg py-2.5 text-[14px] font-semibold capitalize transition-all ${
                  mobileCompareTab === id
                    ? "bg-[#1E2F4D] text-white shadow-sm border border-[rgba(143,176,214,0.3)]"
                    : "text-[#B8C9DE] hover:text-white"
                }`}
              >
                {id === "growth" ? "Growth ★" : id}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[rgba(143,176,214,0.18)] bg-[#141E30]/90 p-5 divide-y divide-white/[0.08]">
            {comparisonTableFeatures.map((row) => {
              const val = row[mobileCompareTab];
              return (
                <div key={row.name} className="py-3 flex items-center justify-between gap-4 text-[14px]">
                  <span className="text-[#B8C9DE] font-medium">{row.name}</span>
                  <span className="font-semibold text-white text-right">
                    {typeof val === "boolean" ? (
                      val ? (
                        <Check size={16} className="text-[#8FB0D6] ml-auto" />
                      ) : (
                        <span className="text-[#6F86A3]">—</span>
                      )
                    ) : (
                      val
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden lg:block overflow-hidden rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-[#141E30]/90 shadow-[0_16px_40px_rgba(4,9,18,0.4)]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[rgba(143,176,214,0.16)] bg-[#1B2B45]/60">
                <th className="p-5 text-[13px] font-semibold uppercase tracking-wider text-[#8FB0D6] w-[40%]">
                  Feature
                </th>
                <th className="p-5 text-center text-[15px] font-semibold text-white w-[20%]">
                  Starter
                </th>
                <th className="p-5 text-center text-[15px] font-semibold text-white bg-[rgba(143,176,214,0.08)] border-x border-[rgba(143,176,214,0.18)] w-[20%]">
                  Growth <span className="ml-1 text-[11px] font-normal text-[#8FB0D6]">(Popular)</span>
                </th>
                <th className="p-5 text-center text-[15px] font-semibold text-white w-[20%]">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[14px]">
              {comparisonTableFeatures.map((row) => (
                <tr key={row.name} className="transition-colors hover:bg-white/[0.02]">
                  <td className="p-5 font-medium text-[#E8EEF7]">
                    <div>{row.name}</div>
                    <div className="text-[11px] text-[#6F86A3]">{row.category}</div>
                  </td>
                  <td className="p-5 text-center text-[#B8C9DE]">
                    {typeof row.starter === "boolean" ? (
                      row.starter ? (
                        <Check size={18} className="text-[#8FB0D6] mx-auto" />
                      ) : (
                        <span className="text-[#6F86A3]">—</span>
                      )
                    ) : (
                      row.starter
                    )}
                  </td>
                  <td className="p-5 text-center font-semibold text-white bg-[rgba(143,176,214,0.05)] border-x border-[rgba(143,176,214,0.14)]">
                    {typeof row.growth === "boolean" ? (
                      row.growth ? (
                        <Check size={18} className="text-[#8FB0D6] mx-auto" />
                      ) : (
                        <span className="text-[#6F86A3]">—</span>
                      )
                    ) : (
                      row.growth
                    )}
                  </td>
                  <td className="p-5 text-center text-[#B8C9DE]">
                    {typeof row.pro === "boolean" ? (
                      row.pro ? (
                        <Check size={18} className="text-[#8FB0D6] mx-auto" />
                      ) : (
                        <span className="text-[#6F86A3]">—</span>
                      )
                    ) : (
                      row.pro
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================
          4. HOW IT WORKS (3 Simple Steps)
          ======================================================== */}
      <section aria-labelledby="process-heading">
        <div className="max-w-2xl mb-8">
          <p className="eyebrow text-[#8FB0D6]">Process</p>
          <h2
            id="process-heading"
            className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight"
          >
            How it works in 3 steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {socialProcessSteps.map((step) => (
            <article
              key={step.step}
              className="rounded-[24px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45]/80 to-[#141E30]/90 p-6 sm:p-8 shadow-[0_12px_32px_rgba(4,9,18,0.35)] flex flex-col justify-between"
            >
              <div>
                <p className="text-[13px] font-bold tracking-wider text-[#8FB0D6]">
                  {step.step}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-[#B8C9DE]">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ========================================================
          5. FAQ ACCORDION + CLOSING DISCLAIMER
          ======================================================== */}
      <section aria-labelledby="faq-heading" className="pt-2">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="eyebrow text-[#8FB0D6]">Frequently Asked Questions</p>
          <h2
            id="faq-heading"
            className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight"
          >
            Clear answers, no ambiguity.
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3.5">
          {socialFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-[rgba(143,176,214,0.18)] bg-[#141E30]/80 transition-colors hover:border-[rgba(143,176,214,0.28)]"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB0D6]"
                >
                  <span className="text-[15px] sm:text-[16px] font-semibold text-white leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(143,176,214,0.25)] bg-white/[0.04] text-[#8FB0D6] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown size={16} />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-[14px] sm:text-[15px] leading-relaxed text-[#B8C9DE] border-t border-white/[0.06] pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Required Closing Line */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#9FB3CC] rounded-2xl border border-[rgba(143,176,214,0.14)] bg-white/[0.02] p-5">
            We don&apos;t promise follower counts. We focus on consistent, on-brand content. Final scope and price are confirmed after a short call.
          </p>
        </div>
      </section>

      {/* ========================================================
          6. BOTTOM CALL-TO-ACTION SECTION
          ======================================================== */}
      <section className="rounded-[28px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1E2F4D]/90 to-[#121A2B]/95 p-8 sm:p-12 text-center shadow-[0_20px_50px_rgba(4,9,18,0.5)]">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
          Ready for dependable weekly content?
        </h2>
        <p className="mt-3 text-[15px] sm:text-[16px] leading-relaxed text-[#B8C9DE] max-w-xl mx-auto">
          Choose a monthly plan or describe your preferred channels. We respond within 24 hours.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/contact?service=social-media" className="btn-glass">
            <span className="btn-glass__sheen" aria-hidden="true" />
            <span className="btn-glass__label">Start with Social Media</span>
            <svg
              className="btn-glass__arrow"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
