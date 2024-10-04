"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [date_of_birth, setBirthday] = useState('');
    const router = useRouter();
    const today = new Date().toISOString().split('T')[0];

    const handleRegister = async (e) => {
        e.preventDefault();
        // console.log per verificare il corretto recupero dei dati
        // console.log(username, email, password, name, surname, date_of_birth);

        if (!password) {
            return res.status(400).json({ error: "La password è obbligatoria." });
        }

        if (password.length < 8) {
            return alert("La password deve essere di lunghezza maggiore di 8 caratteri.");
        }

        const hasUpperCase = /[A-Z]/.test(password);
        if (!hasUpperCase) {
          return alert("La password deve contenere almeno una lettera maiuscola.");
        }

        const hasSpecialChar = /[\W_]/.test(password); // `\W` è usato per i caratteri non alfanumerici
        if (!hasSpecialChar) {
          return alert("La password deve avere almeno un carattere speciale.");
        }

        if(password !== confirmPassword){
            alert('Le password non corrispondono!');
            return;
        }

        const formData = {
            username,
            email,
            password,
            name,
            surname,
            date_of_birth
        }

        try {
            const response = await axios.post('http://localhost:4567/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if(response.status === 200){
                alert('Registrazione avvenuta con successo!');
                router.push('/login');
            } else {
                alert(`Registration failed: ${response.data.message}`);
            }
        } catch (error) {
            console.error('An error occurred during registration:', error);
            if (error.response) {
                // Il server ha restituito una risposta con un codice di stato diverso da 2xx
                alert(`Registration failed: ${error.response.data.message}`);
            } else {
                // Errore nella richiesta
                alert('An error occurred during registration. Please try again later.');
            }
        }
    }
    return(
        <div className="container">
            <h1 className="text-center">Register</h1>
            <form className="d-flex flex-column" onSubmit={handleRegister}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required className="form-control p-2 mb-3 mt-3"></input>
                <input value={username} onChange={(e) => setUsername(e.target.value)}  type="text" placeholder="Username" required className="form-control p-2 mb-3" minLength={2}></input>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required className="form-control p-2 mb-3" minLength={8}></input>
                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" required className="form-control p-2 mb-3" minLength={8}></input>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" required className="form-control p-2 mb-3" minLength={3}></input>
                <input value={surname} onChange={(e) => setSurname(e.target.value)} type="text" placeholder="Surname" required className="form-control p-2 mb-3" minLength={3}></input>
                <input value={date_of_birth} onChange={(e) => setBirthday(e.target.value)} type="date" placeholder="Date Of Birth" required className="form-control p-2 mb-3" max={today}></input>
                <button type="submit">Registrati</button>
            </form>
            <p className="text-center mt-4">Sei già registrato? <Link href="/login">Accedi</Link></p>
        </div>
    )
}