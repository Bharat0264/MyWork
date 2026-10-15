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
      className={`group garuda-cta-capsule relative inline-flex items-center justify-between rounded-full font-semibold text-[#141E30] tracking-[-0.01em] select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-0 ${sizeClasses.button} ${className}`}
    >
      {/* Label */}
      <span className="relative z-10 font-semibold text-[#141E30]">
        {label}
      </span>

      {/* Flat Calm Circular Arrow Element */}
      <span
        aria-hidden="true"
        className={`garuda-cta-dial relative z-10 flex shrink-0 items-center justify-center rounded-full ${sizeClasses.circle}`}
      >
        {/* White Arrow Icon */}
        <ArrowUpRight
          size={sizeClasses.iconSize}
          strokeWidth={sizeClasses.iconStroke}
          className="relative z-10 text-white"
        />
      </span>
    </Link>
  );
}
