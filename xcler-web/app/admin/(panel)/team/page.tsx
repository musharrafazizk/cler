"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { ToastStack, useToasts } from "@/components/admin/Toast";
import type { TeamMember } from "@/lib/types";

type TeamForm = Omit<TeamMember, "id">;

const defaultForm: TeamForm = {
  name: "",
  role: "",
  bio: "",
  skills: [],
  photo_url: null,
  order_index: 0,
};

export default function AdminTeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TeamForm>(defaultForm);
  const [skillsInput, setSkillsInput] = useState("");
  const { toasts, pushToast, removeToast } = useToasts();

  const load = async () => {
    const response = await fetch("/api/admin/team-members", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch team members");
    setItems(data);
  };

  useEffect(() => {
    load().catch((error) => pushToast("error", error.message));
  }, [pushToast]);

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setSkillsInput("");
    setPanelOpen(true);
  };

  const openEdit = (item: TeamMember) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      bio: item.bio,
      skills: item.skills,
      photo_url: item.photo_url,
      order_index: item.order_index,
    });
    setSkillsInput(item.skills.join(", "));
    setPanelOpen(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      skills: skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      photo_url: form.photo_url || null,
    };

    const response = await fetch(editingId ? `/api/admin/team-members/${editingId}` : "/api/admin/team-members", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Save failed");

    pushToast("success", editingId ? "Team member updated" : "Team member created");
    setPanelOpen(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this member?")) return;
    const response = await fetch(`/api/admin/team-members/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      pushToast("error", data.error || "Delete failed");
      return;
    }
    pushToast("success", "Team member deleted");
    await load();
  };

  const skillsPreview = useMemo(
    () => skillsInput.split(",").map((skill) => skill.trim()).filter(Boolean),
    [skillsInput],
  );

  return (
    <section>
      <div className={styles.header}>
        <h1 className={styles.title}>Team</h1>
        <button className={`${styles.button} ${styles.primaryButton}`} type="button" onClick={openCreate}>
          + Add Team Member
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Name</th>
              <th>Role</th>
              <th>Skills</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.order_index}</td>
                <td>{item.name}</td>
                <td>{item.role}</td>
                <td>
                  <div className={styles.chips}>
                    {item.skills.map((skill) => (
                      <span key={skill} className={styles.chip}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
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
                <td colSpan={5}>No team members yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {panelOpen ? (
        <>
          <div className={styles.panelBackdrop} onClick={() => setPanelOpen(false)} />
          <aside className={styles.panel}>
            <h2>{editingId ? "Edit team member" : "Add team member"}</h2>
            <div className={styles.form}>
              <label>
                Name
                <input className={styles.input} value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
              </label>
              <label>
                Role
                <input className={styles.input} value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))} />
              </label>
              <label>
                Bio
                <textarea className={styles.textarea} value={form.bio} onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))} />
              </label>
              <label>
                Skills (comma-separated)
                <input className={styles.input} value={skillsInput} onChange={(event) => setSkillsInput(event.target.value)} />
                <span className={styles.chips}>
                  {skillsPreview.map((skill) => (
                    <span key={skill} className={styles.chip}>
                      {skill}
                    </span>
                  ))}
                </span>
              </label>
              <label>
                Photo URL
                <input className={styles.input} value={form.photo_url ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, photo_url: event.target.value || null }))} />
              </label>
              <label>
                Order index
                <input className={styles.input} type="number" value={form.order_index} onChange={(event) => setForm((prev) => ({ ...prev, order_index: Number(event.target.value) }))} />
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
