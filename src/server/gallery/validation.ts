import { and, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { categories } from "../../../db/schema";

export type WorkInput = {
  title: string;
  year: string;
  kind: "art" | "photo";
  categoryId: string;
  altText: string;
  description: string;
  medium: string;
  dimensions: string;
};

export function field(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function fileField(form: FormData, name: string) {
  const value = form.get(name);
  return value instanceof File && value.size > 0 ? value : null;
}

export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64);
}

export function parseWorkInput(form: FormData): WorkInput {
  const kind = field(form, "kind");
  const input = {
    title: field(form, "title"),
    year: field(form, "year"),
    kind: kind as WorkInput["kind"],
    categoryId: field(form, "categoryId"),
    altText: field(form, "altText"),
    description: field(form, "description"),
    medium: field(form, "medium"),
    dimensions: field(form, "dimensions"),
  };
  if (!input.title || !input.year || !input.categoryId || !input.altText) {
    throw new Error("Title, year, category, and alternative text are required.");
  }
  if (input.kind !== "art" && input.kind !== "photo") throw new Error("Choose Art or Photo.");
  return input;
}

export async function validateCategory(categoryId: string, kind: "art" | "photo") {
  const [category] = await getDb().select().from(categories).where(and(eq(categories.id, categoryId), eq(categories.kind, kind), eq(categories.active, true))).limit(1);
  if (!category) throw new Error("Choose an active category matching the work type.");
  return category;
}
