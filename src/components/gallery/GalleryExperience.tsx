"use client";

import { useCallback, useState } from "react";
import type { GalleryLink, GalleryProfile, Work } from "@/types/gallery";
import CollectionSection from "./CollectionSection";
import Hero from "./Hero";
import Lightbox from "./Lightbox";
import LinksAndAbout from "./LinksAndAbout";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function GalleryExperience({ works, profile, links }: { works: Work[]; profile: GalleryProfile; links: GalleryLink[] }) {
  const [active, setActive] = useState<Work | null>(null);
  const artWorks = works.filter((work) => work.kind === "Art");
  const photoWorks = works.filter((work) => work.kind === "Photo");
  const featured = photoWorks[0] ?? artWorks[0];

  const close = useCallback(() => setActive(null), []);
  const previous = useCallback(() => {
    setActive((current) => {
      if (!current) return null;
      const index = works.findIndex((work) => work.src === current.src);
      return works[(index - 1 + works.length) % works.length];
    });
  }, [works]);
  const next = useCallback(() => {
    setActive((current) => {
      if (!current) return null;
      const index = works.findIndex((work) => work.src === current.src);
      return works[(index + 1) % works.length];
    });
  }, [works]);

  return (
    <main>
      <SiteHeader works={works} wordmark={profile.wordmark} />
      {featured ? (
        <Hero featured={featured} headline={profile.heroHeadline} introduction={profile.heroIntroduction} onOpen={() => setActive(featured)} />
      ) : (
        <section className="hero" id="home"><div className="hero-copy"><p className="eyebrow">Artist portfolio</p><h1>{profile.heroHeadline}</h1><p className="lede">The collection is being prepared.</p></div></section>
      )}
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
      <LinksAndAbout profile={profile} links={links} />
      <SiteFooter wordmark={profile.wordmark} />
      {active && (
        <Lightbox active={active} onClose={close} onPrevious={previous} onNext={next} />
      )}
    </main>
  );
}

