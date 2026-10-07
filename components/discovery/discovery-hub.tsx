"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/use-language";
import {
  advanceSecret,
  advanceTaps,
  discoveryIds,
  type DiscoveryId,
} from "@/lib/discovery/secrets";
import {
  discover,
  resetDiscoveries,
  useDiscoveries,
} from "@/lib/discovery/store";
import { DiscoveryDialog } from "./dialog";
function Loading() {
  const nl = useLanguage().language === "nl";
  return (
    <div className="discovery-loading" role="status">
      ✧ {nl ? "Ervaring laden…" : "Loading experience…"}
    </div>
  );
}
const GolfGame = dynamic(() => import("./golf-game"), {
  ssr: false,
  loading: Loading,
});
const PathfindingLab = dynamic(() => import("./pathfinding-lab"), {
  ssr: false,
  loading: Loading,
});
const ReactionGame = dynamic(() => import("./reaction-game"), {
  ssr: false,
  loading: Loading,
});
type Panel = "golf" | "lab" | "arcade" | "book";
export function DiscoveryHub() {
  const nl = useLanguage().language === "nl";
  const [active, setActive] = useState<Panel | null>(null);
  const [resetPending, setResetPending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const saved = useDiscoveries();
  const [quiet, setQuiet] = useState(false);
  const secret = useRef(0);
  const taps = useRef({ count: 0, time: 0 });
  const labels: Record<DiscoveryId, string> = nl
    ? {
        golf: "Minigolf",
        lab: "Programmeerlab",
        stars: "Sterrenatelier",
        initials: "Initialen in beweging",
        signal: "Onder de motorkap",
        robot: "Byte, de footerbewoner",
        arcade: "Geheime Arcade",
      }
    : {
        golf: "Mini golf",
        lab: "Programming lab",
        stars: "Star studio",
        initials: "Initials in motion",
        signal: "Under the hood",
        robot: "Byte, the footer resident",
        arcade: "Secret Arcade",
      };
  const hints: Record<DiscoveryId, string> = nl
    ? {
        golf: "Een korte ronde bij Golf & tennis.",
        lab: "Wat gebeurt er als code een weg zoekt?",
        stars: "Bij de foto draait meer dan een bol.",
        initials: "MJ heeft een kleine verrassing.",
        signal: "Het eerste skillicoon vertelt meer.",
        robot: "Helemaal onderaan zit nog iemand.",
        arcade: "↑ ↑ ↓ ↓ ← → ← → B A · of vijf keer MJ.",
      }
    : {
        golf: "A quick round at Golf & tennis.",
        lab: "What happens when code searches for a path?",
        stars: "More than a sphere beside the portrait.",
        initials: "MJ has a little surprise.",
        signal: "The first skill icon tells you more.",
        robot: "Someone is waiting at the very bottom.",
        arcade: "↑ ↑ ↓ ↓ ← → ← → B A · or tap MJ five times.",
      };
  useEffect(() => {
    function show(panel: Panel) {
      setActive(panel);
      if (panel !== "book") discover(panel);
    }
    const open = (event: Event) => {
      const id = (event as CustomEvent).detail;
      if (["golf", "lab", "arcade", "book"].includes(id)) show(id);
    };
    const keys = (event: KeyboardEvent) => {
      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.repeat ||
        document.querySelector("dialog[open]")
      )
        return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.closest(
          'input, textarea, select, [contenteditable="true"], [role="textbox"]',
        ) ||
          target.isContentEditable)
      ) {
        secret.current = 0;
        return;
      }
      const next = advanceSecret(secret.current, event.key);
      secret.current = next.index;
      if (next.unlocked) show("arcade");
    };
    const logo = () => {
      discover("initials");
      const next = advanceTaps(
        taps.current.count,
        taps.current.time,
        performance.now(),
      );
      taps.current = next;
      if (next.unlocked) show("arcade");
    };
    window.addEventListener("portfolio-discovery-open", open);
    window.addEventListener("portfolio-logo-tap", logo);
    document.addEventListener("keydown", keys);
    return () => {
      window.removeEventListener("portfolio-discovery-open", open);
      window.removeEventListener("portfolio-logo-tap", logo);
      document.removeEventListener("keydown", keys);
    };
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("discovery-quiet", quiet);
    window.dispatchEvent(new Event("portfolio-quiet-change"));
    return () => document.documentElement.classList.remove("discovery-quiet");
  }, [quiet]);
  function close() {
    setActive(null);
    setResetPending(false);
    setFeedback("");
  }
  function revisit(id: DiscoveryId) {
    if (id === "golf" || id === "lab" || id === "arcade") {
      setActive(id);
      return;
    }
    const targetId = {
      stars: "discovery-stars",
      initials: "discovery-initials",
      signal: "discovery-signal",
      robot: "discovery-robot",
    }[id];
    close();
    window.setTimeout(() => {
      const target = document.getElementById(targetId);
      target?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "center",
      });
      target?.focus({ preventScroll: true });
      if (target?.getAttribute("aria-expanded") !== "true") target?.click();
    }, 0);
  }
  return (
    <>
      <button
        type="button"
        className="discovery-book-button"
        onClick={() => setActive("book")}
        aria-label={
          nl
            ? `Ontdekkingenboekje, ${saved.found.length} van 7 gevonden`
            : `Discovery notebook, ${saved.found.length} of 7 found`
        }
      >
        <span aria-hidden="true">✧</span>
        <span>{nl ? "Ontdekkingen" : "Discoveries"}</span>
        <small>{saved.found.length}/7</small>
      </button>
      {active && (
        <DiscoveryDialog
          title={
            active === "book"
              ? nl
                ? "Je ontdekkingenboekje."
                : "Your discovery notebook."
              : labels[active]
          }
          onClose={close}
        >
          {active === "golf" && <GolfGame />}
          {active === "lab" && <PathfindingLab />}
          {active === "arcade" && <ReactionGame onDisable={close} />}
          {active === "book" && (
            <div className="discovery-book">
              <p>
                {nl
                  ? "Een portfolio met een paar zijpaadjes. Volg de hints en vind ze op je eigen tempo."
                  : "A portfolio with a few side paths. Follow the hints and discover them at your own pace."}
              </p>
              <div className="book-progress">
                <span>
                  {saved.found.length} / 7 {nl ? "gevonden" : "found"}
                </span>
                <progress max="7" value={saved.found.length} />
              </div>
              <ol className="discovery-list">
                {discoveryIds.map((id, index) => (
                  <li
                    key={id}
                    className={saved.found.includes(id) ? "is-found" : ""}
                  >
                    <span className="discovery-number">
                      {saved.found.includes(id)
                        ? "✓"
                        : String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3>
                        {saved.found.includes(id)
                          ? labels[id]
                          : nl
                            ? "Nog te ontdekken"
                            : "Still to discover"}
                      </h3>
                      <p>{hints[id]}</p>
                    </div>
                    {saved.found.includes(id) && (
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => revisit(id)}
                        aria-label={`${nl ? "Open" : "Open"} ${labels[id]}`}
                      >
                        ↗
                      </button>
                    )}
                  </li>
                ))}
              </ol>
              <p className="discovery-note">
                {nl ? "Records" : "Records"} · {nl ? "Golf" : "Golf"}:{" "}
                {saved.golfBest ?? "—"} {nl ? "slagen" : "strokes"} ·{" "}
                {nl ? "Reactie" : "Reaction"}: {saved.reactionBest ?? "—"} ms
              </p>
              <details className="accessible-secrets">
                <summary>
                  {nl
                    ? "Liever direct ontdekken?"
                    : "Prefer a direct discovery?"}
                </summary>
                <p>
                  {nl
                    ? "Alle ervaringen zijn ook bereikbaar zonder geheime toetsen of herhaald tikken."
                    : "Every experience is also available without secret keys or repeated tapping."}
                </p>
                <div className="game-actions">
                  {discoveryIds.map((id) => (
                    <button
                      key={id}
                      className="discovery-chip"
                      onClick={() => {
                        discover(id);
                        revisit(id);
                      }}
                    >
                      {labels[id]}
                    </button>
                  ))}
                </div>
              </details>
              <div className="game-actions">
                <button
                  className="discovery-chip"
                  aria-pressed={quiet}
                  onClick={() => setQuiet(!quiet)}
                >
                  {nl ? "Rustige weergave" : "Calm view"} {quiet ? "✓" : "+"}
                </button>
              </div>
              <div className="book-reset">
                {!resetPending ? (
                  <button
                    className="text-link"
                    onClick={() => setResetPending(true)}
                  >
                    {nl
                      ? "Voortgang en records wissen"
                      : "Clear progress and records"}
                  </button>
                ) : (
                  <>
                    <p>
                      {nl
                        ? "Alle ontdekkingen en lokale records wissen?"
                        : "Clear all discoveries and local records?"}
                    </p>
                    <div className="game-actions">
                      <button
                        className="button button-secondary"
                        onClick={() => {
                          resetDiscoveries();
                          setResetPending(false);
                          setFeedback(
                            nl
                              ? "Boekje en records gewist."
                              : "Notebook and records cleared.",
                          );
                        }}
                      >
                        {nl ? "Ja, wissen" : "Yes, clear"}
                      </button>
                      <button
                        className="button button-secondary"
                        onClick={() => setResetPending(false)}
                      >
                        {nl ? "Annuleren" : "Cancel"}
                      </button>
                    </div>
                  </>
                )}
                <p role="status">{feedback}</p>
              </div>
              <p className="discovery-note">
                {nl
                  ? "Bewaard in deze browser. Zonder browseropslag werkt alles voor dit bezoek."
                  : "Saved in this browser. Without browser storage, everything works for this visit."}
              </p>
            </div>
          )}
        </DiscoveryDialog>
      )}
    </>
  );
}
