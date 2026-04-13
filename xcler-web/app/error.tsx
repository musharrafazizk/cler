"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        textAlign: "center",
        gap: "14px",
      }}
    >
      <h1>Something went wrong.</h1>
      <button
        type="button"
        onClick={reset}
        style={{ background: "#B6251D", color: "#fff", padding: "10px 16px", border: 0, cursor: "pointer" }}
      >
        Try again
      </button>
    </main>
  );
}
