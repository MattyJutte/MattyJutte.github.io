import test from "node:test";
import assert from "node:assert/strict";
import { traceCells } from "../lib/discovery/grid.ts";
import { breadthFirstSearch } from "../lib/discovery/pathfinding.ts";
import {
  newBall,
  strike,
  stepBall,
  holes,
  moving,
  RADIUS,
  totalScore,
  bestScore,
} from "../lib/discovery/golf.ts";
import {
  advanceSecret,
  advanceTaps,
  parseSave,
  emptySave,
  konami,
} from "../lib/discovery/secrets.ts";

test("BFS returns the shortest orthogonal path without row wrapping", () => {
  const result = breadthFirstSearch(4, 4, new Set([1, 5, 9]), 0, 3);
  assert.equal(result.found, true);
  assert.equal(result.path.length - 1, 9);
  assert.equal(new Set(result.visited).size, result.visited.length);
  for (let i = 1; i < result.path.length; i++) {
    const a = result.path[i - 1],
      b = result.path[i];
    assert.equal(
      Math.abs(Math.floor(a / 4) - Math.floor(b / 4)) +
        Math.abs((a % 4) - (b % 4)),
      1,
    );
    assert.equal(new Set([1, 5, 9]).has(b), false);
  }
});
test("BFS reports no route, invalid endpoints, and start=end", () => {
  assert.equal(breadthFirstSearch(3, 3, new Set([1, 3]), 0, 8).found, false);
  assert.equal(breadthFirstSearch(3, 3, new Set([0]), 0, 8).found, false);
  assert.equal(breadthFirstSearch(3, 3, new Set(), -1, 8).found, false);
  assert.deepEqual(breadthFirstSearch(3, 3, new Set(), 4, 4).path, [4]);
});
test("golf wall collision reflects, clamps and cannot tunnel through cards", () => {
  let ball = { x: 28, y: 80, vx: -500, vy: 0, sunk: false };
  ball = stepBall(ball, holes[0], 0.05);
  assert.ok(ball.x >= 20 + RADIUS);
  assert.ok(ball.vx > 0);
  ball = { x: 250, y: 100, vx: 500, vy: 0, sunk: false };
  ball = stepBall(ball, holes[0], 0.05);
  assert.ok(ball.x <= 270 - RADIUS);
  assert.ok(ball.vx < 0);
});
test("golf friction stops the ball; slow cup crossing sinks, fast crossing does not", () => {
  let ball = strike(newBall(holes[0]), 0, 100);
  for (let i = 0; i < 1800 && moving(ball); i++)
    ball = stepBall(ball, holes[0], 1 / 120);
  assert.equal(moving(ball), false);
  assert.equal(
    stepBall({ x: 512, y: 180, vx: 100, vy: 0, sunk: false }, holes[0], 0.05)
      .sunk,
    true,
  );
  assert.equal(
    stepBall({ x: 500, y: 180, vx: 500, vy: 0, sunk: false }, holes[0], 0.05)
      .sunk,
    false,
  );
});
test("all three courses keep sampled shots finite, outside cards, and eventually at rest", () => {
  for (const hole of holes)
    for (let angle = -180; angle < 180; angle += 15) {
      let ball = strike(newBall(hole), angle, 100);
      for (let step = 0; step < 1500 && moving(ball); step++) {
        ball = stepBall(ball, hole, 1 / 120);
        assert.ok(Number.isFinite(ball.x) && Number.isFinite(ball.y));
        assert.ok(
          ball.x >= 27 && ball.x <= 573 && ball.y >= 27 && ball.y <= 333,
        );
        for (const card of hole.obstacles) {
          const x = Math.max(card.x, Math.min(card.x + card.width, ball.x));
          const y = Math.max(card.y, Math.min(card.y + card.height, ball.y));
          assert.ok(Math.hypot(ball.x - x, ball.y - y) >= RADIUS - 0.001);
        }
      }
      assert.equal(moving(ball), false);
    }
});
test("each course is playable by shooting along an obstacle-free route", () => {
  const routes = [
    [{ x: 525, y: 180 }],
    [
      { x: 100, y: 95 },
      { x: 330, y: 95 },
      { x: 330, y: 270 },
      { x: 510, y: 270 },
      { x: 530, y: 75 },
    ],
    [
      { x: 95, y: 80 },
      { x: 245, y: 80 },
      { x: 245, y: 255 },
      { x: 380, y: 255 },
      { x: 380, y: 70 },
      { x: 535, y: 65 },
    ],
  ];
  for (let i = 0; i < holes.length; i++) {
    let ball = newBall(holes[i]);
    for (const target of routes[i]) {
      // Find a power that stops close to the target; damping is monotonic on clear segments.
      let best = null,
        distance = Infinity;
      const angle =
        (Math.atan2(target.y - ball.y, target.x - ball.x) * 180) / Math.PI;
      for (let power = 1; power <= 100; power += 0.25) {
        let candidate = strike(ball, angle, power);
        for (let step = 0; step < 1500 && moving(candidate); step++)
          candidate = stepBall(candidate, holes[i], 1 / 120);
        const error = Math.hypot(
          candidate.x - target.x,
          candidate.y - target.y,
        );
        if (error < distance) {
          distance = error;
          best = candidate;
        }
      }
      assert.ok(
        distance < 12,
        `course ${i + 1}, waypoint ${JSON.stringify(target)} error ${distance}`,
      );
      ball = best;
    }
    assert.equal(ball.sunk, true, `course ${i + 1} must be completable`);
  }
});
test("scores and records count a full round, retaining the lower result", () => {
  assert.equal(totalScore([2, 3, 4]), 9);
  assert.equal(bestScore(null, 9), 9);
  assert.equal(bestScore(9, 12), 9);
  assert.equal(bestScore(9, 7), 7);
});
test("Konami recognizes case-insensitive B/A and restarts after an incorrect key", () => {
  let index = 0,
    unlocked = false;
  for (const key of konami.map((key) =>
    key.length === 1 ? key.toUpperCase() : key,
  )) {
    const result = advanceSecret(index, key);
    index = result.index;
    unlocked = result.unlocked;
  }
  assert.equal(unlocked, true);
  assert.equal(index, 0);
  assert.deepEqual(advanceSecret(4, "x"), { index: 0, unlocked: false });
  assert.deepEqual(advanceSecret(4, "ArrowUp"), { index: 1, unlocked: false });
});
test("five logo taps unlock and expire after an interruption", () => {
  let taps = { count: 0, time: 0 };
  for (let i = 1; i <= 5; i++) {
    taps = advanceTaps(taps.count, taps.time, i * 200);
    assert.equal(taps.unlocked, i === 5);
  }
  assert.equal(advanceTaps(4, 1000, 4000).count, 1);
});
test("storage rejects malformed/versioned data and sanitizes records and discoveries", () => {
  for (const raw of [
    "oops",
    "null",
    "[]",
    '{"version":2}',
    '{"version":1,"found":0}',
  ])
    assert.deepEqual(parseSave(raw), emptySave);
  assert.deepEqual(
    parseSave(
      '{"version":1,"found":["golf","golf","fake","lab"],"golfBest":-4,"reactionBest":220}',
    ),
    { version: 1, found: ["golf", "lab"], golfBest: null, reactionBest: 220 },
  );
  assert.equal(parseSave('{"version":1,"golfBest":1.5}').golfBest, null);
});

test("fast touch samples produce a continuous brush stroke in both directions", () => {
  for (const [from, to] of [
    [0, 79],
    [79, 0],
    [8, 73],
    [50, 59],
    [0, 70],
  ]) {
    const cells = traceCells(from, to, 10);
    assert.equal(cells[0], from);
    assert.equal(cells.at(-1), to);
    for (let i = 1; i < cells.length; i++) {
      const a = cells[i - 1],
        b = cells[i];
      assert.equal(
        Math.abs(Math.floor(a / 10) - Math.floor(b / 10)) +
          Math.abs((a % 10) - (b % 10)),
        1,
      );
    }
  }
});
