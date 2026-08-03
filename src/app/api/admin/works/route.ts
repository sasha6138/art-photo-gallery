import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { images, works } from "../../../../../db/schema";
import { requireAdministratorApi } from "@/server/auth/administrator";
import { getAdminSnapshot } from "@/server/gallery/repository";
import { fileField, parseWorkInput, slugify, validateCategory } from "@/server/gallery/validation";
import { removeStoredImages, storeWorkImages } from "@/server/storage/images";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdministratorApi();
  if ("error" in auth) return auth.error;
  try {
    return Response.json(await getAdminSnapshot());
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load collection." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdministratorApi();
  if ("error" in auth) return auth.error;
  let stored: Awaited<ReturnType<typeof storeWorkImages>> | null = null;
  let workId = "";
  try {
    const form = await request.formData();
    const input = parseWorkInput(form);
    await validateCategory(input.categoryId, input.kind);
    const original = fileField(form, "original");
    if (!original) throw new Error("An original image is required.");
    const thumbnail = fileField(form, "thumbnail");
    workId = crypto.randomUUID();
    stored = await storeWorkImages(workId, original, thumbnail);
    const db = getDb();
    const slugBase = slugify(input.title) || "untitled";
    const slug = `${slugBase}-${workId.slice(0, 8)}`;
    await db.insert(works).values({
      id: workId,
      slug,
      kind: input.kind,
      title: input.title,
      year: input.year,
      description: input.description,
      medium: input.medium,
      dimensions: input.dimensions,
      categoryId: input.categoryId,
      createdBy: auth.user.email,
      updatedBy: auth.user.email,
    });
    await db.insert(images).values({
      id: crypto.randomUUID(),
      workId,
      originalKey: stored.originalKey,
      displayKey: stored.displayKey,
      thumbnailKey: stored.thumbnailKey,
      altText: input.altText,
      mimeType: stored.mimeType,
      byteSize: stored.byteSize,
    });
    return Response.json({ id: workId }, { status: 201 });
  } catch (error) {
    if (stored) await removeStoredImages([stored.originalKey, stored.displayKey, stored.thumbnailKey]).catch(() => undefined);
    if (workId) await getDb().delete(works).where(eq(works.id, workId)).catch(() => undefined);
    const message = error instanceof Error ? error.message : "Unable to add work.";
    return Response.json({ error: message }, { status: 400 });
  }
}
