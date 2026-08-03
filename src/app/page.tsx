import GalleryExperience from "@/components/gallery/GalleryExperience";
import { getGalleryWithFallback } from "@/server/gallery/repository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const gallery = await getGalleryWithFallback();
  return <GalleryExperience {...gallery} />;
}

