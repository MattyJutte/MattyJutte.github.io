"use client";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/use-language";
import { saveRecord, useDiscoveries } from "@/lib/discovery/store";
type Phase = "idle" | "waiting" | "ready" | "early" | "done";
export default function ReactionGame({ onDisable }: { onDisable: () => void }) {
  const nl = useLanguage().language === "nl";
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState(0);
  const [retro, setRetro] = useState(false);
  const litAt = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const record = useDiscoveries().reactionBest;
  useEffect(() => {
    document.documentElement.classList.toggle("arcade-retro", retro);
    return () => document.documentElement.classList.remove("arcade-retro");
  }, [retro]);
  useEffect(() => {
    if (phase !== "waiting") return;
    const timer = window.setTimeout(
      () => {
        litAt.current = performance.now();
        phaseRef.current = "ready";
        setPhase("ready");
      },
      1600 + Math.random() * 2300,
    );
    return () => clearTimeout(timer);
  }, [phase]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) {
        phaseRef.current = "idle";
        setPhase("idle");
      }
    };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, []);
  function activate() {
    const current = phaseRef.current;
    if (current === "waiting") {
      phaseRef.current = "early";
      setPhase("early");
    } else if (current === "ready") {
      const elapsed = Math.max(
        1,
        Math.round(performance.now() - litAt.current),
      );
      setResult(elapsed);
      saveRecord("reactionBest", elapsed);
      phaseRef.current = "done";
      setPhase("done");
    } else {
      phaseRef.current = "waiting";
      setPhase("waiting");
    }
  }
  const labels = nl
    ? {
        idle: "Start reactietest",
        waiting: "Wacht op de ster…",
        ready: "NU! Tik op de ster",
        early: "Te vroeg! Probeer opnieuw",
        done: "Nog een keer",
      }
    : {
        idle: "Start reaction test",
        waiting: "Wait for the star…",
        ready: "NOW! Tap the star",
        early: "Too early! Try again",
        done: "Try again",
      };
  return (
    <div className="reaction-game">
      <div className="arcade-reveal">
        <span aria-hidden="true">✧</span>
        <p className="eyebrow">
          {nl ? "GEHEIM ONTGRENDELD" : "SECRET UNLOCKED"} / 07
        </p>
        <h3>{nl ? "Welkom in de Arcade." : "Welcome to the Arcade."}</h3>
        <p>
          {nl
            ? "Een kleine pauze tussen de regels code."
            : "A little break between the lines of code."}
        </p>
      </div>
      <p className="game-instructions">
        {nl
          ? "Start de test. Wacht tot de ster groen wordt en “NU!” verschijnt. Tik dan zo snel mogelijk, of gebruik Enter/spatie."
          : "Start the test. Wait until the star turns green and “NOW!” appears. Then tap as fast as you can, or use Enter/space."}
      </p>
      <button className={`reaction-target phase-${phase}`} onClick={activate}>
        <span aria-hidden="true">✦</span>
        <strong>{labels[phase]}</strong>
      </button>
      <div className="game-feedback" role="status">
        {phase === "done"
          ? `${result} ms · ${nl ? "Record" : "Best"}: ${record} ms`
          : phase === "early"
            ? nl
              ? "Je tikte voordat de ster oplichtte. Geen score."
              : "You tapped before the star lit up. No score."
            : phase === "ready"
              ? labels.ready
              : nl
                ? `Lokaal record: ${record ?? "—"} ms`
                : `Local best: ${record ?? "—"} ms`}
      </div>
      <div className="game-actions">
        <button
          className="button button-secondary"
          aria-pressed={retro}
          onClick={() => setRetro(!retro)}
        >
          {nl ? "Retro-uitstraling" : "Retro look"} {retro ? "✓" : "+"}
        </button>
        <button className="button button-secondary" onClick={onDisable}>
          {nl ? "Arcade uitschakelen" : "Turn off Arcade"}
        </button>
      </div>
      <p className="discovery-note">
        {nl
          ? "Je record blijft lokaal bewaard. Sluiten beëindigt de test en de retro-uitstraling."
          : "Your record is saved locally. Closing ends the test and the retro look."}
      </p>
    </div>
  );
}
