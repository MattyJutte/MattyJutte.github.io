import type { DiscoveryId } from "./secrets";
export function openDiscovery(id: DiscoveryId | "book") {
  window.dispatchEvent(
    new CustomEvent("portfolio-discovery-open", { detail: id }),
  );
}
