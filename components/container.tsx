import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Universal Container Component
 * Shared fluid page width and gutters are defined in app/globals.css.
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
      className={`container ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
