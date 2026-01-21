export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem' }}>
          Sidra Content Factory
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a 
            href="/operation-room"
            style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '2rem 3rem', 
              borderRadius: '0.5rem',
              fontSize: '1.125rem',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'block'
            }}
          >
            🚀 غرفة العمليات (Categories Workflow)
          </a>
          <a 
            href="/admin/dashboard"
            style={{ 
              backgroundColor: '#4b5563', 
              color: 'white', 
              padding: '2rem 3rem', 
              borderRadius: '0.5rem',
              fontSize: '1.125rem',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'block'
            }}
          >
            ⚙️ لوحة التحكم
          </a>
        </div>
      </div>
    </div>
  );
}