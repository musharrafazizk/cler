"use client";

import { useEffect, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { ToastStack, useToasts } from "@/components/admin/Toast";
import type { Testimonial } from "@/lib/types";

type TestimonialForm = Omit<Testimonial, "id">;

const defaultForm: TestimonialForm = {
  quote: "",
  author_name: "",
  author_role: "",
  author_company: "",
  featured: false,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(defaultForm);
  const { toasts, pushToast, removeToast } = useToasts();

  const load = async () => {
    const response = await fetch("/api/admin/testimonials", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch testimonials");
    setItems(data);
  };

  useEffect(() => {
    load().catch((error) => pushToast("error", error.message));
  }, [pushToast]);

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setPanelOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setForm({
      quote: item.quote,
      author_name: item.author_name,
      author_role: item.author_role,
      author_company: item.author_company,
      featured: item.featured,
    });
    setPanelOpen(true);
  };

  const save = async () => {
    const response = await fetch(editingId ? `/api/admin/testimonials/${editingId}` : "/api/admin/testimonials", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Save failed");

    pushToast("success", editingId ? "Testimonial updated" : "Testimonial created");
    setPanelOpen(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    const response = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      pushToast("error", data.error || "Delete failed");
      return;
    }
    pushToast("success", "Testimonial deleted");
    await load();
  };

  return (
    <section>
      <div className={styles.header}>
        <h1 className={styles.title}>Testimonials</h1>
        <button className={`${styles.button} ${styles.primaryButton}`} type="button" onClick={openCreate}>
          + Add Testimonial
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Author</th>
              <th>Company</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.author_name}</td>
                <td>{item.author_company}</td>
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
                <td colSpan={4}>No testimonials yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {panelOpen ? (
        <>
          <div className={styles.panelBackdrop} onClick={() => setPanelOpen(false)} />
          <aside className={styles.panel}>
            <h2>{editingId ? "Edit testimonial" : "Add testimonial"}</h2>
            <div className={styles.form}>
              <label>
                Quote
                <textarea className={styles.textarea} value={form.quote} onChange={(event) => setForm((prev) => ({ ...prev, quote: event.target.value }))} />
              </label>
              <label>
                Author name
                <input className={styles.input} value={form.author_name} onChange={(event) => setForm((prev) => ({ ...prev, author_name: event.target.value }))} />
              </label>
              <label>
                Author role
                <input className={styles.input} value={form.author_role} onChange={(event) => setForm((prev) => ({ ...prev, author_role: event.target.value }))} />
              </label>
              <label>
                Author company
                <input className={styles.input} value={form.author_company} onChange={(event) => setForm((prev) => ({ ...prev, author_company: event.target.value }))} />
              </label>
              <label>
                Featured
                <input type="checkbox" checked={form.featured} onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))} />
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
