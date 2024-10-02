"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [date_of_birth, setBirthday] = useState('');
    const router = useRouter();

    const handleRegister = (e) => {
        e.preventDefault();
        // console.log per verificare il corretto recupero dei dati
        console.log(username, email, password, name, surname, date_of_birth);
    }
    return(
        <div className="container">
            <h1 className="text-center">Register</h1>
            <form className="d-flex flex-column" onSubmit={handleRegister}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required className="form-control p-2 mb-3 mt-3"></input>
                <input value={username} onChange={(e) => setUsername(e.target.value)}  type="text" placeholder="Username" required className="form-control p-2 mb-3"></input>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required className="form-control p-2 mb-3"></input>
                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" required className="form-control p-2 mb-3"></input>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" required className="form-control p-2 mb-3"></input>
                <input value={surname} onChange={(e) => setSurname(e.target.value)} type="text" placeholder="Surname" required className="form-control p-2 mb-3"></input>
                <input value={date_of_birth} onChange={(e) => setBirthday(e.target.value)} type="date" placeholder="Date Of Birth" required className="form-control p-2 mb-3"></input>
                <button type="submit">Registrati</button>
            </form>
            <p className="text-center mt-4">Sei già registrato? <Link href="/login">Accedi</Link></p>
        </div>
    )
}