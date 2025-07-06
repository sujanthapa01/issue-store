'use client';
import React, { useState } from 'react';
import { handle_auth } from '@/utils/actions';

function Auth() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div>
      <button
        disabled={loading}
        className="px-4 py-3 border-2 border-black disabled:opacity-50"
        onClick={() => handle_auth({ setLoading, setError })}
      >
        {loading ? 'loading ...' : 'github'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default Auth;
