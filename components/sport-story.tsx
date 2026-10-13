"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/icon";
import { openDiscovery } from "@/lib/discovery/events";
import { useLanguage } from "@/lib/use-language";
import "./sport-story.css";

function SportCourt({ sport }: { sport: string }) {
  return (
    <svg className="sport-court" viewBox="0 0 600 380" aria-hidden="true">
      {sport === "golf" ? (
        <>
          <path
            className="sport-ground"
            d="M64 260C58 190 133 157 213 143S339 76 438 114 566 200 529 259 375 322 270 299 106 324 64 260Z"
          />
          <g
            className="sport-court-lines"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M88 256C90 206 158 181 226 169S351 108 431 139 523 208 501 248 375 293 283 273 130 301 88 256Z"
              opacity="0.4"
            />
            <path
              d="M116 242C166 203 230 215 294 189S395 143 448 181"
              strokeDasharray="3 8"
            />
            <ellipse
              cx="440"
              cy="223"
              rx="13"
              ry="5"
              fill="currentColor"
              fillOpacity="0.3"
            />
            <path d="M440 223V101" />
            <path
              d="M440 101L497 120 440 139Z"
              fill="currentColor"
              fillOpacity="0.35"
            />
          </g>
        </>
      ) : (
        <g transform="matrix(1 -.11 .25 .6 -38 96)">
          <rect
            className="sport-ground"
            x="95"
            y="55"
            width="420"
            height="290"
            rx={sport === "fitness" ? 18 : 4}
          />
          <g
            className="sport-court-lines"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect
              x="95"
              y="55"
              width="420"
              height="290"
              rx={sport === "fitness" ? 18 : 4}
            />
            {sport === "football" && (
              <>
                <path d="M305 55V345M95 130H165V270H95M515 130H445V270H515M95 165H122V235H95M515 165H488V235H515" />
                <circle cx="305" cy="200" r="55" />
                <circle cx="305" cy="200" r="3" fill="currentColor" />
              </>
            )}
            {sport === "tennis" && (
              <>
                <path d="M124 55V345M486 55V345M124 128H486M124 272H486M305 128V272" />
                <path d="M85 200H525" strokeWidth="3" strokeDasharray="4 5" />
                <path d="M85 192V208M525 192V208" strokeWidth="4" />
              </>
            )}
            {sport === "fitness" && (
              <>
                <path
                  d="M200 55V345M305 55V345M410 55V345M95 152H515M95 248H515"
                  opacity="0.35"
                />
                <path d="M152 95H190M152 95V130M458 95H420M458 95V130M152 305H190M152 305V270M458 305H420M458 305V270" />
                <ellipse
                  cx="305"
                  cy="200"
                  rx="70"
                  ry="56"
                  strokeDasharray="3 7"
                  opacity="0.5"
                />
              </>
            )}
          </g>
        </g>
      )}
    </svg>
  );
}

function SportObject({ sport, id }: { sport: string; id: string }) {
  return (
    <svg className="sport-object-art" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`}>
          <circle cx="60" cy="60" r="48" />
        </clipPath>
        <radialGradient id={`${id}-shade`} cx="32%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
        </radialGradient>
      </defs>
      {sport === "fitness" ? (
        <g transform="rotate(-25 60 60)">
          <rect
            x="20"
            y="52"
            width="80"
            height="16"
            rx="4"
            fill="var(--sport-ball-seam)"
          />
          <rect
            x="11"
            y="51"
            width="9"
            height="18"
            rx="3"
            fill="var(--sport-ball-detail)"
          />
          <rect
            x="100"
            y="51"
            width="9"
            height="18"
            rx="3"
            fill="var(--sport-ball-detail)"
          />
          <rect
            x="18"
            y="35"
            width="13"
            height="50"
            rx="5"
            fill="var(--sport-ball-detail)"
          />
          <rect
            x="89"
            y="35"
            width="13"
            height="50"
            rx="5"
            fill="var(--sport-ball-detail)"
          />
          <rect
            x="30"
            y="28"
            width="17"
            height="64"
            rx="5"
            fill="var(--sport-ball)"
          />
          <rect
            x="73"
            y="28"
            width="17"
            height="64"
            rx="5"
            fill="var(--sport-ball)"
          />
          <path
            d="M34 33V85M77 33V85M49 56H70"
            stroke="#fff"
            strokeOpacity="0.35"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ) : (
        <>
          <circle cx="60" cy="60" r="48" fill="var(--sport-ball)" />
          <g clipPath={`url(#${id}-clip)`}>
            {sport === "football" && (
              <>
                <path
                  d="M60 37L80 51 72 74H48L40 51Z M51 5L69 5 75 15 60 24 45 15Z M105 35L119 45 116 65 100 62 94 46Z M96 97L87 114 67 117 66 101 80 90Z M25 98L11 88 10 69 26 73 33 88Z M6 31L13 13 30 9 35 25 23 38Z"
                  fill="var(--sport-ball-detail)"
                />
                <path
                  d="M60 24V37M80 51L100 62M72 74L80 90M48 74L33 88M40 51L23 38M35 25L45 15M94 46L75 15M66 101L26 73M116 65L96 97"
                  fill="none"
                  stroke="var(--sport-ball-detail)"
                  strokeWidth="1.7"
                />
              </>
            )}
            {sport === "golf" &&
              Array.from({ length: 36 }, (_, index) => (
                <circle
                  key={index}
                  cx={29 + (index % 6) * 12}
                  cy={29 + Math.floor(index / 6) * 12}
                  r="3"
                  fill="none"
                  stroke="var(--sport-ball-detail)"
                  strokeWidth="1.4"
                  opacity="0.35"
                />
              ))}
            {sport === "tennis" && (
              <path
                d="M27 18C61 35 61 85 27 102M93 18C59 35 59 85 93 102"
                fill="none"
                stroke="var(--sport-ball-seam)"
                strokeWidth="5"
              />
            )}
          </g>
          <circle cx="60" cy="60" r="48" fill={`url(#${id}-shade)`} />
        </>
      )}
    </svg>
  );
}

