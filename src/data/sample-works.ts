import type { Work } from "@/types/gallery";

export const works: Work[] = [
  {
    title: "Threshold",
    year: "2026",
    category: "Abstract",
    kind: "Art",
    src: "/gallery/threshold.png",
    alt: "Abstract indigo painting with a vertical gold gesture",
  },
  {
    title: "Tidal Memory",
    year: "2025",
    category: "Mixed Media",
    kind: "Art",
    src: "/gallery/tidal-memory.png",
    alt: "Layered blue and charcoal mixed-media painting",
  },
  {
    title: "Still Current",
    year: "2025",
    category: "Works on Paper",
    kind: "Art",
    src: "/gallery/still-current.png",
    alt: "Minimal gestural artwork on textured paper",
  },
  {
    title: "After Light",
    year: "2026",
    category: "Architecture",
    kind: "Photo",
    src: "/gallery/after-light.png",
    alt: "Figure standing in a shadowed concrete interior",
  },
  {
    title: "North Wind",
    year: "2024",
    category: "Landscape",
    kind: "Photo",
    src: "/gallery/north-wind.png",
    alt: "Dark coastal landscape in mist and wind",
  },
  {
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
