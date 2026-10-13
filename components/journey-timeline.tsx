"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { useLanguage } from "@/lib/use-language";
import "./journey-timeline.css";

export function JourneyTimeline() {
  const { content } = useLanguage();
  const experience = content.experience;
  const labels = experience.journey;
  const [reversed, setReversed] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const id = useId();

  const steps = useMemo(() => {
    const combined = [
      ...experience.jobs.map((job, index) => ({
        ...job,
        id: `work-${index}`,
        side: "work" as const,
        category: experience.workTitle,
        icon: "briefcase",
      })),
      ...experience.education.map((education, index) => ({
        ...education,
        id: `education-${index}`,
        side: "education" as const,
        category: experience.educationTitle,
        icon: "graduation",
      })),
    ].sort((a, b) => a.timelineOrder - b.timelineOrder);
    return reversed ? combined.reverse() : combined;
  }, [experience, reversed]);

  useEffect(() => {
    const element = root.current;
    const timeline = track.current;
    if (!element || !timeline) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    let needsMeasure = true;
    let first = 32;
    let length = 0;
    let lastActive: string | null | undefined;
    let stops: { element: HTMLElement; id: string; offset: number }[] = [];

    function measure() {
      const top = timeline!.getBoundingClientRect().top;
      stops = Array.from(
        timeline!.querySelectorAll<HTMLElement>(".journey-stop"),
      ).map((stop) => {
        const station = stop
          .querySelector(".journey-station")!
          .getBoundingClientRect();
        return {
          element: stop,
          id: stop.dataset.step!,
          offset: station.top + station.height / 2 - top,
        };
      });
      first = stops[0]?.offset ?? 32;
      length = Math.max(0, (stops[stops.length - 1]?.offset ?? first) - first);
      timeline!.style.setProperty("--journey-start", `${first}px`);
      timeline!.style.setProperty("--journey-length", `${length}px`);
    }

    function draw() {
      frame = 0;
      if (needsMeasure) {
        measure();
        needsMeasure = false;
      }
      if (document.hidden) return;
      const rect = timeline!.getBoundingClientRect().top;
      const readingLine = window.innerHeight * 0.52;
      const distance = readingLine - rect;
      const progress = Math.max(
        0,
        Math.min(1, (distance - first) / (length || 1)),
      );
      timeline!.style.setProperty("--journey-progress", String(progress));

      // Scroll only changes the active card when another station becomes nearest.
      // Reduced motion keeps this selection and disables CSS transitions instead.
      let nearest: (typeof stops)[number] | undefined;
      for (const stop of stops) {
        stop.element.dataset.reached = String(stop.offset <= distance + 1);
        if (
          !nearest ||
          Math.abs(stop.offset - distance) < Math.abs(nearest.offset - distance)
        )
          nearest = stop;
      }
      const next = visible ? (nearest?.id ?? null) : null;
      if (next !== lastActive) {
        lastActive = next;
        setActive(next);
      }
    }

    function schedule(measureAgain = false) {
      needsMeasure ||= measureAgain;
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function refresh() {
      element!.dataset.motion = String(
        !motion.matches &&
          !document.hidden &&
          !document.documentElement.classList.contains("discovery-quiet"),
      );
      if (!document.hidden) schedule();
    }

    function scroll() {
      if (visible && !document.hidden) schedule();
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule(true);
    });
    const resize = new ResizeObserver(() => schedule(true));
    observer.observe(timeline);
    resize.observe(timeline);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", refresh);
    window.addEventListener("portfolio-quiet-change", refresh);
    document.addEventListener("visibilitychange", refresh);
    motion.addEventListener("change", refresh);
    refresh();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("portfolio-quiet-change", refresh);
      document.removeEventListener("visibilitychange", refresh);
      motion.removeEventListener("change", refresh);
    };
  }, [steps]);

  return (
    <div
      className="journey"
      ref={root}
      data-motion="false"
      data-reversed={reversed}
      data-active={active ?? undefined}
    >
      <div className="journey-toolbar" data-reveal>
        <div>
          <p className="eyebrow">MJ / {labels.label}</p>
          <p className="journey-hint">{labels.hint}</p>
        </div>
        <button
          type="button"
          className="journey-reverse"
          aria-pressed={reversed}
          onClick={() => setReversed(!reversed)}
        >
          <span aria-hidden="true">↕</span> {labels.reverse}
        </button>
      </div>
      <div className="journey-headings">
        <h3 className="journey-heading journey-heading-work">
          <Icon name="briefcase" size={22} />
          {experience.workTitle}
        </h3>
        <span className="journey-direction">
          {reversed ? labels.newestFirst : labels.oldestFirst}
        </span>
        <h3 className="journey-heading journey-heading-education">
          <Icon name="graduation" size={22} />
          {experience.educationTitle}
        </h3>
      </div>
      <div className="journey-track" ref={track}>
        <div className="journey-rail" aria-hidden="true">
          <span className="journey-fill" />
          <span className="journey-cursor" />
        </div>
        <ol className="journey-stops">
          {steps.map((step) => (
            <li
              className="journey-stop"
              key={step.id}
              data-step={step.id}
              data-side={step.side}
              data-active={active === step.id}
              data-reached="false"
              data-current={"current" in step && step.current}
              aria-current={active === step.id ? "step" : undefined}
            >
              <span className="journey-connector" aria-hidden="true" />
              <span className="journey-station" aria-hidden="true">
                <span className="journey-marker" />
              </span>
              <article
                className="journey-stop-copy"
                aria-labelledby={`${id}-${step.id}`}
              >
                <p className="journey-category">
                  <Icon name={step.icon} size={14} />
                  {step.category}
                </p>
                <p className="journey-period">
                  {step.period}
                  {"current" in step && step.current && (
                    <span className="journey-current">{labels.current}</span>
                  )}
                </p>
                <h4 id={`${id}-${step.id}`}>{step.title}</h4>
                <p className="journey-organization">{step.organization}</p>
                <p className="journey-description">{step.description}</p>
                {"href" in step && step.href && (
                  <a className="text-link" href={step.href}>
                    {step.linkLabel}
                    <Icon name="arrowUpRight" size={15} />
                  </a>
                )}
                {"detail" in step && (
                  <span className="education-detail">
                    <Icon name="check" size={14} />
                    {step.detail}
                  </span>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
      <noscript>
        <style>{`.journey-reverse{display:none!important}`}</style>
      </noscript>
    </div>
  );
}
