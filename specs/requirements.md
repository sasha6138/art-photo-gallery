# Art and Photo Gallery — Requirements

## 1. Purpose

Create a portfolio website for an artist to present her artistic achievements, including original art and photography. The immediate goal is a polished, image-focused portfolio. A later phase may allow selected works to be offered for sale.

This document summarizes the requirements agreed during the project conversation. Items labeled **Current** are implemented in the present prototype. Items labeled **Planned** describe the intended content-management solution. Items labeled **Future** are explicitly deferred.

### Dynamic collection implementation update

The first persistent-content milestone is now implemented in source:

- D1 tables store categories, works, image metadata, artist information, and links.
- R2 stores separate original, display, and thumbnail objects for new uploads.
- The six bundled sample works are seeded into D1 during the first migration.
- Public Gallery rendering reads published, non-archived works from D1.
- An authorized administrator can add a draft, edit metadata or replace its image, publish it, and archive it.
- Every Admin API read and write repeats server-side authentication and allowlist authorization.
- Profile, links, category management, preview, unpublish, and permanent delete remain in the next Admin iteration; their underlying tables are present.

## 2. Users

### Public visitor

A visitor should be able to:

- Understand the artist's practice and achievements.
- Browse art and photography separately.
- Browse works by category.
- Open a thumbnail as a larger image without leaving the gallery context.
- Read artist information and follow relevant external links.
- Use the site comfortably on desktop and mobile devices.

### Artist / administrator

The artist should eventually be able to manage the portfolio without modifying source code. Administration must be private and available only to authorized accounts.

## 3. Public Gallery requirements

### 3.1 Navigation — Current

The primary navigation contains five entries:

1. Home
2. Art
3. Photos
4. Links
5. About

Art and Photos are organized by category. The current prototype uses navigation submenus and category-based gallery sections.

### 3.2 Home — Current

The Home experience should:

- Introduce the artist's portfolio through a strong featured image and concise statement.
- Emphasize the work rather than generic website decoration.
- Provide a clear path into the collection.
- Support future replacement of all sample wording, artist identity, colors, and imagery.

### 3.3 Art — Current structure, planned dynamic content

- Display art categories with representative thumbnail images.
- Display the title, category, and year for each sample work.
- Open a full-size image viewer when a thumbnail is selected.
- Allow categories and works to be replaced and reordered through Admin in a planned phase.
- Support additional artwork metadata in the planned data model, including medium, dimensions, description, availability, and display order.

The current categories—Abstract, Mixed Media, and Works on Paper—are placeholders.

### 3.4 Photos — Current structure, planned dynamic content

- Display photography categories with representative thumbnail images.
- Display the title, category, and year for each sample photograph.
- Open a full-size image viewer when a thumbnail is selected.
- Allow categories and photographs to be replaced and reordered through Admin in a planned phase.

The current categories—Architecture, Landscape, and Street—are placeholders.

### 3.5 Full-size image viewer — Current

The gallery viewer should:

- Open above the current page.
- Display the selected image at the largest practical size.
- Include title, category, and year.
- Support previous and next navigation.
- Close through a visible control or the Escape key.
- Support keyboard arrow navigation.
- Prevent background scrolling while open.

### 3.6 Links — Current structure, content pending

Provide editable links such as:

- Instagram or other social portfolio.
- Exhibition information.
- Studio or general inquiries.

The current links and email address are placeholders.

### 3.7 About — Current structure, content pending

Provide a flexible area for:

- Artist biography.
- Artistic practice and statement.
- Achievements and exhibitions.
- Relationship between art and photography.

The current biography is placeholder copy.

### 3.8 Visual direction — Current foundation

- Use the selected **Darkroom Modern** direction as the structural foundation.
- Favor cinematic, image-forward layouts and refined editorial typography.
- Treat the current near-black background, light text, cobalt accent, and all wording as changeable design tokens rather than final branding.
- Preserve a visually quiet interface that supports the artist's work.

### 3.9 Responsive and accessible behavior — Current

