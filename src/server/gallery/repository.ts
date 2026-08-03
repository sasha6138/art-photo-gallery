import { and, asc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { artistProfile, categories, externalLinks, images, works } from "../../../db/schema";
import { works as fallbackWorks } from "@/data/sample-works";
import type { GalleryLink, GalleryProfile, Work } from "@/types/gallery";

export const fallbackProfile: GalleryProfile = {
  publicName: "Studio Gallery",
  wordmark: "STUDIO / GALLERY",
  heroHeadline: "Where intuition becomes form.",
  heroIntroduction: "An evolving collection of paintings, works on paper, and photographs shaped by atmosphere, place, and memory.",
  aboutHeadline: "An artist attentive to what lingers.",
  biography: "This is a flexible introduction for the artist’s biography, practice, achievements, exhibitions, and the ideas connecting her art and photography.",
  contactEmail: "studio@example.com",
};

export const fallbackLinks: GalleryLink[] = [
  { id: "link-instagram", label: "Instagram", url: "#" },
  { id: "link-exhibitions", label: "Exhibitions", url: "#" },
  { id: "link-inquiries", label: "Studio inquiries", url: "mailto:studio@example.com" },
];

function mediaUrl(key: string | null, staticSrc: string | null) {
  if (key) return `/media/${key.split("/").map(encodeURIComponent).join("/")}`;
  return staticSrc ?? "/gallery/threshold.png";
}

export async function getPublicGallery(): Promise<{ works: Work[]; profile: GalleryProfile; links: GalleryLink[] }> {
  const db = getDb();
  const rows = await db
    .select({ work: works, category: categories, image: images })
    .from(works)
    .innerJoin(categories, eq(works.categoryId, categories.id))
    .innerJoin(images, eq(images.workId, works.id))
    .where(and(eq(works.status, "published"), eq(categories.active, true)))
    .orderBy(asc(works.sortOrder), asc(works.createdAt));

  const [profileRow] = await db.select().from(artistProfile).limit(1);
  const linkRows = await db
    .select()
    .from(externalLinks)
    .where(eq(externalLinks.active, true))
    .orderBy(asc(externalLinks.sortOrder));

  return {
    works: rows.map(({ work, category, image }) => ({
      id: work.id,
      slug: work.slug,
      title: work.title,
      year: work.year,
      category: category.name,
      kind: work.kind === "art" ? "Art" : "Photo",
      src: mediaUrl(image.displayKey, image.staticSrc),
      thumbnailSrc: mediaUrl(image.thumbnailKey, image.staticSrc),
      alt: image.altText,
      description: work.description,
      medium: work.medium,
      dimensions: work.dimensions,
      status: work.status,
    })),
    profile: profileRow ? {
      publicName: profileRow.publicName,
      wordmark: profileRow.wordmark,
      heroHeadline: profileRow.heroHeadline,
      heroIntroduction: profileRow.heroIntroduction,
      aboutHeadline: profileRow.aboutHeadline,
      biography: profileRow.biography,
      contactEmail: profileRow.contactEmail,
    } : fallbackProfile,
    links: linkRows.map((link) => ({ id: link.id, label: link.label, url: link.url })),
  };
}

export async function getGalleryWithFallback() {
  try {
    return await getPublicGallery();
  } catch (error) {
    console.warn("Gallery database unavailable; using bundled sample content.", error);
    return { works: fallbackWorks, profile: fallbackProfile, links: fallbackLinks };
  }
}

export async function getAdminSnapshot() {
  const db = getDb();
  const workRows = await db
    .select({ work: works, category: categories, image: images })
    .from(works)
    .innerJoin(categories, eq(works.categoryId, categories.id))
    .leftJoin(images, eq(images.workId, works.id))
    .orderBy(asc(works.sortOrder), asc(works.createdAt));
  const categoryRows = await db.select().from(categories).orderBy(asc(categories.kind), asc(categories.sortOrder));
  const [profile] = await db.select().from(artistProfile).limit(1);
  const links = await db.select().from(externalLinks).orderBy(asc(externalLinks.sortOrder));

  return {
    works: workRows.map(({ work, category, image }) => ({
      ...work,
      category: category.name,
      image: mediaUrl(image?.thumbnailKey ?? null, image?.staticSrc ?? null),
      altText: image?.altText ?? "",
    })),
    categories: categoryRows,
    profile,
    links,
  };
}
