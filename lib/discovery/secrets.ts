export const konami = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
export function advanceSecret(
  index: number,
  key: string,
): { index: number; unlocked: boolean } {
  const normalized = key.length === 1 ? key.toLowerCase() : key;
  const next =
    normalized === konami[index] ? index + 1 : normalized === konami[0] ? 1 : 0;
  return {
    index: next === konami.length ? 0 : next,
    unlocked: next === konami.length,
  };
}
export function advanceTaps(count: number, previous: number, now: number) {
  const next = now - previous > 1800 ? 1 : count + 1;
  return { count: next >= 5 ? 0 : next, time: now, unlocked: next >= 5 };
}
export const discoveryIds = [
  "golf",
  "lab",
  "stars",
  "initials",
  "signal",
  "robot",
  "arcade",
] as const;
export type DiscoveryId = (typeof discoveryIds)[number];
export type DiscoverySave = {
  version: 1;
  found: DiscoveryId[];
  golfBest: number | null;
  reactionBest: number | null;
};
export const emptySave: DiscoverySave = {
  version: 1,
  found: [],
  golfBest: null,
  reactionBest: null,
};
export function parseSave(raw: string | null): DiscoverySave {
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    if (
      !value ||
      typeof value !== "object" ||
      !("version" in value) ||
      value.version !== 1
    )
      return { ...emptySave };
    const data = value as Record<string, unknown>;
    const record = (v: unknown) =>
      typeof v === "number" && Number.isSafeInteger(v) && v > 0 && v <= 1000000
        ? v
        : null;
    return {
      version: 1,
      found: Array.isArray(data.found)
        ? [
            ...new Set(
              data.found.filter((id): id is DiscoveryId =>
                discoveryIds.includes(id as DiscoveryId),
              ),
            ),
          ]
        : [],
      golfBest: record(data.golfBest),
      reactionBest: record(data.reactionBest),
    };
  } catch {
    return { ...emptySave };
  }
}
