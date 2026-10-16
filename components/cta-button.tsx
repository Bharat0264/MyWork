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
    variantClass = "btn-chrome--navbar-mobile";
  } else if (isNavbar) {
    variantClass = "btn-chrome--navbar";
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`btn-chrome ${variantClass} ${className}`.trim()}
    >
      <span className="btn-chrome__face">
        {/* Top edge 1px reflection line */}
        <span className="btn-chrome__top-line" aria-hidden="true" />

        {/* Diagonal sheen sweep on hover */}
        <span className="btn-chrome__sheen" aria-hidden="true" />

        {/* Text label */}
        <span className="btn-chrome__label">{label}</span>

        {/* Arrow icon */}
        <svg
          className="btn-chrome__arrow"
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
      </span>
    </Link>
  );
}
