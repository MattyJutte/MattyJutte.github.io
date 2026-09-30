import { existsSync } from "node:fs";
import path from "node:path";
import { Portfolio } from "@/components/portfolio";
import { content } from "@/data/content";

export default function Home() {
  // Tijdens de build controleren: geen kapotte downloadlink zonder PDF.
  const cvAvailable = existsSync(
    path.join(process.cwd(), "public", content.profile.cvPath),
  );
  return <Portfolio cvAvailable={cvAvailable} />;
}
