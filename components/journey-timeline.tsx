"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { useLanguage } from "@/lib/use-language";
import "./journey-timeline.css";

type Step = {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  current?: boolean;
  href?: string;
  linkLabel?: string;
  detail?: string;
};

export function JourneyTimeline() {
  const { content } = useLanguage();
  const experience = content.experience;
  const labels = experience.journey;
  const [reversed, setReversed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [pulse, setPulse] = useState<{
    column: number;
    sequence: number;
  } | null>(null);
  const pulseSequence = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const hintId = useId();

  const columns = useMemo(() => {
    const work: Step[] = experience.jobs.map((job, index) => ({
      ...job,
      id: `work-${index}`,
    }));
    const education: Step[] = experience.education.map((step, index) => ({
      ...step,
      id: `education-${index}`,
    }));
    return [
      {
        icon: "briefcase",
        title: experience.workTitle,
        steps: reversed ? work : work.slice().reverse(),
      },
      {
        icon: "graduation",
        title: experience.educationTitle,
        steps: reversed ? education : education.slice().reverse(),
      },
    ];
  }, [experience, reversed]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    let allowed = false;
    let needsMeasure = true;
    let geometry: {
      track: HTMLDivElement;
      first: number;
      length: number;
      stops: { element: HTMLElement; offset: number }[];
    }[] = [];

    function measure() {
      geometry = tracks.current.flatMap((track) => {
        if (!track) return [];
        const top = track.getBoundingClientRect().top;
        const stops = Array.from(
          track.querySelectorAll<HTMLElement>(".journey-stop"),
        ).map((stop) => {
          const marker = stop
            .querySelector(".journey-stop-button")!
            .getBoundingClientRect();
          return {
            element: stop,
            offset: marker.top + marker.height / 2 - top,
          };
        });
        const first = stops[0]?.offset ?? 32;
        const length = Math.max(0, (stops.at(-1)?.offset ?? first) - first);
        track.style.setProperty("--journey-length", `${length}px`);
        return [{ track, first, length, stops }];
      });
    }

    function draw() {
      frame = 0;
      if (needsMeasure) {
        measure();
        needsMeasure = false;
      }
      const readingLine = window.innerHeight * 0.56;
      for (const { track, first, length, stops } of geometry) {
        const distance =
          readingLine - track.getBoundingClientRect().top - first;
        const progress = allowed
          ? Math.max(0, Math.min(1, distance / (length || 1)))
          : 1;
        track.style.setProperty("--journey-progress", String(progress));
        for (const stop of stops) {
          stop.element.dataset.reached = String(
            !allowed || stop.offset - first <= progress * length + 1,
          );
        }
      }
    }

    function schedule(measureAgain = false) {
      needsMeasure ||= measureAgain;
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function refresh() {
      allowed =
        !motion.matches &&
        !document.hidden &&
        !document.documentElement.classList.contains("discovery-quiet");
      element!.dataset.motion = String(allowed);
      if (!allowed) setPulse(null);
      schedule();
    }

    function scroll() {
      if (visible && allowed && !document.hidden) schedule();
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule(true);
    });
    const resize = new ResizeObserver(() => schedule(true));
    observer.observe(element);
    resize.observe(element);
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
  }, [columns]);

  function sendSignal(column: number, step: Step) {
    const track = tracks.current[column];
    const buttons = track?.querySelectorAll<HTMLButtonElement>(
      ".journey-stop-button",
    );
    const index = columns[column].steps.findIndex(
      (item) => item.id === step.id,
    );
    if (track && buttons?.[index] && buttons[0]) {
      const target =
        buttons[index].getBoundingClientRect().top -
        buttons[0].getBoundingClientRect().top;
      track.style.setProperty("--journey-target", `${target}px`);
    }
    setSelected(step.id);
    setPulse(
      root.current?.dataset.motion === "true"
        ? { column, sequence: ++pulseSequence.current }
        : null,
    );
  }

  const selectedStep = columns
    .flatMap((column) => column.steps)
    .find((step) => step.id === selected);

  return (
    <div
      className="journey"
      ref={root}
      data-motion="false"
      data-reversed={reversed}
    >
      <div className="journey-toolbar" data-reveal>
        <div>
          <p className="eyebrow">MJ / {labels.label}</p>
          <p className="journey-hint" id={hintId}>
            {labels.hint}
          </p>
        </div>
        <button
          type="button"
          className="journey-reverse"
          aria-pressed={reversed}
          onClick={() => {
            setReversed(!reversed);
            setPulse(null);
          }}
        >
          <span aria-hidden="true">↕</span> {labels.reverse}
        </button>
      </div>
      <div className="journey-grid">
        {columns.map((column, columnIndex) => (
          <div className="journey-column" key={column.icon} data-reveal>
            <h3 className="journey-heading">
              <Icon name={column.icon} size={22} />
              {column.title}
              <span className="journey-direction">
                {reversed ? labels.newestFirst : labels.oldestFirst}
              </span>
            </h3>
            <div
              className="journey-track"
              ref={(track) => {
                tracks.current[columnIndex] = track;
              }}
            >
              <div className="journey-rail" aria-hidden="true">
                <span className="journey-fill" />
                <span className="journey-cursor" />
                {pulse?.column === columnIndex && (
                  <span
                    className="journey-pulse"
                    key={pulse.sequence}
                    onAnimationEnd={() => setPulse(null)}
                  />
                )}
              </div>
              <ol className="journey-stops">
                {column.steps.map((step) => (
                  <li
                    className="journey-stop"
                    key={step.id}
                    data-selected={selected === step.id}
                    data-reached="false"
                    data-current={Boolean(step.current)}
                  >
                    <button
                      type="button"
                      className="journey-stop-button"
                      aria-pressed={selected === step.id}
                      aria-describedby={hintId}
                      onClick={() => sendSignal(columnIndex, step)}
                    >
                      <span className="journey-marker" aria-hidden="true" />
                      <span className="sr-only">
                        {labels.signalTo} {step.title}, {step.organization}
                      </span>
                    </button>
                    <div className="journey-stop-copy">
                      <p className="journey-period">
                        {step.period}
                        {step.current && (
                          <span className="journey-current">
                            {labels.current}
                          </span>
                        )}
                      </p>
                      <h4>{step.title}</h4>
                      <p className="journey-organization">
                        {step.organization}
                      </p>
                      <p className="journey-description">{step.description}</p>
                      {step.href && (
                        <a className="text-link" href={step.href}>
                          {step.linkLabel}
                          <Icon name="arrowUpRight" size={15} />
                        </a>
                      )}
                      {step.detail && (
                        <span className="education-detail">
                          <Icon name="check" size={14} />
                          {step.detail}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
      <p className="sr-only" role="status">
        {selectedStep
          ? `${labels.selected}: ${selectedStep.title}, ${selectedStep.organization}.`
          : ""}
      </p>
      <noscript>
        <style>{`
          .journey-toolbar,.journey-stop-button,.journey-rail{display:none!important}
          .journey-stop::before{content:"";position:absolute;left:17px;top:27px;width:10px;height:10px;border:2px solid var(--accent);border-radius:50%;background:var(--bg);z-index:1}
          .journey-stop:not(:last-child)::after{content:"";position:absolute;left:21px;top:32px;bottom:-32px;width:2px;background:var(--line-strong)}
          @media print{.journey-stop::before,.journey-stop::after{display:none}}
        `}</style>
      </noscript>
    </div>
  );
}
