"use client"

import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [date_of_birth, setBirthday] = useState('');
    const today = new Date().toISOString().split('T')[0];

    const handleRegister = async (e) => {
        e.preventDefault();
    
        if (!password) {
            alert("La password è obbligatoria.");
            return;
        }
    
        if (password.length < 8) {
            alert("La password deve essere di lunghezza maggiore di 8 caratteri.");
            return;
        }
    
        const hasUpperCase = /[A-Z]/.test(password);
        if (!hasUpperCase) {
            alert("La password deve contenere almeno una lettera maiuscola.");
            return;
        }
    
        const hasSpecialChar = /[\W_]/.test(password);
        if (!hasSpecialChar) {
            alert("La password deve avere almeno un carattere speciale.");
            return;
        }
    
        if (password !== confirmPassword) {
            alert('Le password non corrispondono!');
            return;
        }
    
        const formData = {
            username,
            email,
            password,
            name,
            surname,
            date_of_birth,
        };
    
        try {
            const response = await axios.post('http://localhost:4567/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            console.log('Response Status:', response.status);
            if (response.status === 201) {
                alert('Registrazione avvenuta con successo!');
                console.log("Navigating to /login");
                window.location.href = '/login';
            } else {
                alert(`Registration failed: ${response.data.message}`);
            }
        } catch (error) {
            console.error('An error occurred during registration:', error);
            if (error.response) {
                alert(`Registration failed: ${error.response.data.message}`);
            } else {
                alert('An error occurred during registration. Please try again later.');
            }
        }
    };
    
    return(
        <div className="container">
            <h1 className="text-center mb-3">Register</h1>
            <form className="d-flex flex-column" onSubmit={handleRegister}>

                <div className="row mb-3">
                    <div className="col">
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required className="form-control p-2"/>
                    </div>
                    <div className="col">
                        <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" required className="form-control p-2" minLength={2}/>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required className="form-control p-2" minLength={8}/>
                    </div>
                    <div className="col">
                        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" required className="form-control p-2" minLength={8}/>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" required className="form-control p-2" minLength={3}/>
                    </div>
                    <div className="col">
                        <input value={surname} onChange={(e) => setSurname(e.target.value)} type="text" placeholder="Surname" required className="form-control p-2" minLength={3}/>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <input value={date_of_birth} onChange={(e) => setBirthday(e.target.value)} type="date" placeholder="Date Of Birth" required className="form-control p-2" max={today}/>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">Registrati</button>
            </form>
            <p className="text-center mt-4">Sei già registrato? <Link href="/login">Accedi</Link></p>
        </div>
    )
}