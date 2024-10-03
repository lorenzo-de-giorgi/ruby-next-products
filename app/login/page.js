"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Button } from "react-bootstrap";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        // console.log(username, password);
        const formData = {
            username,
            password
        }

        try{
            const response = await axios.post('http://localhost:4567/login', formData, {
              headers: {
                'Content-Type': 'application/json',
              }
            })
      
            if (response.status === 200) {
              alert('Registration successful!');
              // Redirigi alla pagina di login
              router.push('/login');
            } else {
              alert(`Login avvenuto con successo`);
            }
            
          } catch(error) {
            if (error.response) {
              // Il server ha restituito una risposta con un codice di stato diverso da 2xx
              alert(`Login fallito: ${error.response.data.message}`);
            } else {
              // Errore nella richiesta
              alert('An error occurred during login. Please try again later.');
            }
          }
    }
    return(
        <div className="container">
            <h1 className="text-center">Login</h1>
            <form onSubmit={handleLogin} className="d-flex flex-column">
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" required className="form-control p-2 mb-3 mt-3"></input>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required className="form-control p-2"></input>
                <Button type="submit" className="mt-3">Login</Button>
            </form>
            <p className="text-center mt-4">Non sei ancora registrato? <Link href="/register">Registrati</Link></p>
        </div>
    )
}