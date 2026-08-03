import { categoryAnchor } from "@/data/sample-works";
import type { Work } from "@/types/gallery";
import GalleryCard from "./GalleryCard";

type CollectionSectionProps = {
  id: "art" | "photos";
  eyebrow: string;
  title: string;
  description: string;
  works: Work[];
  variant?: "photos";
  onOpen: (work: Work) => void;
};

export default function CollectionSection({
  id,
  eyebrow,
  title,
  description,
  works,
  variant,
  onOpen,
}: CollectionSectionProps) {
  return (
    <section
      className={`collection section-shell ${variant === "photos" ? "photo-section" : ""}`}
      id={id}
    >
      <div className="section-heading">
        <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
        <p>{description}</p>
      </div>
      <div className={`gallery-grid ${variant === "photos" ? "photo-grid" : ""}`}>
        {works.map((work) => (
          <div id={categoryAnchor(work.category)} key={work.title}>
            <GalleryCard work={work} onOpen={() => onOpen(work)} />
          </div>
        ))}
      </div>
    </section>
  );
}


