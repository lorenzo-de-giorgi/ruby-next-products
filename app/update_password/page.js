"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from 'react-bootstrap';

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
      <h1 className='text-center'>Update Password</h1>
      <form onSubmit={handleSubmit} className='text-center mt-5'>
        <label className="form-label">Nuova Password:</label>
        <input type="password" value={newPassword} className="form-control" onChange={(e) => setNewPassword(e.target.value)} required style={{ width: "350px", margin: "0 auto", display: "block" }}  />
        <Button className='mt-4 btn' type="submit">Aggiorna Password</Button>
      </form>
      {message && <p className='text-center mt-3 text-danger'>{message}</p>}
    </div>
  );
}
