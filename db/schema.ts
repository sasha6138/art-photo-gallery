import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  kind: text("kind", { enum: ["art", "photo"] }).notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("categories_kind_slug_unique").on(table.kind, table.slug)]);

export const works = sqliteTable("works", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  kind: text("kind", { enum: ["art", "photo"] }).notNull(),
  title: text("title").notNull(),
  year: text("year").notNull(),
  description: text("description").notNull().default(""),
  medium: text("medium").notNull().default(""),
  dimensions: text("dimensions").notNull().default(""),
  categoryId: text("category_id").notNull().references(() => categories.id),
  status: text("status", { enum: ["draft", "published", "archived"] }).notNull().default("draft"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  availability: text("availability", { enum: ["not_for_sale", "available", "reserved", "sold"] }).notNull().default("not_for_sale"),
  priceMinor: integer("price_minor"),
  currency: text("currency"),
  publishedAt: text("published_at"),
  createdBy: text("created_by").notNull(),
  updatedBy: text("updated_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const images = sqliteTable("images", {
  id: text("id").primaryKey(),
  workId: text("work_id").notNull().references(() => works.id, { onDelete: "cascade" }),
  originalKey: text("original_key"),
  displayKey: text("display_key"),
  thumbnailKey: text("thumbnail_key"),
  staticSrc: text("static_src"),
  altText: text("alt_text").notNull(),
  mimeType: text("mime_type").notNull(),
  byteSize: integer("byte_size").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const artistProfile = sqliteTable("artist_profile", {
  id: text("id").primaryKey(),
  publicName: text("public_name").notNull(),
  wordmark: text("wordmark").notNull(),
  heroHeadline: text("hero_headline").notNull(),
  heroIntroduction: text("hero_introduction").notNull(),
  aboutHeadline: text("about_headline").notNull(),
  biography: text("biography").notNull(),
  contactEmail: text("contact_email").notNull().default(""),
  updatedBy: text("updated_by").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const externalLinks = sqliteTable("external_links", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
