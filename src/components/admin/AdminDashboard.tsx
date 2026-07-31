"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { works } from "@/data/sample-works";
import styles from "./admin.module.css";

const entries = works.map((work) => ({
  ...work,
  type: work.kind,
  status: "Published",
  image: work.src,
}));

export default function AdminDashboard({ displayName, email, signOutPath }: { displayName: string; email: string; signOutPath: string }) {
  const [filter, setFilter] = useState("All");
  const visibleEntries = filter === "All" ? entries : entries.filter((entry) => entry.type === filter);

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
        <article><strong>6</strong><span>Published works</span></article>
        <article><strong>3</strong><span>Art categories</span></article>
        <article><strong>3</strong><span>Photo categories</span></article>
      </section>

      <div className={styles.toolbar}>
        <div className={styles.filters}>{["All", "Art", "Photo"].map((item) => <button key={item} className={filter === item ? styles.activeFilter : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
        <button className={styles.addButton} title="Uploads will be enabled with database storage">＋ Add work</button>
      </div>

      <div className={styles.notice}><strong>Admin foundation ready.</strong> Editing and uploads will be activated when database and image storage are connected.</div>

      <div className={styles.list}>
        <div className={styles.listHead}><span>Work</span><span>Type</span><span>Category</span><span>Year</span><span>Status</span></div>
        {visibleEntries.map((entry) => <article className={styles.row} key={entry.title}>
          <div className={styles.work}><div className={styles.thumb}><Image src={entry.image} alt="" fill sizes="56px" /></div><strong>{entry.title}</strong></div>
          <span>{entry.type}</span><span>{entry.category}</span><span>{entry.year}</span><span className={styles.status}>{entry.status}</span>
        </article>)}
      </div>
    </section>
  </main>;
}
