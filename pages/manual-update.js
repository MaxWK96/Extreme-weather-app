import { useState } from 'react';
import Link from 'next/link';

export default function ManualUpdate() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setResult('Fetching...');

    try {
      const response = await fetch('/api/update-weather', {
        method: 'POST',
        headers: {
          'x-cron-secret': 'mysecret12345',
        },
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'monospace',
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
      }}
    >
      <h1>Manual Weather Update</h1>
      <button
        onClick={fetchData}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          backgroundColor: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
        }}
      >
        {loading ? 'Fetching...' : 'Fetch Weather Data'}
      </button>

      <pre
        style={{
          background: '#1a1a1a',
          padding: '20px',
          marginTop: '20px',
          overflow: 'auto',
          borderRadius: '8px',
          border: '1px solid #333',
        }}
      >
        {result || 'Click button to fetch data'}
      </pre>

      <Link href="/">
        <a style={{ display: 'block', marginTop: '20px', color: '#6366f1' }}>
          &larr; Back to main app
        </a>
      </Link>
    </div>
  );
}