export function SportStory() {
  const { content } = useLanguage();
  const labels = content.personal.sports;
  const [selected, setSelected] = useState("now");
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [playing, setPlaying] = useState(0);
  const sequence = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const chapter =
    labels.chapters.find((item) => item.id === selected) ?? labels.chapters[0];

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    function refresh() {
      const allowed =
        visible &&
        !document.hidden &&
        !motion.matches &&
        !document.documentElement.classList.contains("discovery-quiet");
      setMotionAllowed(allowed);
      if (!allowed) setPlaying(0);
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });
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
  }, []);

  function select(next: string) {
    setSelected(next);
    setPlaying(0);
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next++;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next--;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = labels.chapters.length - 1;
    else return;
    event.preventDefault();
    next = (next + labels.chapters.length) % labels.chapters.length;
    select(labels.chapters[next].id);
    buttons.current[next]?.focus();
  }

  return (
    <div
      className="sport-story"
      data-sport={chapter.sport}
      data-motion={motionAllowed}
      ref={root}
      data-reveal
    >
      <div className="sport-story-topline">
        <p className="eyebrow">MJ / {labels.label}</p>
        <span className="sport-story-kicker">{labels.kicker}</span>
      </div>
      <div
        className="sport-chapters"
        role="group"
        aria-label={labels.navigation}
      >
        {labels.chapters.map((item, index) => (
          <button
            type="button"
            className="sport-chapter-button"
            key={item.id}
            ref={(button) => {
              buttons.current[index] = button;
            }}
            aria-pressed={item.id === chapter.id}
            aria-controls={`${id}-${item.id}`}
            onClick={() => select(item.id)}
            onKeyDown={(event) => navigate(event, index)}
          >
            <span className="sport-chapter-age">{item.navAge}</span>
            <span className="sport-chapter-name">{item.navName}</span>
            <span className="sport-chapter-dot" aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-atomic="true">
        {chapter.age} · {chapter.title}
      </p>
      <div className="sport-story-grid">
        <div className="sport-scene">
          <SportCourt sport={chapter.sport} />
          <span className="sport-scene-coordinate" aria-hidden="true">
            06 / 09 / 14 / 19
          </span>
          <button
            type="button"
            className="sport-object"
            aria-label={chapter.action}
            aria-describedby={`${id}-hint`}
            disabled={!motionAllowed}
            onClick={() => setPlaying(++sequence.current)}
          >
            <span
              className={`sport-object-motion ${playing ? "is-playing" : ""}`}
              key={`${chapter.id}-${playing}`}
              onAnimationEnd={(event) => {
                if (event.target === event.currentTarget) setPlaying(0);
              }}
            >
              <SportObject sport={chapter.sport} id={id} />
            </span>
          </button>
          <span className="sport-object-shadow" aria-hidden="true" />
          <span className="sport-scene-label" aria-hidden="true">
            {chapter.sportLabel}
          </span>
          <p className="sport-scene-hint" id={`${id}-hint`}>
            {motionAllowed ? chapter.hint : labels.stillHint}
          </p>
        </div>
        <div className="sport-story-content">
          {labels.chapters.map((item) => (
            <section
              className="sport-chapter-panel"
              key={item.id}
              id={`${id}-${item.id}`}
              data-selected={item.id === chapter.id}
              aria-labelledby={`${id}-${item.id}-title`}
            >
              <div className="sport-story-meta">
                <span className="sport-story-age">{item.age}</span>
                <span className="sport-story-status">{item.status}</span>
              </div>
              <h3 id={`${id}-${item.id}-title`}>{item.title}</h3>
              <p className="sport-story-lead">{item.lead}</p>
              <dl className="sport-story-facts">
                {item.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="sport-story-note">{item.note}</p>
              {item.id === "golf" && (
                <button
                  type="button"
                  className="text-link sport-golf-link"
                  onClick={() => openDiscovery("golf")}
                >
                  {labels.golfLink}
                  <Icon name="arrowUpRight" size={16} />
                </button>
              )}
            </section>
          ))}
        </div>
      </div>
      <p className="sport-story-footer">{labels.footer}</p>
      <noscript>
        <style>{`.sport-chapter-panel[data-selected="false"]{display:block!important}.sport-chapters,.sport-scene,.sport-story-footer,.sport-golf-link{display:none!important}.sport-story-grid{display:block!important}.sport-chapter-panel{margin-bottom:32px}`}</style>
      </noscript>
    </div>
  );
}
