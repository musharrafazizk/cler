import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px",
          background: "#111110",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ width: 16, height: "80%", background: "#E63329" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, marginLeft: 40 }}>
          <div style={{ fontSize: 118, fontWeight: 700, letterSpacing: "0.08em" }}>XCLER</div>
          <div style={{ fontSize: 38, color: "#d6d3cc" }}>Web Development · Automation · AI Systems</div>
        </div>
        <div style={{ alignSelf: "flex-end", color: "#E63329", fontSize: 34, fontWeight: 700 }}>
          xcler.dev
        </div>
      </div>
    ),
    size,
  );
}
