import type { Work } from "@/types/gallery";

export const works: Work[] = [
  {
    id: "work-threshold",
    slug: "threshold",
    title: "Threshold",
    year: "2026",
    category: "Abstract",
    kind: "Art",
    src: "/gallery/threshold.png",
    alt: "Abstract indigo painting with a vertical gold gesture",
  },
  {
    id: "work-tidal-memory",
    slug: "tidal-memory",
    title: "Tidal Memory",
    year: "2025",
    category: "Mixed Media",
    kind: "Art",
    src: "/gallery/tidal-memory.png",
    alt: "Layered blue and charcoal mixed-media painting",
  },
  {
    id: "work-still-current",
    slug: "still-current",
    title: "Still Current",
    year: "2025",
    category: "Works on Paper",
    kind: "Art",
    src: "/gallery/still-current.png",
    alt: "Minimal gestural artwork on textured paper",
  },
  {
    id: "work-after-light",
    slug: "after-light",
    title: "After Light",
    year: "2026",
    category: "Architecture",
    kind: "Photo",
    src: "/gallery/after-light.png",
    alt: "Figure standing in a shadowed concrete interior",
  },
  {
    id: "work-north-wind",
    slug: "north-wind",
    title: "North Wind",
    year: "2024",
    category: "Landscape",
    kind: "Photo",
    src: "/gallery/north-wind.png",
    alt: "Dark coastal landscape in mist and wind",
  },
  {
    id: "work-passing-through",
    slug: "passing-through",
    title: "Passing Through",
    year: "2025",
    category: "Street",
    kind: "Photo",
    src: "/gallery/passing-through.png",
    alt: "Cinematic city street photograph at night",
  },
];

export const artWorks = works.filter((work) => work.kind === "Art");
export const photoWorks = works.filter((work) => work.kind === "Photo");

export function categoryAnchor(category: string) {
  return category.toLowerCase().replaceAll(" ", "-");
}

