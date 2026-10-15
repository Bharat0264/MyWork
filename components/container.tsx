import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Universal Container Component
 * Strict specifications: max-w 1200px, centered (mx-auto), px-5 / sm:px-8 / lg:px-12
 * Used in header, every page section, and the footer to guarantee identical left/right edges.
 */
export function Container({
  children,
  className = "",
  as: Component = "div",
  ...props
}: ContainerProps) {
  return (
    <Component
      className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12 ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
