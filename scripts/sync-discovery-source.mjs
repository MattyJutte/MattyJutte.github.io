import { copyFileSync, mkdirSync } from "node:fs";
mkdirSync("public/code", { recursive: true });
copyFileSync("lib/discovery/pathfinding.ts", "public/code/pathfinding.ts");
