"use client";

import { useCallback, useState } from "react";
import { artWorks, photoWorks, works } from "@/data/sample-works";
import type { Work } from "@/types/gallery";
import CollectionSection from "./CollectionSection";
import Hero from "./Hero";
import Lightbox from "./Lightbox";
import LinksAndAbout from "./LinksAndAbout";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function GalleryExperience() {
  const [active, setActive] = useState<Work | null>(null);

  const close = useCallback(() => setActive(null), []);
  const previous = useCallback(() => {
    setActive((current) => {
      if (!current) return null;
      const index = works.findIndex((work) => work.src === current.src);
      return works[(index - 1 + works.length) % works.length];
    });
  }, []);
  const next = useCallback(() => {
    setActive((current) => {
      if (!current) return null;
      const index = works.findIndex((work) => work.src === current.src);
      return works[(index + 1) % works.length];
    });
  }, []);

  return (
    <main>
      <SiteHeader />
      <Hero featured={photoWorks[0]} onOpen={() => setActive(photoWorks[0])} />
      <CollectionSection
        id="art"
        eyebrow="01 / Art"
        title="Art by category"
        description="Studies in color, texture, gesture, and material. Select a category image to view the work in full."
        works={artWorks}
        onOpen={setActive}
      />
      <CollectionSection
        id="photos"
        eyebrow="02 / Photography"
        title="Photos by category"
        description="Observations of built spaces, changing landscapes, and fleeting human moments."
        works={photoWorks}
        variant="photos"
        onOpen={setActive}
      />
      <LinksAndAbout />
      <SiteFooter />
      {active && (
        <Lightbox active={active} onClose={close} onPrevious={previous} onNext={next} />
      )}
    </main>
  );
}
