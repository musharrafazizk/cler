import ContactForm from "@/components/ContactForm";
import { buildPageMetadata } from "@/lib/metadata";

export default function ContactPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px", display: "grid", gap: 18 }}>
      <h1>Start your project</h1>
      <p>Tell us what you need and we&apos;ll get back to you quickly.</p>
      <a
        href="https://wa.me/923154823517?text=Hi%20Xcler%2C%20I%20found%20you%20online%20and%20I%27d%20like%20to%20discuss%20a%20project."
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#B6251D", fontWeight: 600 }}
      >
        Message us directly on WhatsApp →
      </a>
      <ContactForm />
    </main>
  );
}

export const metadata = buildPageMetadata({
  title: "Contact Xcler",
  description: "Tell Xcler about your project and get a response within 24 hours.",
  path: "/contact",
});
