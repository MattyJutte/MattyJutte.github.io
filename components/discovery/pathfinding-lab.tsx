"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useLanguage } from "@/lib/use-language";
import { breadthFirstSearch } from "@/lib/discovery/pathfinding";
import { traceCells } from "@/lib/discovery/grid";
import { assetPath } from "@/lib/asset-path";
const ROWS = 8,
  COLS = 10,
  SIZE = ROWS * COLS;
type Tool = "wall" | "erase" | "start" | "end";
export default function PathfindingLab() {
  const nl = useLanguage().language === "nl";
  const [walls, setWalls] = useState<Set<number>>(new Set());
  const [start, setStart] = useState(31),
    [end, setEnd] = useState(38);
  const [tool, setTool] = useState<Tool>("wall");
  const [running, setRunning] = useState(false),
    [cursor, setCursor] = useState(0);
  const [speed, setSpeed] = useState(35);
  const [result, setResult] = useState<ReturnType<
    typeof breadthFirstSearch
  > | null>(null);
  const [showCode, setShowCode] = useState(false),
    [source, setSource] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [focusedCell, setFocusedCell] = useState(0);
  const grid = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const lastCell = useRef(-1);
  const [visible, setVisible] = useState(true);
  const complete = result !== null && cursor >= result.visited.length;
  const visited = new Set(result?.visited.slice(0, cursor));
  const path = new Set(complete ? result?.path : []);
  useEffect(() => {
    let inView = true;
    const onVisibility = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      onVisibility();
    });
    if (grid.current) observer.observe(grid.current);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  useEffect(() => {
    if (!running || !visible || !result) return;
    const timer = window.setTimeout(() => {
      const next = Math.min(cursor + 1, result.visited.length);
      setCursor(next);
      if (next >= result.visited.length) setRunning(false);
    }, 1000 / speed);
    return () => clearTimeout(timer);
  }, [running, visible, result, cursor, speed]);
  useEffect(() => {
    if (!showCode || source) return;
    const controller = new AbortController();
    fetch(assetPath("/code/pathfinding.ts"), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("source");
        return response.text();
      })
      .then(setSource)
      .catch((error) => {
        if (error.name !== "AbortError") setCodeError(true);
      });
    return () => controller.abort();
  }, [showCode, source]);
  function clearSearch() {
    setRunning(false);
    setResult(null);
    setCursor(0);
  }
  function edit(cell: number) {
    if (cell < 0 || cell >= SIZE) return;
    clearSearch();
    if (tool === "start" && cell !== end) {
      setStart(cell);
      setWalls((current) => {
        const next = new Set(current);
        next.delete(cell);
        return next;
      });
    } else if (tool === "end" && cell !== start) {
      setEnd(cell);
      setWalls((current) => {
        const next = new Set(current);
        next.delete(cell);
        return next;
      });
    } else if (tool === "wall" || tool === "erase") {
      if (cell === start || cell === end) return;
      setWalls((current) => {
        const next = new Set(current);
        if (tool === "wall") next.add(cell);
        else next.delete(cell);
        return next;
      });
    }
  }
  function cellAt(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * COLS),
      y = Math.floor(((event.clientY - rect.top) / rect.height) * ROWS);
    return x >= 0 && x < COLS && y >= 0 && y < ROWS ? y * COLS + x : -1;
  }
  function play() {
    if (running) {
      setRunning(false);
      return;
    }
    if (!result || complete) {
      setResult(breadthFirstSearch(ROWS, COLS, walls, start, end));
      setCursor(0);
    }
    setRunning(true);
  }
  return (
    <div>
      <p className="game-instructions">
        {nl
          ? "Kies een gereedschap en tik op het raster. Sleep om muren te tekenen of te wissen. S = start, E = eind."
          : "Choose a tool and tap the grid. Drag to draw or erase walls. S = start, E = end."}
      </p>
      <div
        className="lab-tools"
        aria-label={nl ? "Rastergereedschap" : "Grid tools"}
      >
        {(["wall", "erase", "start", "end"] as Tool[]).map((item, i) => (
          <button
            key={item}
            className="discovery-chip"
            aria-pressed={tool === item}
            onClick={() => setTool(item)}
            onPointerUp={(event) => {
              // Touch tools respond directly, including after a captured brush stroke.
              if (event.pointerType === "touch") setTool(item);
            }}
          >
            {
              (nl
                ? ["Muur", "Wissen", "Start", "Eind"]
                : ["Wall", "Erase", "Start", "End"])[i]
            }
          </button>
        ))}
      </div>
      <div
        ref={grid}
        className="path-grid"
        role="grid"
        aria-label={
          nl
            ? "Padzoekraster, gebruik pijltjes en Enter"
            : "Pathfinding grid, use arrow keys and Enter"
        }
        aria-rowcount={ROWS}
        aria-colcount={COLS}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          drawing.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          const cell = cellAt(event);
          lastCell.current = cell;
          edit(cell);
        }}
        onPointerMove={(event) => {
          if (drawing.current && (tool === "wall" || tool === "erase")) {
            const cell = cellAt(event);
            if (cell < 0) {
              lastCell.current = -1;
              return;
            }
            const samples =
              lastCell.current < 0
                ? [cell]
                : traceCells(lastCell.current, cell, COLS);
            samples.forEach(edit);
            lastCell.current = cell;
          }
        }}
        onPointerUp={() => {
          drawing.current = false;
        }}
        onPointerCancel={() => {
          drawing.current = false;
        }}
      >
        {Array.from({ length: ROWS }, (_, row) => (
          <div className="path-row" role="row" key={row}>
            {Array.from({ length: COLS }, (_, column) => {
              const cell = row * COLS + column;
              const kind =
                cell === start
                  ? "start"
                  : cell === end
                    ? "end"
                    : walls.has(cell)
                      ? "wall"
                      : path.has(cell)
                        ? "path"
                        : visited.has(cell)
                          ? "visited"
                          : "empty";
              return (
                <button
                  type="button"
                  role="gridcell"
                  key={cell}
                  tabIndex={focusedCell === cell ? 0 : -1}
                  aria-label={`${row + 1}, ${column + 1}: ${(nl ? { start: "start", end: "eind", wall: "muur", path: "route", visited: "bezocht", empty: "leeg" } : { start: "start", end: "end", wall: "wall", path: "path", visited: "visited", empty: "empty" })[kind]}`}
                  className={`path-cell is-${kind}`}
                  onFocus={() => setFocusedCell(cell)}
                  onClick={(event) => {
                    if (event.detail === 0) edit(cell);
                  }}
                  onKeyDown={(event) => {
                    let next = cell;
                    if (event.key === "ArrowLeft")
                      next = row * COLS + Math.max(0, column - 1);
                    else if (event.key === "ArrowRight")
                      next = row * COLS + Math.min(COLS - 1, column + 1);
                    else if (event.key === "ArrowUp")
                      next = Math.max(0, row - 1) * COLS + column;
                    else if (event.key === "ArrowDown")
                      next = Math.min(ROWS - 1, row + 1) * COLS + column;
                    else return;
                    event.preventDefault();
                    setFocusedCell(next);
                    grid.current
                      ?.querySelectorAll<HTMLButtonElement>("button")
                      [next]?.focus();
                  }}
                >
                  {kind === "start" ? "S" : kind === "end" ? "E" : ""}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="grid-legend">
        <span>
          <i className="is-wall" />
          {nl ? "Muur" : "Wall"}
        </span>
        <span>
          <i className="is-visited" />
          {nl ? "Bezocht" : "Visited"}
        </span>
        <span>
          <i className="is-path" />
          {nl ? "Kortste route" : "Shortest path"}
        </span>
      </div>
      <div className="game-feedback" role="status">
        {complete
          ? result.found
            ? nl
              ? `Route gevonden: ${result.path.length - 1} stappen. ${cursor} vakjes onderzocht.`
              : `Route found: ${result.path.length - 1} steps. ${cursor} cells explored.`
            : nl
              ? "Geen route. Het eindpunt is onbereikbaar; wis een muur en probeer opnieuw."
              : "No route. The end is unreachable; erase a wall and try again."
          : result
            ? nl
              ? `${running ? "Zoeken" : "Gepauzeerd"} · ${cursor} vakjes onderzocht`
              : `${running ? "Searching" : "Paused"} · ${cursor} cells explored`
            : nl
              ? "Maak je eigen doolhof of laad het voorbeeld."
              : "Create a maze or load the example."}
      </div>
      <div className="game-actions">
        <button className="button button-primary" onClick={play}>
          {running
            ? nl
              ? "Pauzeren"
              : "Pause"
            : result && !complete
              ? nl
                ? "Hervatten"
                : "Resume"
              : nl
                ? "Start zoeken"
                : "Start search"}
        </button>
        <button
          className="button button-secondary"
          onClick={() => {
            clearSearch();
            setWalls(new Set());
            setStart(31);
            setEnd(38);
          }}
        >
          {nl ? "Reset raster" : "Reset grid"}
        </button>
        <button
          className="button button-secondary"
          onClick={() => {
            clearSearch();
            setStart(31);
            setEnd(38);
            setWalls(
              new Set(
                Array.from({ length: ROWS }, (_, row) => row * COLS + 5).filter(
                  (cell) => cell !== 65,
                ),
              ),
            );
          }}
        >
          {nl ? "Voorbeeld" : "Example"}
        </button>
        <label className="speed-control">
          {nl ? "Snelheid" : "Speed"}: {speed}
          <input
            aria-label={nl ? "Zoeksnelheid" : "Search speed"}
            type="range"
            min="5"
            max="100"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
          />
        </label>
      </div>
      <div className="lab-explanation">
        <h3>
          {nl
            ? "Eerst dichtbij. Dan een stap verder."
            : "Nearby first. Then one step further."}
        </h3>
        <p>
          {nl
            ? "Breadth-first search (BFS) onderzoekt buren in lagen. Een wachtrij onthoudt welk vakje aan de beurt is; ieder vakje wordt maar één keer toegevoegd. Vanaf het eind volgen we de voorgangers terug naar de start."
            : "Breadth-first search (BFS) explores neighbours in layers. A queue tracks the next cell; every cell is added just once. From the end, we follow the parents back to the start."}
        </p>
        <p>
          {nl
            ? "Technische keuze: vier richtingen, gelijke stapkosten. Daardoor vindt BFS de kortste route zonder ingewikkelde prioriteiten. De zoeklogica staat los van de animatie: pauzeren verandert het resultaat niet."
            : "Technical choice: four directions with equal step costs. This lets BFS find the shortest path without a priority queue. Search logic is separate from animation: pausing does not change the result."}
        </p>
        <button
          className="text-link"
          aria-expanded={showCode}
          onClick={() => setShowCode(!showCode)}
        >
          {showCode
            ? nl
              ? "Code verbergen"
              : "Hide code"
            : nl
              ? "Bekijk de code"
              : "View the code"}{" "}
          {"</>"}
        </button>
        {showCode && (
          <div className="source-view">
            <p>
              <a
                href={assetPath("/code/pathfinding.ts")}
                className="text-link"
                target="_blank"
                rel="noreferrer"
              >
                lib/discovery/pathfinding.ts ↗
              </a>
            </p>
            <pre tabIndex={0}>
              <code>
                {source ||
                  (codeError
                    ? nl
                      ? "Open het bronbestand via de link hierboven."
                      : "Open the source file using the link above."
                    : nl
                      ? "Code laden…"
                      : "Loading code…")}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
