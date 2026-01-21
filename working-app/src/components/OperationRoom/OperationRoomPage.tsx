import React from 'react';
import Link from 'next/link';

export default function OperationRoomPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Operation Room</h1>
      <p style={{ marginTop: '20px' }}>
        <Link 
          href="/"
          style={{ 
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#6b7280',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          Back to Home
        </Link>
      </p>
    </div>
  );
}