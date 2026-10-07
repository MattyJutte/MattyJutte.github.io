"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useLanguage } from "@/lib/use-language";
export function DiscoveryDialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { language } = useLanguage();
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node.showModal();
    return () => {
      node.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    // Swapping notebook content for a game removes the previously focused button.
    // Keep focus inside the modal and present the new view from the top.
    dialog.current
      ?.querySelector<HTMLButtonElement>(".discovery-close")
      ?.focus({ preventScroll: true });
    const content = dialog.current?.querySelector(".discovery-dialog-content");
    if (content) content.scrollTop = 0;
  }, [title]);
  return (
    <dialog
      ref={dialog}
      className="discovery-dialog"
      aria-labelledby="discovery-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className="discovery-dialog-header">
        <div>
          <p className="eyebrow">
            MJ / {language === "nl" ? "ONTDEK & SPEEL" : "EXPLORE & PLAY"}
          </p>
          <h2 id="discovery-dialog-title">{title}</h2>
        </div>
        <button
          autoFocus
          type="button"
          className="icon-button discovery-close"
          onClick={onClose}
          aria-label={language === "nl" ? "Sluiten" : "Close"}
        >
          ×
        </button>
      </header>
      <div className="discovery-dialog-content">{children}</div>
    </dialog>
  );
}
