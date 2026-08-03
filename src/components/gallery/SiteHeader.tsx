"use client";

import { useState } from "react";
import { categoryAnchor } from "@/data/sample-works";
import type { Work } from "@/types/gallery";

export default function SiteHeader({ works, wordmark }: { works: Work[]; wordmark: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const artCategories = [...new Set(works.filter((work) => work.kind === "Art").map((work) => work.category))];
  const photoCategories = [...new Set(works.filter((work) => work.kind === "Photo").map((work) => work.category))];

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Artist portfolio home">
        {wordmark}
      </a>
      <button
        className="menu-button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
      >
        Menu
      </button>
      <nav className={menuOpen ? "open" : ""} aria-label="Main navigation">
        <a className="active" href="#home" onClick={closeMenu}>Home</a>
        <div className="nav-group">
          <a href="#art" onClick={closeMenu}>Art</a>
          <div className="nav-dropdown">
            {artCategories.map((category) => (
              <a key={category} href={`#${categoryAnchor(category)}`}>
                {category}
              </a>
            ))}
          </div>
        </div>
        <div className="nav-group">
          <a href="#photos" onClick={closeMenu}>Photos</a>
          <div className="nav-dropdown">
            {photoCategories.map((category) => (
              <a key={category} href={`#${categoryAnchor(category)}`}>
                {category}
              </a>
            ))}
          </div>
        </div>
        <a href="#links" onClick={closeMenu}>Links</a>
        <a href="#about" onClick={closeMenu}>About</a>
      </nav>
    </header>
  );
}

