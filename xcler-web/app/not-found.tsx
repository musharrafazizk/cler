import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        textAlign: "center",
        gap: "16px",
      }}
    >
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(4rem, 14vw, 10rem)", lineHeight: 0.9 }}>
        404
      </h1>
      <p>This page doesn&apos;t exist.</p>
      <Link
        href="/"
        style={{ background: "#B6251D", color: "#fff", padding: "10px 16px", display: "inline-block" }}
      >
        Go home →
      </Link>
    </main>
  );
}
