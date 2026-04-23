"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body style={{ margin: 0, backgroundColor: '#f4f4f2', fontFamily: 'sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
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
              fontSize: '48px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-2px',
              color: '#111111',
              margin: '0 0 12px 0',
            }}
          >
            Ada yang <span style={{ color: '#f5c842' }}>Salah</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '32px' }}>
            Terjadi kesalahan yang tidak terduga.
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: '#111111',
              color: '#ffffff',
              padding: '14px 28px',
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
      </body>
    </html>
  );
}
