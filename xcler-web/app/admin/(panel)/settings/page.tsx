"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { ToastStack, useToasts } from "@/components/admin/Toast";
import type { SiteSettings } from "@/lib/types";

type SettingsForm = Omit<SiteSettings, "id">;

const defaultSettings: SettingsForm = {
  contact_email: "",
  whatsapp_number: "",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
  hero_headline_line1: "",
  hero_headline_line2: "",
  hero_subheading: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const { toasts, pushToast, removeToast } = useToasts();

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load settings");
        setForm({
          contact_email: data.contact_email,
          whatsapp_number: data.whatsapp_number,
          facebook_url: data.facebook_url,
          instagram_url: data.instagram_url,
          linkedin_url: data.linkedin_url,
          hero_headline_line1: data.hero_headline_line1,
          hero_headline_line2: data.hero_headline_line2,
          hero_subheading: data.hero_subheading,
        });
      })
      .catch((error) => pushToast("error", error.message));
  }, [pushToast]);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save settings");
      pushToast("success", "Settings updated");
    } catch (error) {
      pushToast("error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
      </div>

      <form className={styles.form} onSubmit={save}>
        <label>
          Contact email
          <input className={styles.input} type="email" value={form.contact_email} onChange={(event) => setForm((prev) => ({ ...prev, contact_email: event.target.value }))} />
        </label>
        <label>
          WhatsApp number
          <input className={styles.input} value={form.whatsapp_number} onChange={(event) => setForm((prev) => ({ ...prev, whatsapp_number: event.target.value }))} />
        </label>
        <label>
          Facebook URL
          <input className={styles.input} value={form.facebook_url} onChange={(event) => setForm((prev) => ({ ...prev, facebook_url: event.target.value }))} />
        </label>
        <label>
          Instagram URL
          <input className={styles.input} value={form.instagram_url} onChange={(event) => setForm((prev) => ({ ...prev, instagram_url: event.target.value }))} />
        </label>
        <label>
          LinkedIn URL
          <input className={styles.input} value={form.linkedin_url} onChange={(event) => setForm((prev) => ({ ...prev, linkedin_url: event.target.value }))} />
        </label>
        <label>
          Hero headline line 1
          <input className={styles.input} value={form.hero_headline_line1} onChange={(event) => setForm((prev) => ({ ...prev, hero_headline_line1: event.target.value }))} />
        </label>
        <label>
          Hero headline line 2
          <input className={styles.input} value={form.hero_headline_line2} onChange={(event) => setForm((prev) => ({ ...prev, hero_headline_line2: event.target.value }))} />
        </label>
        <label>
          Hero subheading
          <textarea className={styles.textarea} value={form.hero_subheading} onChange={(event) => setForm((prev) => ({ ...prev, hero_subheading: event.target.value }))} />
        </label>
        <button className={`${styles.button} ${styles.primaryButton}`} type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save settings"}
        </button>
      </form>

      <ToastStack toasts={toasts} onRemove={removeToast} />
    </section>
  );
}
