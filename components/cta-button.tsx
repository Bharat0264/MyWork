import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface StartProjectButtonProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  onClick?: () => void;
}

export function StartProjectButton({
  href = "/contact",
  size = "md",
  className = "",
  label = "Start a project",
  onClick,
}: StartProjectButtonProps) {
  // Size-specific dimensions and paddings
  const sizeClasses = {
    sm: {
      button: "h-[38px] sm:h-[40px] pl-3.5 sm:pl-4 pr-1 py-1 text-[12px] sm:text-[13px] gap-2.5 sm:gap-3",
      circle: "h-[30px] w-[30px] sm:h-[32px] sm:w-[32px]",
      iconSize: 14,
      iconStroke: 2.6,
    },
    md: {
      button: "h-[50px] sm:h-[52px] pl-5 sm:pl-6 pr-1.5 py-1.5 text-[15px] sm:text-[15.5px] gap-4 sm:gap-6",
      circle: "h-[38px] w-[38px] sm:h-[40px] sm:w-[40px]",
      iconSize: 18,
      iconStroke: 2.7,
    },
    lg: {
      button: "h-[58px] sm:h-[62px] pl-7 sm:pl-8 pr-2 py-2 text-[16px] sm:text-[17.5px] gap-6 sm:gap-8",
      circle: "h-[44px] w-[44px] sm:h-[48px] sm:w-[48px]",
      iconSize: 21,
      iconStroke: 2.8,
    },
  }[size];

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group garuda-cta-capsule relative inline-flex items-center justify-between rounded-full font-semibold text-white tracking-[-0.01em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03060B] select-none whitespace-nowrap ${sizeClasses.button} ${className}`}
    >
      {/* Label */}
      <span className="relative z-10 font-medium text-white transition-colors duration-200 group-hover:text-white">
        {label}
      </span>

      {/* Raised 3D Circular Arrow Element */}
      <span
        aria-hidden="true"
        className={`garuda-cta-dial relative z-10 flex shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-105 ${sizeClasses.circle}`}
      >
        {/* Micro-faceted texture overlay */}
        <span className="garuda-cta-knurl absolute inset-0 rounded-full pointer-events-none opacity-60" />

        {/* Specular top rim shine */}
        <span className="absolute inset-0 rounded-full border border-white/50 pointer-events-none" />

        {/* White Arrow Icon */}
        <ArrowUpRight
          size={sizeClasses.iconSize}
          strokeWidth={sizeClasses.iconStroke}
          className="relative z-10 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </Link>
  );
}
