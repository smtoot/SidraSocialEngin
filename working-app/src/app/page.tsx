import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#111827'
        }}>
          Sidra Content Factory
        </h1>
        <div style={{ marginTop: '2rem' }}>
          <Link 
            href="/operation-room"
            style={{ 
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#0070f3',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Operation Room
          </Link>
        </div>
      </div>
    </div>
  );
}