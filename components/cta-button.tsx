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
    variantClass = "btn-start-mobile";
  } else if (isNavbar) {
    variantClass = "btn-start-navbar";
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group btn-start ${variantClass} ${className}`.trim()}
    >
      {/* LEFT CIRCLE: Blue circle containing a white paper-plane icon */}
      <span aria-hidden="true" className="btn-start-plane-circle">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[18px] w-[18px] shrink-0 sm:h-[20px] sm:w-[20px]"
          aria-hidden="true"
        >
          {/* Top Wing */}
          <polygon
            points="18.12,6.1 6.24,10.92 10.56,13.8"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Bottom Wing */}
          <polygon
            points="18.12,6.1 11.14,14.38 13.44,18.34"
            fill="#E8F1FC"
            stroke="#E8F1FC"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* TEXT: "Start a project" */}
      <span className="btn-start-text">
        {label}
      </span>

      {/* RIGHT CIRCLE: Light circle containing navy ↗ arrow icon */}
      <span aria-hidden="true" className="btn-start-arrow-circle">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0E1A33"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="btn-start-arrow h-[16px] w-[16px] shrink-0 sm:h-[18px] sm:w-[18px]"
          aria-hidden="true"
        >
          <line x1="6.5" y1="17.5" x2="16.5" y2="7.5" />
          <polyline points="8.5 7.5 16.5 7.5 16.5 15.5" />
        </svg>
      </span>
    </Link>
  );
}
