"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { SiteContent } from "@/data/content";

const COUNT = 180;
// Gelijkmatig verdeelde punten op een bol, zonder 3D-bibliotheek.
const stars = Array.from({ length: COUNT }, (_, i) => {
  const y = 1 - (i / (COUNT - 1)) * 2;
  const radius = Math.sqrt(1 - y * y);
  const angle = i * Math.PI * (3 - Math.sqrt(5));
  return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
});
const edges = stars.flatMap((star, i) =>
  stars
    .slice(i + 1)
    .flatMap((other, offset) =>
      Math.hypot(star.x - other.x, star.y - other.y, star.z - other.z) < 0.29
        ? [[i, i + offset + 1]]
        : [],
    ),
);

export function SignatureConstellation({
  children,
  labels,
}: {
  children: ReactNode;
  labels: SiteContent["hero"]["constellation"];
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [signature, setSignature] = useState(false);
  const [paused, setPaused] = useState(false);
  const target = useRef(false);
  const redraw = useRef<(() => void) | null>(null);

  useEffect(() => {
    const surface = canvas.current;
    const area = stage.current;
    if (!surface || !area) return;
    const ctx = surface.getContext("2d");
    if (!ctx) return;

    // De persoonlijke letters worden als punten bemonsterd, niet als afbeelding geladen.
    const mask = document.createElement("canvas");
    mask.width = 240;
    mask.height = 160;
    const ink = mask.getContext("2d");
    if (!ink) return;
    ink.font = "bold 130px Arial";
    ink.textAlign = "center";
    ink.textBaseline = "middle";
    ink.fillText(labels.initials, 120, 85);
    const pixels = ink.getImageData(0, 0, 240, 160).data;
    const letters: { x: number; y: number }[] = [];
    for (let y = 0; y < 160; y += 5) {
      for (let x = 0; x < 240; x += 5) {
        if (pixels[(y * 240 + x) * 4 + 3] > 100)
          letters.push({ x: (x - 120) / 120, y: (y - 80) / 120 });
      }
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let width = 0;
    let height = 0;
    let frame = 0;
    let previous = 0;
    let time = 0;
    let blend = target.current ? 1 : 0;
    let color = "";
    let light = false;
    const pointer = { x: -1000, y: -1000 };
    let ripple: { x: number; y: number; age: number } | null = null;

    function draw(now: number) {
      frame = 0;
      const animate = !paused && !motion.matches;
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      if (animate) time += dt;
      blend = animate
        ? blend + ((target.current ? 1 : 0) - blend) * Math.min(1, dt * 4)
        : Number(target.current);
      ctx!.clearRect(0, 0, width, height);
      const radius = Math.min(width * 0.47, height * 0.47);
      const turn = time * 0.12;
      const points = stars.map((star, i) => {
        const x = star.x * Math.cos(turn) - star.z * Math.sin(turn);
        const z = star.x * Math.sin(turn) + star.z * Math.cos(turn);
        const letter = letters[Math.floor((i * letters.length) / COUNT)] ?? {
          x: 0,
          y: 0,
        };
        let px = width / 2 + (x * (1 - blend) + letter.x * blend) * radius;
        let py =
          height / 2 + (star.y * (1 - blend) + letter.y * blend) * radius;
        if (animate) {
          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const distance = Math.hypot(dx, dy);
          const force = Math.max(0, 1 - distance / 110) * 22;
          px += (dx / (distance || 1)) * force;
          py += (dy / (distance || 1)) * force;
          if (ripple) {
            const rx = px - ripple.x;
            const ry = py - ripple.y;
            const length = Math.hypot(rx, ry);
            const wave =
              Math.exp(-Math.pow((length - ripple.age * 230) / 32, 2)) *
              16 *
              Math.max(0, 1 - ripple.age / 2);
            px += (rx / (length || 1)) * wave;
            py += (ry / (length || 1)) * wave;
          }
        }
        return { x: px, y: py, depth: (z + 1) / 2 };
      });
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 0.7;
      for (const [a, b] of edges) {
        const p = points[a];
        const q = points[b];
        ctx!.globalAlpha =
          (light ? 0.24 : 0.2) * (0.3 + p.depth * 0.7) * (1 - blend);
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(q.x, q.y);
        ctx!.stroke();
      }
      ctx!.fillStyle = color;
      for (const point of points) {
        ctx!.globalAlpha =
          0.22 + point.depth * 0.65 + blend * (0.78 - point.depth * 0.65);
        ctx!.beginPath();
        ctx!.arc(
          point.x,
          point.y,
          0.8 + point.depth * 1.2 + blend * 0.5,
          0,
          Math.PI * 2,
        );
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      if (ripple && animate) {
        ripple.age += dt;
        if (ripple.age > 2) ripple = null;
      }
      if (animate && visible && !document.hidden)
        frame = requestAnimationFrame(draw);
    }

    function refresh() {
      cancelAnimationFrame(frame);
      previous = 0;
      if (visible && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function resize() {
      ({ width, height } = area!.getBoundingClientRect());
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      surface!.width = Math.round(width * dpr);
      surface!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      refresh();
    }
    function theme() {
      color = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();
      light = document.documentElement.dataset.theme === "light";
      refresh();
    }
    function move(event: PointerEvent) {
      const rect = area!.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }
    function leave() {
      pointer.x = -1000;
      pointer.y = -1000;
    }
    function pulse(event: PointerEvent) {
      move(event);
      ripple = { ...pointer, age: 0 };
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(area);
    const themeObserver = new MutationObserver(theme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });
    visibilityObserver.observe(area);
    area.addEventListener("pointermove", move, { passive: true });
    area.addEventListener("pointerdown", pulse, { passive: true });
    area.addEventListener("pointerleave", leave);
    area.addEventListener("pointerup", leave);
    document.addEventListener("visibilitychange", refresh);
    motion.addEventListener("change", refresh);
    redraw.current = refresh;
    theme();
    resize();
    return () => {
      redraw.current = null;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerdown", pulse);
      area.removeEventListener("pointerleave", leave);
      area.removeEventListener("pointerup", leave);
      document.removeEventListener("visibilitychange", refresh);
      motion.removeEventListener("change", refresh);
    };
  }, [labels.initials, paused]);

  useEffect(() => {
    target.current = signature;
    redraw.current?.();
  }, [signature]);

  return (
    <figure
      className={`hero-portrait constellation ${signature ? "is-signature" : ""}`}
    >
      <div ref={stage} className="constellation-stage">
        <div className="constellation-orbit" aria-hidden="true" />
        <div className="constellation-photo">{children}</div>
        <canvas
          ref={canvas}
          className="constellation-canvas"
          aria-hidden="true"
        />
        <span className="constellation-caption" aria-hidden="true">
          {labels.initials} / 01
        </span>
      </div>
      <figcaption className="constellation-controls">
        <p className="constellation-label">{labels.label}</p>
        <div>
          <button
            className="signature-button"
            type="button"
            aria-pressed={signature}
            onClick={() => setSignature(!signature)}
          >
            <span aria-hidden="true">✧</span>{" "}
            {signature ? labels.scatter : labels.assemble}
          </button>
          <button
            className="icon-button constellation-pause"
            type="button"
            aria-label={paused ? labels.play : labels.pause}
            onClick={() => setPaused(!paused)}
          >
            <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
          </button>
        </div>
        <p className="constellation-hint">{labels.hint}</p>
      </figcaption>
    </figure>
  );
}
