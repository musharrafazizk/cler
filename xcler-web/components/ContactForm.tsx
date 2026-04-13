"use client";

import { FormEvent, useState } from "react";

const services = [
  "Web Development",
  "App Development",
  "Automation",
  "AI/Chatbot",
  "WordPress",
  "Shopify",
];

const budgets = ["€150-500", "€500-2000", "€2000-5000", "€5000+"];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    service: services[0],
    message: "",
    budget: budgets[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit form");
      setSuccess(true);
      setForm({
        name: "",
        email: "",
        whatsapp: "",
        service: services[0],
        message: "",
        budget: budgets[0],
      });
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
      <label>
        Full name
        <input required value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
      </label>
      <label>
        Email
        <input
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
      </label>
      <label>
        WhatsApp number
        <input required value={form.whatsapp} onChange={(event) => setForm((prev) => ({ ...prev, whatsapp: event.target.value }))} />
      </label>
      <label>
        Service needed
        <select value={form.service} onChange={(event) => setForm((prev) => ({ ...prev, service: event.target.value }))}>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </label>
      <label>
        Project description
        <textarea required value={form.message} onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))} />
      </label>
      <label>
        Budget range
        <select value={form.budget} onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}>
          {budgets.map((budget) => (
            <option key={budget} value={budget}>
              {budget}
            </option>
          ))}
        </select>
      </label>

      {error ? <p style={{ color: "#E63329" }}>{error}</p> : null}
      {success ? <p style={{ color: "#2f9e44" }}>We&apos;ll be in touch on WhatsApp within 24 hours.</p> : null}

      <button type="submit" disabled={loading} style={{ background: "#E63329", color: "#fff", padding: "10px 14px", border: 0, borderRadius: 8 }}>
        {loading ? "Sending..." : "Send inquiry"}
      </button>
    </form>
  );
}
