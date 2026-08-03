"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./admin.module.css";

type Category = { id: string; name: string; kind: "art" | "photo"; active: boolean };
type AdminWork = {
  id: string; title: string; year: string; kind: "art" | "photo"; categoryId: string;
  category: string; status: "draft" | "published" | "archived"; image: string; altText: string;
  description: string; medium: string; dimensions: string;
};
type Snapshot = { works: AdminWork[]; categories: Category[] };

export default function AdminDashboard({ displayName, email, signOutPath }: { displayName: string; email: string; signOutPath: string }) {
  const [snapshot, setSnapshot] = useState<Snapshot>({ works: [], categories: [] });
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<AdminWork | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Loading collection…");

  const refresh = useCallback(async () => {
    const response = await fetch("/api/admin/works", { cache: "no-store" });
    const data = await response.json() as Snapshot & { error?: string };
    if (!response.ok) throw new Error(data.error ?? "Unable to load the collection.");
    setSnapshot(data);
    setMessage("");
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/works", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as Snapshot & { error?: string };
        if (!response.ok) throw new Error(data.error ?? "Unable to load the collection.");
        if (active) { setSnapshot(data); setMessage(""); }
      })
      .catch((error: Error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, []);

  const visible = useMemo(() => snapshot.works.filter((work) => filter === "all" || work.kind === filter || work.status === filter), [snapshot.works, filter]);
  const published = snapshot.works.filter((work) => work.status === "published").length;
  const drafts = snapshot.works.filter((work) => work.status === "draft").length;
  const archived = snapshot.works.filter((work) => work.status === "archived").length;

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    const form = event.currentTarget;
    const body = new FormData(form);
    const url = editing ? `/api/admin/works/${editing.id}` : "/api/admin/works";
    try {
      const response = await fetch(url, { method: editing ? "PATCH" : "POST", body });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Save failed.");
      setEditing(undefined);
      await refresh();
      setMessage(editing ? "Work updated." : "Draft added.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally { setBusy(false); }
  }

  async function changeStatus(work: AdminWork, action: "publish" | "archive") {
    setBusy(true); setMessage("");
    const body = new FormData(); body.set("action", action);
    try {
      const response = await fetch(`/api/admin/works/${work.id}`, { method: "PATCH", body });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Action failed.");
      await refresh();
      setMessage(action === "publish" ? "Work published to the gallery." : "Work archived.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed.");
    } finally { setBusy(false); }
  }

  return <main className={styles.shell}>
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.wordmark}>STUDIO / GALLERY</Link>
      <nav className={styles.sideNav} aria-label="Admin navigation">
        <a className={styles.current} href="#collection">Collection</a>
        <a href="#categories">Categories</a>
        <a href="#profile">Artist profile</a>
        <a href="#links">Links</a>
      </nav>
      <div className={styles.account}><span>{displayName}</span><small>{email}</small><a href={signOutPath}>Sign out</a></div>
    </aside>

    <section className={styles.content} id="collection">
      <header className={styles.header}>
        <div><p>Private administration</p><h1>Collection</h1></div>
        <Link href="/" className={styles.viewSite}>View gallery ↗</Link>
      </header>

      <section className={styles.summary} aria-label="Collection summary">
        <article><strong>{published}</strong><span>Published works</span></article>
        <article><strong>{drafts}</strong><span>Drafts</span></article>
        <article><strong>{archived}</strong><span>Archived</span></article>
      </section>

      <div className={styles.toolbar}>
        <div className={styles.filters}>{["all", "art", "photo", "draft", "archived"].map((item) => <button key={item} className={filter === item ? styles.activeFilter : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
        <button className={styles.addButton} onClick={() => setEditing(null)}>＋ Add work</button>
      </div>

      {message && <div className={styles.notice} role="status">{message}</div>}

      <div className={styles.list}>
        <div className={styles.listHead}><span>Work</span><span>Type</span><span>Category</span><span>Status</span><span>Actions</span></div>
        {visible.map((work) => <article className={styles.row} key={work.id}>
          <div className={styles.work}><div className={styles.thumb}><Image src={work.image} alt="" fill sizes="56px" /></div><span><strong>{work.title}</strong><small>{work.year}</small></span></div>
          <span>{work.kind}</span><span>{work.category}</span><span className={styles.status} data-status={work.status}>{work.status}</span>
          <div className={styles.actions}>
            <button onClick={() => setEditing(work)}>Edit</button>
            {work.status !== "published" && work.status !== "archived" && <button onClick={() => changeStatus(work, "publish")} disabled={busy}>Publish</button>}
            {work.status !== "archived" && <button onClick={() => changeStatus(work, "archive")} disabled={busy}>Archive</button>}
          </div>
        </article>)}
        {!message && visible.length === 0 && <p className={styles.empty}>No works match this filter.</p>}
      </div>
    </section>

    {editing !== undefined && <div className={styles.modal} role="dialog" aria-modal="true" aria-label={editing ? "Edit work" : "Add work"}>
      <form className={styles.form} onSubmit={save}>
        <div className={styles.formHeader}><div><p>{editing ? "Edit work" : "New draft"}</p><h2>{editing?.title ?? "Add to collection"}</h2></div><button type="button" onClick={() => setEditing(undefined)}>Close ×</button></div>
        <div className={styles.formGrid}>
          <label>Type<select name="kind" defaultValue={editing?.kind ?? "art"} required><option value="art">Art</option><option value="photo">Photo</option></select></label>
          <label>Category<select name="categoryId" defaultValue={editing?.categoryId ?? ""} required><option value="">Choose category</option>{snapshot.categories.filter((category) => category.active).map((category) => <option key={category.id} value={category.id}>{category.name} · {category.kind}</option>)}</select></label>
          <label className={styles.wide}>Title<input name="title" defaultValue={editing?.title ?? ""} required /></label>
          <label>Year<input name="year" defaultValue={editing?.year ?? ""} required /></label>
          <label>Alternative text<input name="altText" defaultValue={editing?.altText ?? ""} required /></label>
          <label>Medium<input name="medium" defaultValue={editing?.medium ?? ""} /></label>
          <label>Dimensions<input name="dimensions" defaultValue={editing?.dimensions ?? ""} /></label>
          <label className={styles.wide}>Description<textarea name="description" defaultValue={editing?.description ?? ""} rows={4} /></label>
          <label className={styles.wide}>Original image {editing && <small>Leave empty to keep the current image.</small>}<input name="original" type="file" accept="image/jpeg,image/png,image/webp" required={!editing} /></label>
          <label className={styles.wide}>Thumbnail <small>Optional. The original is used when omitted.</small><input name="thumbnail" type="file" accept="image/jpeg,image/png,image/webp" /></label>
        </div>
        {message && <div className={styles.notice}>{message}</div>}
        <div className={styles.formActions}><button type="button" onClick={() => setEditing(undefined)}>Cancel</button><button className={styles.addButton} disabled={busy}>{busy ? "Saving…" : "Save draft"}</button></div>
      </form>
    </div>}
  </main>;
}

