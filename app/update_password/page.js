"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function UpdatePassword() {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if(token){
            console.log('Token recuperato:', token);
        }
    }, [token]);

    useEffect(() => {
        if(token){
            console.log('Token recuperato:', token);
        }
    })


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure token is available before proceeding
        if (!token) {
        setMessage('Token is missing.');
        return;
        }

        const response = await fetch('http://localhost:4567/reset_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
        });

        const data = await response.json();
        setMessage(data.message || data.error);
  };

  return (
    <div>
      <h1>Update Password</h1>
      <form onSubmit={handleSubmit}>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Update Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
