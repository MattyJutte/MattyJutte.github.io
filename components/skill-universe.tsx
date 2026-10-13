"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { SkillSignal } from "@/components/discovery/surprises";
import { Icon } from "@/components/icon";
import { useLanguage } from "@/lib/use-language";
import "./skill-universe.css";

const positions = [
  { x: 27, y: 24, path: "M300 240 Q195 240 162 115" },
  { x: 78, y: 33, path: "M300 240 Q390 260 468 158" },
  { x: 71, y: 78, path: "M300 240 Q405 255 426 374" },
  { x: 20, y: 71, path: "M300 240 Q180 220 120 341" },
];

// Deterministic positions keep the exported HTML and hydrated SVG identical.
const stars = Array.from({ length: 32 }, (_, i) => ({
  x: 24 + ((i * 137) % 552),
  y: 28 + ((i * 83) % 424),
  radius: i % 5 === 0 ? 1.8 : 1,
}));

export function SkillUniverse() {
  const { content } = useLanguage();
  const { groups, universe: labels } = content.skills;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    function refresh() {
      element!.dataset.running = String(
        visible &&
          !paused &&
          !document.hidden &&
          !motion.matches &&
          !document.documentElement.classList.contains("discovery-quiet"),
      );
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        refresh();
      },
      { threshold: 0.05 },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", refresh);
    motion.addEventListener("change", refresh);
    window.addEventListener("portfolio-quiet-change", refresh);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", refresh);
      motion.removeEventListener("change", refresh);
      window.removeEventListener("portfolio-quiet-change", refresh);
    };
  }, [paused]);

  function select(index: number) {
    setActive((index + groups.length) % groups.length);
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next++;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next--;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = groups.length - 1;
    else return;
    event.preventDefault();
    next = (next + groups.length) % groups.length;
    select(next);
    nodes.current[next]?.focus();
  }

  return (
    <div
      ref={root}
      className="skill-universe"
      data-active={active}
      data-running="false"
      data-paused={paused}
      data-reveal
    >
      <div className="skill-universe-map">
        <div className="skill-universe-topline">
          <p className="eyebrow">MJ / {labels.label}</p>
          <button
            type="button"
            className="icon-button skill-universe-pause"
            aria-label={paused ? labels.play : labels.pause}
            onClick={() => setPaused(!paused)}
          >
            <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
          </button>
        </div>
        <div
          className="skill-universe-stage"
          role="group"
          aria-label={labels.navigation}
        >
          <svg
            className="skill-universe-orbits"
            viewBox="0 0 600 480"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`${id}-orbit`} x1="0" y1="0" x2="1" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--accent)"
                  stopOpacity="0.08"
                />
                <stop
                  offset="50%"
                  stopColor="var(--accent)"
                  stopOpacity="0.5"
                />
                <stop
                  offset="100%"
                  stopColor="var(--accent)"
                  stopOpacity="0.08"
                />
              </linearGradient>
            </defs>
            {stars.map((star, index) => (
              <circle
                className="skill-orbit-star"
                key={index}
                cx={star.x}
                cy={star.y}
                r={star.radius}
                style={{ animationDelay: `${index * -0.7}s` }}
              />
            ))}
            <g stroke={`url(#${id}-orbit)`} fill="none">
              <ellipse
                className="skill-orbit-ring"
                cx="300"
                cy="240"
                rx="235"
                ry="145"
                transform="rotate(-25 300 240)"
              />
              <ellipse
                className="skill-orbit-ring"
                cx="300"
                cy="240"
                rx="185"
                ry="200"
                transform="rotate(32 300 240)"
              />
              <ellipse
                className="skill-orbit-ring"
                cx="300"
                cy="240"
                rx="110"
                ry="78"
                transform="rotate(-25 300 240)"
              />
            </g>
            {groups.map((group, index) => (
              <g key={group.icon}>
                <path
                  className="skill-orbit-link"
                  d={positions[index].path}
                  data-selected={index === active}
                />
                <path
                  className="skill-orbit-signal"
                  d={positions[index].path}
                  pathLength="100"
                  data-selected={index === active}
                />
              </g>
            ))}
          </svg>
          <div className="skill-universe-core" aria-hidden="true">
            <span>MJ</span>
            <small>{labels.core}</small>
          </div>
          {groups.map((group, index) => (
            <button
              key={group.icon}
              ref={(element) => {
                nodes.current[index] = element;
              }}
              type="button"
              className="skill-orbit-node"
              style={{
                left: `${positions[index].x}%`,
                top: `${positions[index].y}%`,
              }}
              aria-pressed={index === active}
              aria-controls={`${id}-panel`}
              onClick={() => select(index)}
              onKeyDown={(event) => navigate(event, index)}
            >
              <span className="skill-node-icon">
                <Icon name={group.icon} size={23} />
              </span>
              <span className="skill-node-name">{group.title}</span>
              <span className="skill-node-index" aria-hidden="true">
                0{index + 1}
              </span>
            </button>
          ))}
        </div>
        <p className="skill-universe-hint">
          <span aria-hidden="true">✧</span> {labels.hint}
        </p>
      </div>
      <div className="skill-universe-details">
        <div className="skill-universe-panel-top">
          <SkillSignal />
          <span className="skill-universe-count" aria-hidden="true">
            0{active + 1} / 0{groups.length}
          </span>
        </div>
        <div id={`${id}-panel`}>
          {groups.map((group, index) => (
            <section
              key={group.icon}
              className="skill-universe-panel"
              data-selected={index === active}
              aria-labelledby={`${id}-title-${index}`}
            >
              <p className="eyebrow">{labels.selected}</p>
              <h3 id={`${id}-title-${index}`}>{group.title}</h3>
              <p className="skill-universe-description">{group.description}</p>
              <ul className="badges">
                {group.items.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
              <div className="skill-universe-context">
                <span>{labels.contextLabel}</span>
                <p>{labels.contexts[index]}</p>
              </div>
            </section>
          ))}
        </div>
        <div className="skill-universe-navigation">
          <button
            type="button"
            className="icon-button"
            onClick={() => select(active - 1)}
            aria-label={labels.previous}
          >
            ←
          </button>
          <span aria-live="polite" aria-atomic="true">
            {groups[active].title}
          </span>
          <button
            type="button"
            className="icon-button"
            onClick={() => select(active + 1)}
            aria-label={labels.next}
          >
            →
          </button>
        </div>
      </div>
      <noscript>
        <style>{`.skill-universe-panel[data-selected="false"]{display:block!important}.skill-universe-map,.skill-universe-panel-top,.skill-universe-navigation,.skill-universe-panel>.eyebrow{display:none!important}.skill-universe{display:block!important}.skill-universe-panel{margin-bottom:32px}`}</style>
      </noscript>
    </div>
  );
}
