"use client";

import { useEffect, useSyncExternalStore } from "react";
import { translations, type Language } from "@/data/content";

const storageKey = "portfolio-language";
const changeEvent = "portfolio-language-change";
let selectedLanguage: Language | undefined;

function getLanguage(): Language {
  if (selectedLanguage) return selectedLanguage;
  try {
    selectedLanguage = localStorage.getItem(storageKey) === "en" ? "en" : "nl";
  } catch {
    selectedLanguage = "nl";
  }
  return selectedLanguage;
}

// De statische HTML begint altijd in het Nederlands, ook zonder JavaScript.
function getServerLanguage(): Language {
  return "nl";
}

function subscribe(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === storageKey || event.key === null) {
      selectedLanguage = undefined;
      onChange();
    }
  }
  window.addEventListener(changeEvent, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function setLanguage(language: Language) {
  selectedLanguage = language;
  try {
    localStorage.setItem(storageKey, language);
  } catch {
    // Zonder browseropslag werkt wisselen nog steeds voor dit bezoek.
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function useLanguage() {
  const language = useSyncExternalStore(
    subscribe,
    getLanguage,
    getServerLanguage,
  );
  const content = translations[language];

  useEffect(() => {
    // Ook schermlezers, de browsertitel en paginabeschrijvingen volgen de taal.
    document.documentElement.lang = language;
    document.title = content.meta.title;
    const metadata = {
      'meta[name="description"]': content.meta.description,
      'meta[property="og:title"]': content.meta.title,
      'meta[property="og:description"]': content.meta.description,
      'meta[property="og:locale"]': language === "en" ? "en_GB" : "nl_NL",
      'meta[name="twitter:title"]': content.meta.title,
      'meta[name="twitter:description"]': content.meta.description,
    };
    for (const [selector, value] of Object.entries(metadata)) {
      document.querySelector(selector)?.setAttribute("content", value);
    }
  }, [language, content]);

  return { language, setLanguage, content };
}
