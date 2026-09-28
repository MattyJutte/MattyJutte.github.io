"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import type { Language, SiteContent } from "@/data/content";

type HeaderProps = {
  name: string;
  initials: string;
  navigation: { label: string; href: string }[];
  labels: SiteContent["ui"];
  language: Language;
  onLanguageChange: (language: Language) => void;
};

export function Header({
  name,
  initials,
  navigation,
  labels,
  language,
  onLanguageChange,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
    );
    navigation.forEach(({ href }) => {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    });
    const hero = document.querySelector("#boven");
    if (hero) observer.observe(hero);
    return () => observer.disconnect();
  }, [navigation]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    function onOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !header.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onOutsideClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onOutsideClick);
    };
  }, [menuOpen]);

  function toggleTheme() {
    const root = document.documentElement;
    const theme = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = theme;
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      /* Werkt ook zonder opslag. */
    }
  }

  return (
    <header ref={header} className="site-header">
      <div className="container header-inner">
        <a
          href="#boven"
          className="brand"
          aria-label={`${name} — ${labels.home}`}
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark">
            {initials}
            <span>.</span>
          </span>
          <span className="brand-name">
            {name}
            <span>.</span>
          </span>
        </a>
        <nav aria-label={labels.navigation} className="desktop-nav">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={active === item.href ? "active" : ""}
              aria-current={active === item.href ? "location" : undefined}
            >
              {item.label}
              {item.href === "#contact" && (
                <Icon name="arrowUpRight" size={15} />
              )}
            </a>
          ))}
        </nav>
        <div className="header-controls">
          <button
            type="button"
            className="language-button"
            onClick={() => onLanguageChange(language === "nl" ? "en" : "nl")}
            aria-label={labels.switchLanguage}
            title={labels.switchLanguage}
            lang={language === "nl" ? "en" : "nl"}
          >
            {labels.languageCode}
          </button>
          <button
            type="button"
            className="icon-button theme-button"
            onClick={toggleTheme}
            aria-label={labels.theme}
            title={labels.theme}
          >
            <Icon name="sun" className="sun-icon" size={19} />
            <Icon name="moon" className="moon-icon" size={19} />
          </button>
          <button
            ref={menuButton}
            type="button"
            className="icon-button menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "x" : "menu"} />
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        aria-label={labels.navigation}
        className="mobile-nav container"
        hidden={!menuOpen}
      >
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            aria-current={active === item.href ? "location" : undefined}
          >
            {item.label}
            <Icon name="arrowUpRight" size={17} />
          </a>
        ))}
      </nav>
    </header>
  );
}
