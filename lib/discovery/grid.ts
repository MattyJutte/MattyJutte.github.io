/** Connect pointer samples with an unbroken, orthogonally connected brush stroke. */
export function traceCells(
  from: number,
  to: number,
  columns: number,
): number[] {
  let x = from % columns,
    y = Math.floor(from / columns);
  const endX = to % columns,
    endY = Math.floor(to / columns);
  const dx = Math.abs(endX - x),
    dy = Math.abs(endY - y);
  const sx = x < endX ? 1 : -1,
    sy = y < endY ? 1 : -1;
  let error = dx - dy;
  const cells = [from];
  while (x !== endX || y !== endY) {
    const twice = error * 2;
    if (twice > -dy) {
      error -= dy;
      x += sx;
      cells.push(y * columns + x);
    }
    if (twice < dx) {
      error += dx;
      y += sy;
      cells.push(y * columns + x);
    }
  }
  return cells;
}
