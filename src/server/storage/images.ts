import { env } from "cloudflare:workers";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export function getImageBucket(): R2Bucket {
  if (!env.BUCKET) throw new Error("Cloudflare R2 binding `BUCKET` is unavailable.");
  return env.BUCKET;
}

export function validateImage(file: File, label: string) {
  if (!ACCEPTED_TYPES.has(file.type)) throw new Error(`${label} must be a JPEG, PNG, or WebP image.`);
  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) throw new Error(`${label} must be between 1 byte and 15 MB.`);
}

function extensionFor(mime: string) {
  return mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
}

export async function storeWorkImages(workId: string, original: File, thumbnail?: File | null) {
  validateImage(original, "Original image");
  if (thumbnail) validateImage(thumbnail, "Thumbnail image");
  const thumb = thumbnail ?? original;
  const token = crypto.randomUUID();
  const originalKey = `original/${workId}/${token}.${extensionFor(original.type)}`;
  const displayKey = `display/${workId}/${token}.${extensionFor(original.type)}`;
  const thumbnailKey = `thumbnail/${workId}/${token}.${extensionFor(thumb.type)}`;
  const bucket = getImageBucket();
  const originalBytes = await original.arrayBuffer();
  const thumbBytes = thumbnail ? await thumbnail.arrayBuffer() : originalBytes;
  assertImageSignature(new Uint8Array(originalBytes), original.type, "Original image");
  assertImageSignature(new Uint8Array(thumbBytes), thumb.type, "Thumbnail image");

  await bucket.put(originalKey, originalBytes, { httpMetadata: { contentType: original.type } });
  await bucket.put(displayKey, originalBytes, { httpMetadata: { contentType: original.type } });
  await bucket.put(thumbnailKey, thumbBytes, { httpMetadata: { contentType: thumb.type } });
  return { originalKey, displayKey, thumbnailKey, mimeType: original.type, byteSize: original.size };
}

function assertImageSignature(bytes: Uint8Array, mime: string, label: string) {
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const webp = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if ((mime === "image/jpeg" && !jpeg) || (mime === "image/png" && !png) || (mime === "image/webp" && !webp)) {
    throw new Error(`${label} content does not match its declared file type.`);
  }
}

export async function removeStoredImages(keys: Array<string | null | undefined>) {
  const valid = keys.filter((key): key is string => Boolean(key));
  if (valid.length) await getImageBucket().delete(valid);
}
