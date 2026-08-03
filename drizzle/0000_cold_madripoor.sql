CREATE TABLE `artist_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`public_name` text NOT NULL,
	`wordmark` text NOT NULL,
	`hero_headline` text NOT NULL,
	`hero_introduction` text NOT NULL,
	`about_headline` text NOT NULL,
	`biography` text NOT NULL,
	`contact_email` text DEFAULT '' NOT NULL,
	`updated_by` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_kind_slug_unique` ON `categories` (`kind`,`slug`);--> statement-breakpoint
CREATE TABLE `external_links` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`url` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`work_id` text NOT NULL,
	`original_key` text,
	`display_key` text,
	`thumbnail_key` text,
	`static_src` text,
	`alt_text` text NOT NULL,
	`mime_type` text NOT NULL,
	`byte_size` integer DEFAULT 0 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`work_id`) REFERENCES `works`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `works` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`year` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`medium` text DEFAULT '' NOT NULL,
	`dimensions` text DEFAULT '' NOT NULL,
	`category_id` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`availability` text DEFAULT 'not_for_sale' NOT NULL,
	`price_minor` integer,
	`currency` text,
	`published_at` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `works_slug_unique` ON `works` (`slug`);
--> statement-breakpoint
INSERT INTO categories (id, kind, name, slug, sort_order, active) VALUES
  ('category-abstract', 'art', 'Abstract', 'abstract', 10, 1),
  ('category-mixed-media', 'art', 'Mixed Media', 'mixed-media', 20, 1),
  ('category-works-paper', 'art', 'Works on Paper', 'works-on-paper', 30, 1),
  ('category-architecture', 'photo', 'Architecture', 'architecture', 10, 1),
  ('category-landscape', 'photo', 'Landscape', 'landscape', 20, 1),
  ('category-street', 'photo', 'Street', 'street', 30, 1);
--> statement-breakpoint
INSERT INTO works (id, slug, kind, title, year, category_id, status, featured, sort_order, published_at, created_by, updated_by) VALUES
  ('work-threshold', 'threshold', 'art', 'Threshold', '2026', 'category-abstract', 'published', 0, 10, CURRENT_TIMESTAMP, 'seed', 'seed'),
  ('work-tidal-memory', 'tidal-memory', 'art', 'Tidal Memory', '2025', 'category-mixed-media', 'published', 0, 20, CURRENT_TIMESTAMP, 'seed', 'seed'),
  ('work-still-current', 'still-current', 'art', 'Still Current', '2025', 'category-works-paper', 'published', 0, 30, CURRENT_TIMESTAMP, 'seed', 'seed'),
  ('work-after-light', 'after-light', 'photo', 'After Light', '2026', 'category-architecture', 'published', 1, 10, CURRENT_TIMESTAMP, 'seed', 'seed'),
  ('work-north-wind', 'north-wind', 'photo', 'North Wind', '2024', 'category-landscape', 'published', 0, 20, CURRENT_TIMESTAMP, 'seed', 'seed'),
  ('work-passing-through', 'passing-through', 'photo', 'Passing Through', '2025', 'category-street', 'published', 0, 30, CURRENT_TIMESTAMP, 'seed', 'seed');
--> statement-breakpoint
INSERT INTO images (id, work_id, static_src, alt_text, mime_type, sort_order) VALUES
  ('image-threshold', 'work-threshold', '/gallery/threshold.png', 'Abstract indigo painting with a vertical gold gesture', 'image/png', 0),
  ('image-tidal-memory', 'work-tidal-memory', '/gallery/tidal-memory.png', 'Layered blue and charcoal mixed-media painting', 'image/png', 0),
  ('image-still-current', 'work-still-current', '/gallery/still-current.png', 'Minimal gestural artwork on textured paper', 'image/png', 0),
  ('image-after-light', 'work-after-light', '/gallery/after-light.png', 'Figure standing in a shadowed concrete interior', 'image/png', 0),
  ('image-north-wind', 'work-north-wind', '/gallery/north-wind.png', 'Dark coastal landscape in mist and wind', 'image/png', 0),
  ('image-passing-through', 'work-passing-through', '/gallery/passing-through.png', 'Cinematic city street photograph at night', 'image/png', 0);
--> statement-breakpoint
INSERT INTO artist_profile (id, public_name, wordmark, hero_headline, hero_introduction, about_headline, biography, contact_email, updated_by) VALUES
  ('primary', 'Studio Gallery', 'STUDIO / GALLERY', 'Where intuition becomes form.', 'An evolving collection of paintings, works on paper, and photographs shaped by atmosphere, place, and memory.', 'An artist attentive to what lingers.', 'This is a flexible introduction for the artist’s biography, practice, achievements, exhibitions, and the ideas connecting her art and photography.', 'studio@example.com', 'seed');
--> statement-breakpoint
INSERT INTO external_links (id, label, url, sort_order, active) VALUES
  ('link-instagram', 'Instagram', '#', 10, 1),
  ('link-exhibitions', 'Exhibitions', '#', 20, 1),
  ('link-inquiries', 'Studio inquiries', 'mailto:studio@example.com', 30, 1);
