"use client";

import type { Project } from "@/data/projects";

interface ViewProjectButtonProps {
  project: Pick<Project, "title" | "slug"> & { liveUrl?: string };
  className?: string;
  label?: string;
}

export function ViewProjectGlassButton({
  project,
  className = "",
  label = "View project",
}: ViewProjectButtonProps) {
  const liveUrl = project.liveUrl;

  return (
    <a
      href={liveUrl || "#"}
      target={liveUrl ? "_blank" : undefined}
      rel={liveUrl ? "noopener noreferrer" : undefined}
      aria-label={
        liveUrl
          ? `${label} - ${project.title} (opens in new tab)`
          : `${label} - ${project.title} (preview unavailable)`
      }
      onClick={(e) => {
        if (!liveUrl) {
          e.preventDefault();
        }
      }}
      className={`btn-glass ${className}`.trim()}
    >
      <span className="btn-glass__sheen" aria-hidden="true" />
      <span className="btn-glass__label">{label}</span>
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
    </a>
  );
}

// Backwards compatibility aliases
export const ViewProjectLiquidButton = ViewProjectGlassButton;
export const ViewProjectButton = ViewProjectGlassButton;
export default ViewProjectGlassButton;
