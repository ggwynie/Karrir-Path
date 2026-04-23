"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const router = useRouter();

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
        Error
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
        Ada yang <span style={{ color: "#f5c842" }}>Salah</span>
      </h1>
      <p style={{ fontSize: "14px", color: "#4a4a4a", marginBottom: "32px" }}>
        Terjadi kesalahan yang tidak terduga. Coba lagi atau kembali ke beranda.
      </p>
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={reset}
          style={{
            backgroundColor: "#111111",
            color: "#ffffff",
            padding: "14px 28px",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "2px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Coba Lagi
        </button>
        <button
          onClick={() => router.push("/")}
          style={{
            backgroundColor: "transparent",
            color: "#111111",
            padding: "14px 28px",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "2px",
            border: "2px solid #111111",
            cursor: "pointer",
          }}
        >
          Ke Beranda
        </button>
      </div>
    </div>
  );
}
