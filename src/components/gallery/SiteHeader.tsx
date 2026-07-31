"use client";

import { useState } from "react";
import { artWorks, categoryAnchor, photoWorks } from "@/data/sample-works";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Artist portfolio home">
        STUDIO / GALLERY
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
            {artWorks.map((work) => (
              <a key={work.category} href={`#${categoryAnchor(work.category)}`}>
                {work.category}
              </a>
            ))}
          </div>
        </div>
        <div className="nav-group">
          <a href="#photos" onClick={closeMenu}>Photos</a>
          <div className="nav-dropdown">
            {photoWorks.map((work) => (
              <a key={work.category} href={`#${categoryAnchor(work.category)}`}>
                {work.category}
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
