import Link from "next/link";

interface StartProjectButtonProps {
  href?: string;
  variant?: "default" | "navbar" | "navbar-mobile";
  size?: "sm" | "md" | "lg" | "navbar";
  className?: string;
  label?: string;
  onClick?: () => void;
}

export function StartProjectButton({
  href = "/contact",
  variant,
  size,
  className = "",
  label = "Start a project",
  onClick,
}: StartProjectButtonProps) {
  // Determine variant based on props
  const isNavbarMobile = variant === "navbar-mobile" || size === "sm";
  const isNavbar = variant === "navbar" || size === "navbar";

  let variantClass = "";
  if (isNavbarMobile) {
    variantClass = "btn-liquid--navbar-mobile";
  } else if (isNavbar) {
    variantClass = "btn-liquid--navbar";
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`btn-liquid ${variantClass} ${className}`.trim()}
    >
      {/* GLOSS HIGHLIGHT (pill shape inside top half) */}
      <span className="btn-liquid__gloss" aria-hidden="true" />

      {/* TEXT LABEL */}
      <span className="btn-liquid__label">{label}</span>

      {/* ARROW ICON */}
      <svg
        className="btn-liquid__arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </Link>
  );
}
