"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/use-language";
import { discover } from "@/lib/discovery/store";
export function SkillSignal() {
  const nl = useLanguage().language === "nl";
  const [open, setOpen] = useState(false);
  return (
    <div className="skill-signal">
      <button
        id="discovery-signal"
        type="button"
        className="signal-trigger"
        aria-expanded={open}
        aria-controls="skill-signal-detail"
        onClick={() => {
          setOpen(!open);
          discover("signal");
        }}
        aria-label={
          nl ? "Ontdek een technisch signaal" : "Discover a technical signal"
        }
        title={
          nl
            ? "Wat gebeurt er onder de motorkap?"
            : "What happens under the hood?"
        }
      >
        {"{ }"}
        <span aria-hidden="true">✧</span>
      </button>
      {open && (
        <div id="skill-signal-detail" className="signal-detail" role="status">
          <div className="signal-flow" aria-hidden="true">
            <span>01</span>
            <i>→</i>
            <span>{"{ }"}</span>
            <i>→</i>
            <span>✓</span>
          </div>
          <p>
            {nl
              ? "Invoer → verwerking → uitvoer. Kleine stappen maken complexe code begrijpelijk."
              : "Input → processing → output. Small steps make complex code understandable."}
          </p>
        </div>
      )}
    </div>
  );
}
export function FooterRobot() {
  const nl = useLanguage().language === "nl";
  const [open, setOpen] = useState(false);
  return (
    <div className="footer-surprise">
      <button
        id="discovery-robot"
        type="button"
        className="robot-trigger"
        aria-expanded={open}
        aria-controls="footer-robot-detail"
        onClick={() => {
          setOpen(!open);
          discover("robot");
        }}
      >
        {nl ? "Zit hier nog iemand?" : "Anyone still here?"}{" "}
        <span aria-hidden="true">⌁</span>
      </button>
      {open && (
        <div id="footer-robot-detail" className="robot-detail" role="status">
          <svg viewBox="0 0 90 85" width="70" height="66" aria-hidden="true">
            <path d="M45 18V7M36 7h18" stroke="currentColor" strokeWidth="3" />
            <rect
              x="15"
              y="20"
              width="60"
              height="42"
              rx="13"
              fill="var(--surface-raised)"
              stroke="currentColor"
              strokeWidth="3"
            />
            <rect
              x="25"
              y="31"
              width="40"
              height="19"
              rx="5"
              fill="var(--bg)"
            />
            <circle cx="35" cy="40" r="4" fill="var(--green)" />
            <circle cx="55" cy="40" r="4" fill="var(--green)" />
            <path
              d="M31 62v14m28-14v14M15 39H6m69 0h9"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <p>
            {nl
              ? "Hoi, ik ben Byte. Jij leest zelfs de footer. Dat verdient een ster. ✧"
              : "Hi, I’m Byte. You even read the footer. That deserves a star. ✧"}
          </p>
        </div>
      )}
    </div>
  );
}
export function LogoBurst({ children }: { children: React.ReactNode }) {
  const [burst, setBurst] = useState(false);
  useEffect(() => {
    const activate = () => {
      setBurst(true);
    };
    window.addEventListener("portfolio-logo-tap", activate);
    return () => window.removeEventListener("portfolio-logo-tap", activate);
  }, []);
  return (
    <span
      className={`logo-burst ${burst ? "is-burst" : ""}`}
      onAnimationEnd={() => setBurst(false)}
    >
      {children}
      <i aria-hidden="true">·</i>
      <i aria-hidden="true">✧</i>
      <i aria-hidden="true">·</i>
    </span>
  );
}
