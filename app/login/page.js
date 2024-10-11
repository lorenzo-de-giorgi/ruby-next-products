"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { signIn } from 'next-auth/react';
import '../globals.css';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleLogin = async (e) => {
        e.preventDefault();

        // Utilizza signIn di next-auth per autenticare l'utente con il provider "credentials"
        const result = await signIn('credentials', {
            redirect: false, // Impedisce il redirect automatico
            username,
            password,
        });

        if (result?.error) {
            setNotification({ message: `Login fallito: ${result.error}`, type: 'error' });
        } else {
            setNotification({ message: 'Login avvenuto con successo!', type: 'success' });
            setTimeout(() => {
                window.location.href = '/products';
            }, 2000); // Redirect after 2 seconds
        }
    }

    return (
        <div className="container">
            <h1 className="text-center">Login</h1>
            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <form onSubmit={handleLogin} className="d-flex flex-column">
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" required className="form-control p-2 mb-3 mt-3 input-style"/>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required className="form-control p-2 input-style"/>
                <p className="text-center mt-4">Hai dimenticato la password? <Link href="/reset_password">Reimposta</Link></p>
                <Button type="submit" className="mt-3 input-style">Login</Button>
            </form>
            <p className="text-center mt-4">Non sei ancora registrato? <Link href="/register">Registrati</Link></p>
        </div>
    );
}
