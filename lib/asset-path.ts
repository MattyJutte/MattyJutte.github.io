// Gewone links naar public-bestanden hebben ook de GitHub Pages-basePath nodig.
export function assetPath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
