export default function LinksAndAbout() {
  return (
    <section className="links-about section-shell">
      <div id="links" className="links-panel">
        <p className="eyebrow">03 / Links</p>
        <h2>Elsewhere</h2>
        <div className="link-list">
          <a href="#">Instagram <span>↗</span></a>
          <a href="#">Exhibitions <span>↗</span></a>
          <a href="mailto:studio@example.com">Studio inquiries <span>↗</span></a>
        </div>
      </div>
      <div id="about" className="about-panel">
        <p className="eyebrow">04 / About</p>
        <h2>An artist attentive to what lingers.</h2>
        <p>
          This is a flexible introduction for the artist’s biography, practice,
          achievements, exhibitions, and the ideas connecting her art and photography.
        </p>
        <p className="future-note">
          Selected works will be available to acquire in a future edition of the site.
        </p>
      </div>
    </section>
  );
}
