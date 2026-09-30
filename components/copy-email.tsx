"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/data/content";
import { Icon } from "@/components/icon";

export function CopyEmail({
  email,
  labels,
}: {
  email: string;
  labels: SiteContent["ui"];
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 5000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="copy-email">
      <button type="button" className="button button-secondary" onClick={copy}>
        <Icon name={status === "copied" ? "check" : "copy"} size={16} />
        {labels.copyEmail}
      </button>
      <p className="copy-feedback" role="status">
        {status === "copied"
          ? labels.emailCopied
          : status === "failed"
            ? labels.emailCopyFailed
            : ""}
      </p>
    </div>
  );
}
