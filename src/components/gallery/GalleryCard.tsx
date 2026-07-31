import Image from "next/image";
import type { Work } from "@/types/gallery";

type GalleryCardProps = {
  work: Work;
  onOpen: () => void;
};

export default function GalleryCard({ work, onOpen }: GalleryCardProps) {
  return (
    <button
      className="work-card"
      onClick={onOpen}
      aria-label={`View ${work.title} full size`}
    >
      <span className="work-image">
        <Image
          src={work.src}
          alt={work.alt}
          fill
          sizes="(max-width: 760px) 92vw, 33vw"
        />
        <span className="view-label">View full size ↗</span>
      </span>
      <span className="work-meta">
        <span>
          <strong>{work.title}</strong>
          <small>{work.category}</small>
        </span>
        <span>{work.year}</span>
      </span>
    </button>
  );
}
