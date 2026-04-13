"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          padding: "24px",
          gap: "14px",
          background: "#111110",
          color: "#f5f3ee",
        }}
      >
        <h1>Something went wrong.</h1>
        <button
          type="button"
          onClick={reset}
          style={{ background: "#E63329", color: "#fff", padding: "10px 16px", border: 0, cursor: "pointer" }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
