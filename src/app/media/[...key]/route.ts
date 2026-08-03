import { getImageBucket } from "@/server/storage/images";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const { key: segments } = await context.params;
  const key = segments.join("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..") || key.startsWith("original/")) {
    return new Response("Not found", { status: 404 });
  }
  const object = await getImageBucket().get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}
