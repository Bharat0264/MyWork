"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.slice(1));
  const target = document.getElementById(id);

  if (!target) {
    return false;
  }

  target.scrollIntoView({ block: "start", behavior: "auto" });
  return true;
}

export function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const frame = window.requestAnimationFrame(() => {
        if (!scrollToHash(hash)) {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        }
      });

      return () => window.cancelAnimationFrame(frame);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