- Support desktop and mobile layouts.
- Provide a mobile navigation menu.
- Give interactive images accessible labels.
- Support keyboard operation for the full-size viewer.
- Respect the user's reduced-motion preference.
- Maintain readable contrast when the final palette is selected.

## 4. Admin requirements

### 4.1 Protected route — Current

- Admin is available at `/admin`.
- The route requires ChatGPT sign-in.
- Authorization is checked on the server against an explicit administrator email allowlist.
- The current site owner's account is authorized.
- An unauthorized signed-in user must not be given access merely because the person has a ChatGPT account.
- A sign-out action and a link back to the public gallery are provided.

### 4.2 Admin dashboard — Current foundation

The current dashboard provides:

- Collection summary.
- Existing sample-work list.
- Art and Photo filters.
- Thumbnail, title, type, category, year, and publication status.
- Navigation placeholders for Collection, Categories, Artist profile, and Links.
- A visible Add Work entry point that clearly indicates storage is not connected yet.

### 4.3 Content management — Planned

The administrator should be able to:

- Create, edit, preview, publish, unpublish, archive, and delete a work.
- Upload an original image and generate or upload display and thumbnail variants.
- Assign a work to Art or Photography.
- Assign and manage categories.
- Enter title, year, description, medium, dimensions, and optional notes.
- Choose featured works and category cover images.
- Control display order.
- Save drafts before public publication.
- Edit artist biography, statement, contact information, and external links.
- See publication and availability status at a glance.

All write operations must enforce authentication and administrator authorization on the server. Hiding controls in the browser is not sufficient protection.

### 4.4 Persistent storage — Planned

- Store structured content and relationships in a database.
- Store uploaded image bytes in object storage rather than the source repository or database.
- Store image metadata and object keys in the database.
- Preserve content across application deployments.
- Avoid browser storage as the authoritative source of portfolio data.

For the current ChatGPT Sites deployment, the proposed platform services are Cloudflare D1 for structured data and Cloudflare R2 for images.

## 5. Future commerce requirements

The following capabilities are deferred and should not complicate the initial content-management release:

- Mark selected works as available, reserved, or sold.
- Display price and currency when appropriate.
- Support purchase inquiries or direct checkout.
- Track inventory and orders.
- Collect shipping and tax information.
- Integrate a payment provider.

The planned content schema should reserve space for availability and price information so commerce can be added without restructuring the entire collection.

## 6. Current implementation constraints

- The application is implemented in React and TypeScript using a Next.js-compatible Vinext runtime.
- Application code is organized under `src/`, with routes in `src/app`, reusable UI in `src/components`, temporary content in `src/data`, server-only code in `src/server`, and shared types in `src/types`.
- The public gallery is currently one route with anchored sections; `/admin` is a separate protected route.
- Gallery images currently live under `public/gallery`.
- Gallery metadata currently lives in a TypeScript array in the application source.
- There is currently no D1 database or R2 bucket connected.
- Changes to current gallery content require a source change and a new deployment until content management is implemented.
- ChatGPT Sites deploys the application to a Cloudflare Worker-compatible runtime. Cloudflare is the hosting implementation of Sites, not a fundamental business requirement of the gallery.

## 7. Open decisions

The following information remains to be supplied or selected:

- Artist's public name and preferred wordmark.
- Final biography, artist statement, and achievement history.
- Final Art and Photography categories.
- Real artwork and photography assets and their metadata.
- Final color palette and typography.
- Public contact address and external links.
- Whether the Gallery is fully public or limited during preparation.
- Image download protection and watermark policy, if any.
- Whether future sales begin with inquiries or full online checkout.
- Whether more than one administrator or editor role will be needed.

## 8. Acceptance criteria for the next content-management phase

The first dynamic release is complete when an authorized administrator can sign in, create a draft work with an uploaded image, assign a category, publish it, and see it appear in the public gallery without changing source code or redeploying the application. Unauthorized users must be unable to perform or invoke any administrative write operation.

