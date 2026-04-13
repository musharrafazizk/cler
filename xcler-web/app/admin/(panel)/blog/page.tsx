"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { ToastStack, useToasts } from "@/components/admin/Toast";
import type { BlogPost } from "@/lib/types";

type BlogForm = Omit<BlogPost, "id" | "created_at" | "updated_at">;

const defaultForm: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: null,
  published: false,
  published_at: null,
  seo_title: "",
  seo_description: "",
  seo_keywords: [],
  author_name: "Musharraf Aziz",
  reading_time_minutes: 1,
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const calculateReadingTime = (content: string) => Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200));

const toDateTimeLocal = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return adjusted.toISOString().slice(0, 16);
};

const fromDateTimeLocal = (value: string) => (value ? new Date(value).toISOString() : null);

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(defaultForm);
  const [seoKeywordsInput, setSeoKeywordsInput] = useState("");
  const { toasts, pushToast, removeToast } = useToasts();

  const load = async () => {
    const response = await fetch("/api/admin/blog-posts", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch blog posts");
    setItems(data);
  };

  useEffect(() => {
    load().catch((error) => pushToast("error", error.message));
  }, [pushToast]);

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setSeoKeywordsInput("");
    setPanelOpen(true);
  };

  const openEdit = (item: BlogPost) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      cover_image_url: item.cover_image_url,
      published: item.published,
      published_at: item.published_at,
      seo_title: item.seo_title,
      seo_description: item.seo_description,
      seo_keywords: item.seo_keywords,
      author_name: item.author_name,
      reading_time_minutes: item.reading_time_minutes,
    });
    setSeoKeywordsInput(item.seo_keywords.join(", "));
    setPanelOpen(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      seo_keywords: seoKeywordsInput
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
      cover_image_url: form.cover_image_url || null,
    };

    const response = await fetch(editingId ? `/api/admin/blog-posts/${editingId}` : "/api/admin/blog-posts", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Save failed");

    pushToast("success", editingId ? "Blog post updated" : "Blog post created");
    setPanelOpen(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this blog post?")) return;
    const response = await fetch(`/api/admin/blog-posts/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      pushToast("error", data.error || "Delete failed");
      return;
    }
    pushToast("success", "Blog post deleted");
    await load();
  };

  const keywordsPreview = useMemo(
    () => seoKeywordsInput.split(",").map((keyword) => keyword.trim()).filter(Boolean),
    [seoKeywordsInput],
  );

  return (
    <section>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <button className={`${styles.button} ${styles.primaryButton}`} type="button" onClick={openCreate}>
          + Add Blog Post
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Published</th>
              <th>Published date</th>
              <th>Reading time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.published ? "Yes" : "No"}</td>
                <td>{item.published_at ? new Date(item.published_at).toLocaleString() : "-"}</td>
                <td>{item.reading_time_minutes} min</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.button} type="button" onClick={() => openEdit(item)}>
                      Edit
                    </button>
                    <button className={styles.button} type="button" onClick={() => remove(item.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={5}>No blog posts yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {panelOpen ? (
        <>
          <div className={styles.panelBackdrop} onClick={() => setPanelOpen(false)} />
          <aside className={styles.panel}>
            <h2>{editingId ? "Edit blog post" : "Add blog post"}</h2>
            <div className={styles.form}>
              <label>
                Title
                <input
                  className={styles.input}
                  value={form.title}
                  onChange={(event) => {
                    const title = event.target.value;
                    setForm((prev) => ({
                      ...prev,
                      title,
                      slug: editingId ? prev.slug : slugify(title),
                    }));
                  }}
                />
              </label>
              <label>
                Slug
                <input className={styles.input} value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} />
              </label>
              <label>
                Excerpt
                <textarea className={styles.textarea} value={form.excerpt} onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))} />
              </label>
              <label>
                Content (markdown)
                <textarea
                  className={`${styles.textarea} ${styles.monospace}`}
                  value={form.content}
                  onChange={(event) => {
                    const content = event.target.value;
                    setForm((prev) => ({
                      ...prev,
                      content,
                      reading_time_minutes: calculateReadingTime(content),
                    }));
                  }}
                />
              </label>
              <label>
                Cover image URL
                <input className={styles.input} value={form.cover_image_url ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, cover_image_url: event.target.value || null }))} />
              </label>
              <label>
                Published
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      published: event.target.checked,
                      published_at: event.target.checked ? prev.published_at ?? new Date().toISOString() : null,
                    }))
                  }
                />
              </label>
              <label>
                Published at
                <input
                  className={styles.input}
                  type="datetime-local"
                  value={toDateTimeLocal(form.published_at)}
                  onChange={(event) => setForm((prev) => ({ ...prev, published_at: fromDateTimeLocal(event.target.value) }))}
                />
              </label>
              <label>
                SEO title
                <input className={styles.input} value={form.seo_title} onChange={(event) => setForm((prev) => ({ ...prev, seo_title: event.target.value }))} />
              </label>
              <label>
                SEO description
                <textarea className={styles.textarea} value={form.seo_description} onChange={(event) => setForm((prev) => ({ ...prev, seo_description: event.target.value }))} />
              </label>
              <label>
                SEO keywords (comma-separated)
                <input className={styles.input} value={seoKeywordsInput} onChange={(event) => setSeoKeywordsInput(event.target.value)} />
                <span className={styles.chips}>
                  {keywordsPreview.map((keyword) => (
                    <span key={keyword} className={styles.chip}>
                      {keyword}
                    </span>
                  ))}
                </span>
              </label>
              <label>
                Author name
                <input className={styles.input} value={form.author_name} onChange={(event) => setForm((prev) => ({ ...prev, author_name: event.target.value }))} />
              </label>
              <label>
                Reading time (minutes)
                <input className={styles.input} type="number" value={form.reading_time_minutes} onChange={(event) => setForm((prev) => ({ ...prev, reading_time_minutes: Number(event.target.value) }))} />
              </label>
            </div>
            <div className={styles.actions}>
              <button className={`${styles.button} ${styles.primaryButton}`} type="button" onClick={() => save().catch((error) => pushToast("error", error.message))}>
                Save
              </button>
              <button className={styles.button} type="button" onClick={() => setPanelOpen(false)}>
                Cancel
              </button>
            </div>
          </aside>
        </>
      ) : null}

      <ToastStack toasts={toasts} onRemove={removeToast} />
    </section>
  );
}
