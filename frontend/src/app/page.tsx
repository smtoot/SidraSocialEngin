export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
          Sidra Content Factory
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a href="/operation-room" style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            🚀 غرفة العمليات
          </a>
          <a href="/admin/dashboard" style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#4b5563',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            ⚙️ لوحة التحكم
          </a>
        </div>
      </div>
    </div>
  );
}