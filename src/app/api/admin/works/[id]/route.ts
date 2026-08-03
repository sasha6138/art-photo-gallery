import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../../../../db";
import { images, works } from "../../../../../../db/schema";
import { requireAdministratorApi } from "@/server/auth/administrator";
import { field, fileField, parseWorkInput, validateCategory } from "@/server/gallery/validation";
import { removeStoredImages, storeWorkImages } from "@/server/storage/images";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdministratorApi();
  if ("error" in auth) return auth.error;
  const { id } = await context.params;
  const db = getDb();
  const [existing] = await db.select().from(works).where(eq(works.id, id)).limit(1);
  if (!existing) return Response.json({ error: "Work not found." }, { status: 404 });

  try {
    const form = await request.formData();
    const action = field(form, "action");
    if (action === "publish") {
      const [image] = await db.select().from(images).where(eq(images.workId, id)).limit(1);
      if (!image) throw new Error("Upload an image before publishing.");
      await db.update(works).set({ status: "published", publishedAt: sql`CURRENT_TIMESTAMP`, updatedAt: sql`CURRENT_TIMESTAMP`, updatedBy: auth.user.email }).where(eq(works.id, id));
      return Response.json({ ok: true });
    }
    if (action === "archive") {
      await db.update(works).set({ status: "archived", updatedAt: sql`CURRENT_TIMESTAMP`, updatedBy: auth.user.email }).where(eq(works.id, id));
      return Response.json({ ok: true });
    }

    const input = parseWorkInput(form);
    await validateCategory(input.categoryId, input.kind);
    const original = fileField(form, "original");
    const thumbnail = fileField(form, "thumbnail");
    let newStored: Awaited<ReturnType<typeof storeWorkImages>> | null = null;
    let previousKeys: Array<string | null> = [];
    if (original) {
      newStored = await storeWorkImages(id, original, thumbnail);
      const [currentImage] = await db.select().from(images).where(eq(images.workId, id)).limit(1);
      if (currentImage) {
        previousKeys = [currentImage.originalKey, currentImage.displayKey, currentImage.thumbnailKey];
        await db.update(images).set({
          originalKey: newStored.originalKey,
          displayKey: newStored.displayKey,
          thumbnailKey: newStored.thumbnailKey,
          staticSrc: null,
          altText: input.altText,
          mimeType: newStored.mimeType,
          byteSize: newStored.byteSize,
        }).where(eq(images.id, currentImage.id));
      } else {
        await db.insert(images).values({
          id: crypto.randomUUID(), workId: id,
          originalKey: newStored.originalKey, displayKey: newStored.displayKey, thumbnailKey: newStored.thumbnailKey,
          altText: input.altText, mimeType: newStored.mimeType, byteSize: newStored.byteSize,
        });
      }
    } else {
      await db.update(images).set({ altText: input.altText }).where(eq(images.workId, id));
    }
    await db.update(works).set({
      kind: input.kind,
      title: input.title,
      year: input.year,
      description: input.description,
      medium: input.medium,
      dimensions: input.dimensions,
      categoryId: input.categoryId,
      updatedAt: sql`CURRENT_TIMESTAMP`,
      updatedBy: auth.user.email,
    }).where(eq(works.id, id));
    if (previousKeys.length) await removeStoredImages(previousKeys).catch(() => undefined);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to update work." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdministratorApi();
  if ("error" in auth) return auth.error;
  const { id } = await context.params;
  await getDb().update(works).set({ status: "archived", updatedAt: sql`CURRENT_TIMESTAMP`, updatedBy: auth.user.email }).where(eq(works.id, id));
  return Response.json({ ok: true });
}
