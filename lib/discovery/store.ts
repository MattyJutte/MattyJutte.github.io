"use client";
import { useSyncExternalStore } from "react";
import {
  emptySave,
  parseSave,
  type DiscoveryId,
  type DiscoverySave,
} from "./secrets";
const key = "portfolio-discoveries-v1";
let state: DiscoverySave = emptySave;
let loaded = false;
let resetGeneration = 0;
export function getResetGeneration() {
  return resetGeneration;
}
const listeners = new Set<() => void>();
function getSnapshot() {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    try {
      state = parseSave(localStorage.getItem(key));
    } catch {
      state = { ...emptySave };
    }
  }
  return state;
}
function emit() {
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const sync = (event: StorageEvent) => {
    if (event.key === key || event.key === null) {
      loaded = false;
      getSnapshot();
      emit();
    }
  };
  window.addEventListener("storage", sync);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", sync);
  };
}
function update(next: DiscoverySave) {
  state = next;
  loaded = true;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* Session state remains usable. */
  }
  emit();
}
export function discover(id: DiscoveryId) {
  const current = getSnapshot();
  if (!current.found.includes(id))
    update({ ...current, found: [...current.found, id] });
}
export function saveRecord(type: "golfBest" | "reactionBest", value: number) {
  const current = getSnapshot();
  if (
    Number.isSafeInteger(value) &&
    value > 0 &&
    (current[type] === null || value < current[type])
  )
    update({ ...current, [type]: value });
}
export function resetDiscoveries() {
  resetGeneration++;
  update({ ...emptySave, found: [] });
}
export function useDiscoveries() {
  return useSyncExternalStore(subscribe, getSnapshot, () => emptySave);
}
