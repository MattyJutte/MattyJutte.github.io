"use client";

import { useLanguage } from "@/lib/use-language";
import { assetPath } from "@/lib/asset-path";
import { Icon } from "@/components/icon";

export default function NotFound() {
  const { content, language, setLanguage } = useLanguage();
  return (
    <main className="not-found container">
      <button
        type="button"
        className="language-button"
        onClick={() => setLanguage(language === "nl" ? "en" : "nl")}
        aria-label={content.ui.switchLanguage}
        lang={language === "nl" ? "en" : "nl"}
      >
        {content.ui.languageCode}
      </button>
      <p className="eyebrow">{content.notFound.label}</p>
      <h1>{content.notFound.title}</h1>
      <p>{content.notFound.description}</p>
      <a href={assetPath("/")} className="button button-primary">
        {content.notFound.back}
        <Icon name="arrowRight" size={18} />
      </a>
    </main>
  );
}
