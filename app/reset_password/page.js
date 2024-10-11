"use client"

import { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4567/request_password_reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setMessage(data.message || data.error);
  };

  return (
    <div>
      <h1 className='text-center'>Reset Password</h1>
      <form onSubmit={handleSubmit} className='text-center mt-5'>
        <label class="form-label">Email:</label>
        <input type="email" value={email} className="form-control input-style" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} required/>
        <Button className='mt-4 btn' type="submit">Request Password Reset</Button>
      </form>
      {message && <p className='text-center mt-3 text-danger'>{message}</p>}
    </div>
  );
}