export type WorkKind = "Art" | "Photo";

export type Work = {
  id: string;
  slug: string;
  title: string;
  year: string;
  category: string;
  kind: WorkKind;
  src: string;
  alt: string;
  thumbnailSrc?: string;
  description?: string;
  medium?: string;
  dimensions?: string;
  status?: "draft" | "published" | "archived";
};

export type GalleryProfile = {
  publicName: string;
  wordmark: string;
  heroHeadline: string;
  heroIntroduction: string;
  aboutHeadline: string;
  biography: string;
  contactEmail: string;
};

export type GalleryLink = { id: string; label: string; url: string };

