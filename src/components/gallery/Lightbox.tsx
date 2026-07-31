"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { Work } from "@/types/gallery";

type LightboxProps = {
  active: Work;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export default function Lightbox({ active, onClose, onPrevious, onNext }: LightboxProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={active.title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button className="close" onClick={onClose} autoFocus aria-label="Close full-size image">
        Close ×
      </button>
      <button className="lightbox-nav prev" onClick={onPrevious} aria-label="Previous image">←</button>
      <figure>
        <div className="lightbox-image">
          <Image src={active.src} alt={active.alt} fill sizes="90vw" />
        </div>
        <figcaption><span>{active.title} · {active.category}</span><span>{active.year}</span></figcaption>
      </figure>
      <button className="lightbox-nav next" onClick={onNext} aria-label="Next image">→</button>
    </div>
  );
}
