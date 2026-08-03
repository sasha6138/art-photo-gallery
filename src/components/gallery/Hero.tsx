import Image from "next/image";
import type { Work } from "@/types/gallery";

export default function Hero({ featured, headline, introduction, onOpen }: { featured: Work; headline: string; introduction: string; onOpen: () => void }) {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <p className="eyebrow">Artist portfolio · Selected works</p>
        <h1>{headline}</h1>
        <p className="lede">{introduction}</p>
        <a className="text-link" href="#art">Enter the collection <span>→</span></a>
      </div>
      <button
        className="hero-image"
        onClick={onOpen}
        aria-label={`View ${featured.title} full size`}
      >
        <Image
          src={featured.src}
          alt={featured.alt}
          fill
          priority
          sizes="(max-width: 760px) 100vw, 58vw"
        />
        <span className="hero-caption">
          <span>Featured photograph</span>
          <strong>{featured.title}, {featured.year}</strong>
        </span>
      </button>
    </section>
  );
}

