"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 65px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f4f2',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          backgroundColor: '#111111',
          color: '#f5c842',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '16px',
        }}
      >
        Error
      </div>
      <h1
        style={{
          fontSize: '40px',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '-2px',
          color: '#111111',
          margin: '0 0 12px 0',
        }}
      >
        Ada yang <span style={{ color: '#f5c842' }}>Salah</span>
      </h1>
      <p style={{ fontSize: '13px', color: '#4a4a4a', marginBottom: '28px' }}>
        {error?.message || 'Terjadi kesalahan yang tidak terduga.'}
      </p>
      <button
        onClick={reset}
        style={{
          backgroundColor: '#111111',
          color: '#ffffff',
          padding: '12px 24px',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Coba Lagi
      </button>
    </div>
  );
}
