// layout page
"use client";

import './globals.css';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import './lib/fontawesome';
import { SessionProvider, useSession } from 'next-auth/react';
import LogoutButton from './components/LogoutButton';
import DeleteAccountButton from './components/DeleteAccountButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export const logout = async () => {
  try {
    const response = await fetch('http://localhost:4567/logout', {
      method: 'POST',
      credentials: 'include', // Assicurati che le credenziali siano incluse
    });

    if (!response.ok) {
      throw new Error('Logout fallito');
    }

    const data = await response.json();
    return data; // Restituisce i dati di risposta se il logout è riuscito
  } catch (error) {
    console.error('Errore nel logout:', error);
    throw error; // Rilancia l'errore per la gestione successiva
  }
};


export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className='container'>
          <NavBar />
          <main>
            {children}
          </main>
        </body>
      </html>
    </SessionProvider>
  );
}

function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className='d-flex justify-content-end mt-3'>
      {session ? (
        <>
          <DropdownButton id="dropdown-basic-button" title={session.user.name} className='me-5 pe-3'>
            <Dropdown.Item href="#/action-1" className='text-center'><LogoutButton /></Dropdown.Item>
            <Dropdown.Item href="" className='text-center'><DeleteAccountButton /></Dropdown.Item>
          </DropdownButton>
        </>
      ) : (
        <>
          <Link href="/login" className='me-3 btn btn-dark'>Accedi</Link>
          <Link href="/register" className='btn btn-close-white'>Registrati</Link>
        </>
      )}
    </nav>
  );
}
