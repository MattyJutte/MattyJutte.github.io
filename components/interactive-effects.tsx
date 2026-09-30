"use client";

import { useEffect, useRef } from "react";

export function InteractiveEffects() {
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;

    function updateProgress() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const height =
          document.documentElement.scrollHeight - window.innerHeight;
        const amount =
          height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
        progress.current?.style.setProperty("--progress", String(amount));
      });
    }

    function moveLight(event: PointerEvent) {
      if (motion.matches || !pointer.matches || event.pointerType !== "mouse")
        return;
      const card =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(
              ".skill-card, .hobby-card, .portrait-frame",
            )
          : null;
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    }

    // Directe CSS-updates voorkomen React-renders bij iedere muisbeweging.
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    document.addEventListener("pointermove", moveLight, { passive: true });
    const observer = new ResizeObserver(updateProgress);
    observer.observe(document.body);
    updateProgress();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      document.removeEventListener("pointermove", moveLight);
    };
  }, []);

  return <div ref={progress} className="reading-progress" aria-hidden="true" />;
}
