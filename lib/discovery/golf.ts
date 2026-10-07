export type Point = { x: number; y: number };
export type Obstacle = Point & { width: number; height: number };
export type Ball = Point & { vx: number; vy: number; sunk: boolean };
export type Hole = {
  start: Point;
  cup: Point;
  par: number;
  obstacles: Obstacle[];
};
export const WIDTH = 600;
export const HEIGHT = 360;
export const RADIUS = 7;
export const holes: Hole[] = [
  {
    start: { x: 75, y: 180 },
    cup: { x: 525, y: 180 },
    par: 2,
    obstacles: [{ x: 270, y: 65, width: 65, height: 95 }],
  },
  {
    start: { x: 70, y: 280 },
    cup: { x: 530, y: 75 },
    par: 3,
    obstacles: [
      { x: 210, y: 150, width: 65, height: 190 },
      { x: 365, y: 20, width: 65, height: 180 },
    ],
  },
  {
    start: { x: 65, y: 295 },
    cup: { x: 535, y: 65 },
    par: 4,
    obstacles: [
      { x: 160, y: 130, width: 50, height: 210 },
      { x: 290, y: 20, width: 50, height: 185 },
      { x: 420, y: 135, width: 50, height: 205 },
    ],
  },
];
export function newBall(hole: Hole): Ball {
  return { ...hole.start, vx: 0, vy: 0, sunk: false };
}
export function moving(ball: Ball) {
  return Math.hypot(ball.vx, ball.vy) > 0;
}
export function strike(ball: Ball, angle: number, power: number): Ball {
  if (moving(ball) || ball.sunk) return ball;
  const speed = Math.max(1, Math.min(100, power)) * 5;
  return {
    ...ball,
    vx: Math.cos((angle * Math.PI) / 180) * speed,
    vy: Math.sin((angle * Math.PI) / 180) * speed,
  };
}

// Small substeps prevent tunnelling through a card or cup at maximum power.
export function stepBall(source: Ball, hole: Hole, elapsed: number): Ball {
  if (source.sunk || !moving(source)) return source;
  const ball = { ...source };
  const duration = Math.max(0, Math.min(elapsed, 0.05));
  const count = Math.max(
    1,
    Math.ceil((Math.hypot(ball.vx, ball.vy) * duration) / (RADIUS / 2)),
  );
  const dt = duration / count;
  for (let i = 0; i < count; i++) {
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    const left = 20 + RADIUS,
      right = WIDTH - 20 - RADIUS;
    const top = 20 + RADIUS,
      bottom = HEIGHT - 20 - RADIUS;
    if (ball.x < left) {
      ball.x = left;
      ball.vx = Math.abs(ball.vx) * 0.78;
    }
    if (ball.x > right) {
      ball.x = right;
      ball.vx = -Math.abs(ball.vx) * 0.78;
    }
    if (ball.y < top) {
      ball.y = top;
      ball.vy = Math.abs(ball.vy) * 0.78;
    }
    if (ball.y > bottom) {
      ball.y = bottom;
      ball.vy = -Math.abs(ball.vy) * 0.78;
    }
    for (const card of hole.obstacles) {
      const cx = Math.max(card.x, Math.min(card.x + card.width, ball.x));
      const cy = Math.max(card.y, Math.min(card.y + card.height, ball.y));
      let dx = ball.x - cx,
        dy = ball.y - cy;
      let distance = Math.hypot(dx, dy);
      if (distance >= RADIUS) continue;
      if (distance === 0) {
        // Recovery if a future course edit or resize ever places the ball inside a card.
        const sides = [
          Math.abs(ball.x - card.x),
          Math.abs(ball.x - card.x - card.width),
          Math.abs(ball.y - card.y),
          Math.abs(ball.y - card.y - card.height),
        ];
        const side = sides.indexOf(Math.min(...sides));
        if (side === 0) {
          ball.x = card.x - RADIUS;
          dx = -1;
        }
        if (side === 1) {
          ball.x = card.x + card.width + RADIUS;
          dx = 1;
        }
        if (side === 2) {
          ball.y = card.y - RADIUS;
          dy = -1;
        }
        if (side === 3) {
          ball.y = card.y + card.height + RADIUS;
          dy = 1;
        }
        distance = 1;
      } else {
        ball.x += (dx / distance) * (RADIUS - distance + 0.01);
        ball.y += (dy / distance) * (RADIUS - distance + 0.01);
      }
      const nx = dx / distance,
        ny = dy / distance;
      const dot = ball.vx * nx + ball.vy * ny;
      if (dot < 0) {
        ball.vx -= 1.78 * dot * nx;
        ball.vy -= 1.78 * dot * ny;
      }
    }
    if (
      Math.hypot(ball.x - hole.cup.x, ball.y - hole.cup.y) < 11 &&
      Math.hypot(ball.vx, ball.vy) < 245
    )
      return { ...ball, ...hole.cup, vx: 0, vy: 0, sunk: true };
    const friction = Math.exp(-1.05 * dt);
    ball.vx *= friction;
    ball.vy *= friction;
    if (Math.hypot(ball.vx, ball.vy) < 9) {
      ball.vx = 0;
      ball.vy = 0;
    }
  }
  return ball;
}
export function totalScore(scores: readonly number[]) {
  return scores.reduce((sum, score) => sum + score, 0);
}
export function bestScore(previous: number | null, score: number) {
  return previous === null ? score : Math.min(previous, score);
}
