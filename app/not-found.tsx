import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 65px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f4f2",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "4px 12px",
          backgroundColor: "#111111",
          color: "#f5c842",
          fontSize: "10px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "16px",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: "48px",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-2px",
          color: "#111111",
          marginBottom: "12px",
        }}
      >
        Halaman <span style={{ color: "#f5c842" }}>Tidak Ada</span>
      </h1>
      <p style={{ fontSize: "14px", color: "#4a4a4a", marginBottom: "32px" }}>
        Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan.
      </p>
      <Link
        href="/"
        style={{
          backgroundColor: "#111111",
          color: "#ffffff",
          padding: "14px 28px",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "2px",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
