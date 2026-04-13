"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { ToastStack, useToasts } from "@/components/admin/Toast";
import type { Project } from "@/lib/types";

const categories = ["Web Dev", "App Dev", "Automation", "AI/Chatbot", "WordPress", "Shopify"];

type ProjectForm = Omit<Project, "id" | "created_at">;

const defaultForm: ProjectForm = {
  title: "",
  slug: "",
  description: "",
  long_description: "",
  tags: [],
  category: categories[0],
  image_url: null,
  live_url: null,
  github_url: null,
  featured: false,
  order_index: 0,
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(defaultForm);
  const [tagsInput, setTagsInput] = useState("");
  const { toasts, pushToast, removeToast } = useToasts();

  const load = async () => {
    const response = await fetch("/api/admin/projects", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch projects");
    setItems(data);
  };

  useEffect(() => {
    load().catch((error) => pushToast("error", error.message));
  }, [pushToast]);

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setTagsInput("");
    setPanelOpen(true);
  };

  const openEdit = (item: Project) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description,
      long_description: item.long_description,
      tags: item.tags,
      category: item.category,
      image_url: item.image_url,
      live_url: item.live_url,
      github_url: item.github_url,
      featured: item.featured,
      order_index: item.order_index,
    });
    setTagsInput(item.tags.join(", "));
    setPanelOpen(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      image_url: form.image_url || null,
      live_url: form.live_url || null,
      github_url: form.github_url || null,
    };

    const response = await fetch(editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Save failed");

    pushToast("success", editingId ? "Project updated" : "Project created");
    setPanelOpen(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this project?")) return;
    const response = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      pushToast("error", data.error || "Delete failed");
      return;
    }
    pushToast("success", "Project deleted");
    await load();
  };

  const tagsPreview = useMemo(
    () => tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean),
    [tagsInput],
  );

  return (
    <section>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <button className={`${styles.button} ${styles.primaryButton}`} type="button" onClick={openCreate}>
          + Add Project
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Title</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.order_index}</td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>
                  <div className={styles.chips}>
                    {item.tags.map((tag) => (
                      <span key={tag} className={styles.chip}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>{item.featured ? "Yes" : "No"}</td>
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
                <td colSpan={6}>No projects yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {panelOpen ? (
        <>
          <div className={styles.panelBackdrop} onClick={() => setPanelOpen(false)} />
          <aside className={styles.panel}>
            <h2>{editingId ? "Edit project" : "Add project"}</h2>
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
                <input
                  className={styles.input}
                  value={form.slug}
                  onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                />
              </label>
              <label>
                Description
                <textarea
                  className={styles.textarea}
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </label>
              <label>
                Long description
                <textarea
                  className={styles.textarea}
                  value={form.long_description}
                  onChange={(event) => setForm((prev) => ({ ...prev, long_description: event.target.value }))}
                />
              </label>
              <label>
                Category
                <select
                  className={styles.select}
                  value={form.category}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tags (comma-separated)
                <input
                  className={styles.input}
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                />
                <span className={styles.chips}>
                  {tagsPreview.map((tag) => (
                    <span key={tag} className={styles.chip}>
                      {tag}
                    </span>
                  ))}
                </span>
              </label>
              <label>
                Image URL
                <input
                  className={styles.input}
                  value={form.image_url ?? ""}
                  onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value || null }))}
                />
              </label>
              {form.image_url ? (
                <a href={form.image_url} target="_blank" rel="noopener noreferrer">
                  Preview image URL
                </a>
              ) : null}
              <label>
                Live URL
                <input
                  className={styles.input}
                  value={form.live_url ?? ""}
                  onChange={(event) => setForm((prev) => ({ ...prev, live_url: event.target.value || null }))}
                />
              </label>
              <label>
                GitHub URL
                <input
                  className={styles.input}
                  value={form.github_url ?? ""}
                  onChange={(event) => setForm((prev) => ({ ...prev, github_url: event.target.value || null }))}
                />
              </label>
              <label>
                Featured
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))}
                />
              </label>
              <label>
                Order index
                <input
                  className={styles.input}
                  type="number"
                  value={form.order_index}
                  onChange={(event) => setForm((prev) => ({ ...prev, order_index: Number(event.target.value) }))}
                />
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
