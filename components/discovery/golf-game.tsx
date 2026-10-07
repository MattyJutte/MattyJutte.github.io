"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useLanguage } from "@/lib/use-language";
import {
  holes,
  newBall,
  moving,
  strike,
  stepBall,
  totalScore,
  WIDTH,
  HEIGHT,
  type Ball,
  type Point,
} from "@/lib/discovery/golf";
import {
  getResetGeneration,
  saveRecord,
  useDiscoveries,
} from "@/lib/discovery/store";
type Session = {
  holeIndex: number;
  ball: Ball;
  strokes: number;
  scores: number[];
  angle: number;
  power: number;
};
const fresh = (): Session => ({
  holeIndex: 0,
  ball: newBall(holes[0]),
  strokes: 0,
  scores: [],
  angle: 0,
  power: 65,
});
let savedSession: Session | null = null;
let savedGeneration = 0;
export default function GolfGame() {
  const { language } = useLanguage();
  const nl = language === "nl";
  const [game, setGame] = useState<Session>(() =>
    savedGeneration === getResetGeneration()
      ? (savedSession ?? fresh())
      : fresh(),
  );
  const latest = useRef(game);
  const [drag, setDrag] = useState<Point | null>(null);
  const dragging = useRef(false);
  const surface = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState("");
  const record = useDiscoveries().golfBest;
  const hole = holes[game.holeIndex];
  const done = game.scores.length === holes.length;
  const isMoving = moving(game.ball);
  useEffect(() => {
    latest.current = game;
    savedSession = game;
    savedGeneration = getResetGeneration();
  }, [game]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (surface.current) observer.observe(surface.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!isMoving || !visible) return;
    let frame = 0,
      previous = 0;
    const tick = (now: number) => {
      const dt = previous ? (now - previous) / 1000 : 0;
      previous = now;
      setGame((current) => {
        const ball = stepBall(current.ball, holes[current.holeIndex], dt);
        return { ...current, ball };
      });
      frame = requestAnimationFrame(tick);
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", refresh);
    refresh();
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [isMoving, visible]);
  useEffect(() => {
    if (!game.ball.sunk) return;
    const scores = [...game.scores.slice(0, game.holeIndex), game.strokes];
    if (game.holeIndex === holes.length - 1)
      saveRecord("golfBest", totalScore(scores));
  }, [game.ball.sunk, game.holeIndex, game.scores, game.strokes]);
  function shoot(angle = game.angle, power = game.power) {
    setGame((current) =>
      moving(current.ball) || current.ball.sunk
        ? current
        : {
            ...current,
            ball: strike(current.ball, angle, power),
            strokes: current.strokes + 1,
            angle,
            power,
          },
    );
    setMessage("");
  }
  function coordinates(event: PointerEvent<SVGSVGElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    };
  }
  function aim(point: Point) {
    const dx = latest.current.ball.x - point.x,
      dy = latest.current.ball.y - point.y;
    setGame((current) => ({
      ...current,
      angle: (Math.atan2(dy, dx) * 180) / Math.PI,
      power: Math.min(100, Math.round(Math.hypot(dx, dy) / 1.8)),
    }));
    setDrag(point);
  }
  function nextHole() {
    const scores = [...game.scores.slice(0, game.holeIndex), game.strokes];
    if (game.holeIndex === holes.length - 1) setGame({ ...game, scores });
    else
      setGame({
        ...game,
        scores,
        holeIndex: game.holeIndex + 1,
        ball: newBall(holes[game.holeIndex + 1]),
        strokes: 0,
        angle: 0,
      });
  }
  return (
    <div className="golf-game">
      <div className="game-stats">
        <span>
          {nl ? "Hole" : "Hole"} <strong>{game.holeIndex + 1} / 3</strong>
        </span>
        <span>
          Par <strong>{hole.par}</strong>
        </span>
        <span>
          {nl ? "Slagen" : "Strokes"} <strong>{game.strokes}</strong>
        </span>
        <span>
          {nl ? "Record" : "Best"} <strong>{record ?? "—"}</strong>
        </span>
      </div>
      <p className="game-instructions">
        {nl
          ? "Sleep vanaf de bal naar achteren en laat los om te slaan. Of stel richting en kracht hieronder in."
          : "Drag backwards from the ball and release to shoot. Or set direction and power below."}
      </p>
      <svg
        ref={surface}
        className="golf-course"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={
          nl
            ? `Minigolfbaan ${game.holeIndex + 1}. Bal op ${Math.round(game.ball.x)}, ${Math.round(game.ball.y)}.`
            : `Mini golf course ${game.holeIndex + 1}. Ball at ${Math.round(game.ball.x)}, ${Math.round(game.ball.y)}.`
        }
        onPointerDown={(event) => {
          if (isMoving || game.ball.sunk || done) return;
          const point = coordinates(event);
          if (Math.hypot(point.x - game.ball.x, point.y - game.ball.y) > 45)
            return;
          event.currentTarget.setPointerCapture(event.pointerId);
          dragging.current = true;
          setDrag(point);
        }}
        onPointerMove={(event) => {
          if (dragging.current) aim(coordinates(event));
        }}
        onPointerUp={(event) => {
          if (!dragging.current) return;
          const point = coordinates(event);
          const dx = game.ball.x - point.x,
            dy = game.ball.y - point.y;
          dragging.current = false;
          setDrag(null);
          if (Math.hypot(dx, dy) > 5)
            shoot(
              (Math.atan2(dy, dx) * 180) / Math.PI,
              Math.min(100, Math.hypot(dx, dy) / 1.8),
            );
        }}
        onPointerCancel={() => {
          dragging.current = false;
          setDrag(null);
        }}
      >
        <defs>
          <pattern
            id="golf-dots"
            width="25"
            height="25"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="12" cy="12" r="1" fill="currentColor" opacity=".12" />
          </pattern>
        </defs>
        <rect
          x="20"
          y="20"
          width="560"
          height="320"
          rx="18"
          className="course-green"
        />
        <rect
          x="22"
          y="22"
          width="556"
          height="316"
          rx="16"
          fill="url(#golf-dots)"
        />
        <text x="40" y="53" className="course-label">
          MJ / {String(game.holeIndex + 1).padStart(2, "0")}
        </text>
        {hole.obstacles.map((card, i) => (
          <g key={i}>
            <rect {...card} rx="6" className="course-card" />
            <text
              x={card.x + card.width / 2}
              y={card.y + 35}
              textAnchor="middle"
              className="course-label"
            >
              {"</>"}
            </text>
          </g>
        ))}
        <circle cx={hole.cup.x} cy={hole.cup.y} r="12" className="course-cup" />
        <path
          d={`M${hole.cup.x} ${hole.cup.y}v-35l20 8-20 8`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
        />
        <text x={hole.cup.x - 25} y={hole.cup.y + 32} className="course-label">
          ✧
        </text>
        {!isMoving && !game.ball.sunk && !done && (
          <line
            x1={game.ball.x}
            y1={game.ball.y}
            x2={
              game.ball.x +
              Math.cos((game.angle * Math.PI) / 180) * (25 + game.power)
            }
            y2={
              game.ball.y +
              Math.sin((game.angle * Math.PI) / 180) * (25 + game.power)
            }
            stroke="var(--accent)"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
        )}
        {drag && (
          <line
            x1={game.ball.x}
            y1={game.ball.y}
            x2={drag.x}
            y2={drag.y}
            stroke="var(--muted)"
            strokeWidth="1"
          />
        )}
        {!game.ball.sunk && (
          <>
            <circle
              cx={game.ball.x}
              cy={game.ball.y}
              r="20"
              fill="transparent"
            />
            <circle
              cx={game.ball.x}
              cy={game.ball.y}
              r="7"
              fill="var(--text)"
              stroke="var(--accent-strong)"
              strokeWidth="2"
            />
          </>
        )}
      </svg>
      <div className="game-feedback" role="status">
        {done
          ? nl
            ? `Ronde voltooid! ${totalScore(game.scores)} slagen voor drie holes.`
            : `Round complete! ${totalScore(game.scores)} strokes across three holes.`
          : game.ball.sunk
            ? nl
              ? `Raak! ${game.strokes} slagen.`
              : `In the cup! ${game.strokes} strokes.`
            : message ||
              (isMoving
                ? nl
                  ? "De bal rolt…"
                  : "Ball rolling…"
                : nl
                  ? "Jouw beurt. De stippellijn toont de richting."
                  : "Your turn. The dotted line shows the direction.")}
      </div>
      {!done && !game.ball.sunk && (
        <div
          className="golf-controls"
          onKeyDown={(event) => {
            if (event.target instanceof HTMLInputElement) return;
            if (
              ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(
                event.key,
              )
            ) {
              event.preventDefault();
              if (isMoving) return;
              if (event.key === " ") shoot();
              else
                setGame((current) => ({
                  ...current,
                  angle:
                    current.angle +
                    (event.key === "ArrowLeft"
                      ? -5
                      : event.key === "ArrowRight"
                        ? 5
                        : 0),
                  power: Math.max(
                    1,
                    Math.min(
                      100,
                      current.power +
                        (event.key === "ArrowUp"
                          ? 5
                          : event.key === "ArrowDown"
                            ? -5
                            : 0),
                    ),
                  ),
                }));
            }
          }}
        >
          <label>
            {nl ? "Richting" : "Direction"}{" "}
            <output>{Math.round(game.angle)}°</output>
            <input
              aria-label={nl ? "Richting" : "Direction"}
              type="range"
              min="-180"
              max="180"
              value={((game.angle + 540) % 360) - 180}
              disabled={isMoving}
              onChange={(event) =>
                setGame({ ...game, angle: Number(event.target.value) })
              }
            />
          </label>
          <label>
            {nl ? "Kracht" : "Power"} <output>{Math.round(game.power)}%</output>
            <input
              aria-label={nl ? "Kracht" : "Power"}
              type="range"
              min="1"
              max="100"
              value={game.power}
              disabled={isMoving}
              onChange={(event) =>
                setGame({ ...game, power: Number(event.target.value) })
              }
            />
          </label>
          <button
            type="button"
            className="button button-primary"
            disabled={isMoving}
            onClick={() => shoot()}
          >
            {nl ? "Slaan" : "Shoot"} ↗
          </button>
          <small>
            {nl
              ? "Pijltjestoetsen: richting/kracht · spatie: slaan (bij de slagknop)."
              : "Arrow keys: direction/power · space: shoot (on the shoot button)."}
          </small>
        </div>
      )}
      <div className="game-actions">
        {game.ball.sunk && !done && (
          <button className="button button-primary" onClick={nextHole}>
            {game.holeIndex === 2
              ? nl
                ? "Eindresultaat"
                : "Final result"
              : nl
                ? "Volgende hole"
                : "Next hole"}{" "}
            →
          </button>
        )}
        {!done && (
          <button
            className="button button-secondary"
            onClick={() => {
              setGame({ ...game, ball: newBall(hole), strokes: 0 });
              setDrag(null);
              dragging.current = false;
              setMessage(nl ? "Hole opnieuw gestart." : "Hole restarted.");
            }}
          >
            {nl ? "Hole opnieuw" : "Retry hole"}
          </button>
        )}
        {!done && (
          <button
            className="button button-secondary"
            disabled={isMoving || game.ball.sunk}
            onClick={() => {
              setGame({
                ...game,
                ball: newBall(hole),
                strokes: game.strokes + 1,
              });
              setMessage(
                nl
                  ? "Bal terug op de start (+1 strafslag)."
                  : "Ball returned to the start (+1 penalty stroke).",
              );
            }}
          >
            {nl ? "Bal terug (+1)" : "Return ball (+1)"}
          </button>
        )}
        <button
          className="button button-secondary"
          onClick={() => {
            setGame(fresh());
            setMessage("");
            setDrag(null);
            dragging.current = false;
          }}
        >
          {nl ? "Nieuwe ronde" : "New round"}
        </button>
      </div>
      <p className="discovery-note">
        {nl
          ? "Sluiten bewaart je ronde voor dit bezoek. Je beste volledige ronde blijft lokaal bewaard."
          : "Closing keeps your round for this visit. Your best complete round is saved locally."}
      </p>
    </div>
  );
}
