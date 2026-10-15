"use client";

import { useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const HASH_ROUTES: Record<string, string> = {
  "#work": "/work",
  "#services": "/services",
  "#about": "/about",
  "#contact": "/contact",
};

export function ScrollToTop() {
  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  useLayoutEffect(() => {
    // Check if current URL contains an old hash that maps to a real route
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      if (hash && HASH_ROUTES[hash]) {
        const targetRoute = HASH_ROUTES[hash];
        window.history.replaceState(null, "", targetRoute);
        router.replace(targetRoute);
        window.scrollTo(0, 0);
        return;
      }
    }

    // Always ensure page opens at the top instantly
    window.scrollTo(0, 0);
    const frame = window.requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, router]);

  return null;
}
