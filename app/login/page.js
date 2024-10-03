"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Utilizza signIn di next-auth per autenticare l'utente con il provider "credentials"
        const result = await signIn('credentials', {
            redirect: false, // Impedisce il redirect automatico
            username,
            password,
        });

        if (result?.error) {
            alert(`Login fallito: ${result.error}`);
        } else {
            router.push('/products')
            alert('Login avvenuto con successo!');
        }
    }

    return (
        <div className="container">
            <h1 className="text-center">Login</h1>
            <form onSubmit={handleLogin} className="d-flex flex-column">
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" required className="form-control p-2 mb-3 mt-3"/>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required className="form-control p-2"/>
                <Button type="submit" className="mt-3">Login</Button>
            </form>
            <p className="text-center mt-4">Non sei ancora registrato? <Link href="/register">Registrati</Link></p>
        </div>
    );
}
