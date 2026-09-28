import type { NextConfig } from "next";

// Een gebruikerssite staat op /. Een projectsite krijgt /repository-naam.
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.GITHUB_ACTIONS === "true" &&
  repository &&
  !repository.toLowerCase().endsWith(".github.io")
    ? `/${repository}`
    : "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
