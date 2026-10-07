export type SearchResult = {
  visited: number[];
  path: number[];
  found: boolean;
};

/** Breadth-first search: each orthogonal step has the same cost. */
export function breadthFirstSearch(
  rows: number,
  columns: number,
  walls: ReadonlySet<number>,
  start: number,
  end: number,
): SearchResult {
  const size = rows * columns;
  if (
    start < 0 ||
    end < 0 ||
    start >= size ||
    end >= size ||
    walls.has(start) ||
    walls.has(end)
  )
    return { visited: [], path: [], found: false };
  const queue = [start];
  const parents = new Map<number, number | null>([[start, null]]);
  const visited: number[] = [];
  for (let head = 0; head < queue.length; head++) {
    const cell = queue[head];
    visited.push(cell);
    if (cell === end) {
      const path: number[] = [];
      let current: number | null = end;
      while (current !== null) {
        path.push(current);
        current = parents.get(current) ?? null;
      }
      return { visited, path: path.reverse(), found: true };
    }
    const row = Math.floor(cell / columns);
    const column = cell % columns;
    const neighbours = [
      row > 0 ? cell - columns : -1,
      column < columns - 1 ? cell + 1 : -1,
      row < rows - 1 ? cell + columns : -1,
      column > 0 ? cell - 1 : -1,
    ];
    for (const next of neighbours) {
      if (next < 0 || walls.has(next) || parents.has(next)) continue;
      parents.set(next, cell);
      queue.push(next);
    }
  }
  return { visited, path: [], found: false };
}
