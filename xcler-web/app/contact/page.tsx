import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px", display: "grid", gap: 18 }}>
      <h1>Start your project</h1>
      <p>Tell us what you need and we&apos;ll get back to you quickly.</p>
      <ContactForm />
    </main>
  );
}
