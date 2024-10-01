"use client"

import './globals.css';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default function RootLayout({ children }){
  const testLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4567/login');
      console.log(response.data);
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  }

  const testRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4567/register');
      console.log(response.data);
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  }
  
  return(
    <html>
      <body className='container'>
        <nav className='d-flex justify-content-end mt-3'>
          <Link onClick={testLogin} href="/login" className='me-3 btn btn-dark'>Accedi</Link>
          <Link onClick={testRegister} href="/register" className='btn btn-close-white'>Registrati</Link>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}