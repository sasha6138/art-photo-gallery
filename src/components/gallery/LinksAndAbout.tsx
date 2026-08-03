import type { GalleryLink, GalleryProfile } from "@/types/gallery";

export default function LinksAndAbout({ profile, links }: { profile: GalleryProfile; links: GalleryLink[] }) {
  return (
    <section className="links-about section-shell">
      <div id="links" className="links-panel">
        <p className="eyebrow">03 / Links</p>
        <h2>Elsewhere</h2>
        <div className="link-list">
          {links.map((link) => <a key={link.id} href={link.url}>{link.label} <span>↗</span></a>)}
        </div>
      </div>
      <div id="about" className="about-panel">
        <p className="eyebrow">04 / About</p>
        <h2>{profile.aboutHeadline}</h2>
        <p>{profile.biography}</p>
        <p className="future-note">Selected works will be available to acquire in a future edition of the site.</p>
      </div>
    </section>
  );
}

