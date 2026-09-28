"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );

    // Alleen nog niet zichtbare inhoud animeren; zonder JavaScript blijft alles leesbaar.
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add("reveal-pending");
        observer.observe(element);
      }
    });
    function showAll() {
      if (motion.matches)
        elements.forEach((element) =>
          element.classList.remove("reveal-pending"),
        );
    }
    motion.addEventListener("change", showAll);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", showAll);
      elements.forEach((element) => element.classList.remove("reveal-pending"));
    };
  }, []);

  return null;
}
