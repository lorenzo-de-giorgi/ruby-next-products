"use client"

import './globals.css';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RootLayout({ children }){
  return(
    <html>
      <body className='container'>
        <nav className='d-flex justify-content-end mt-3'>
          <Link href="/login" className='me-3 btn btn-dark'>Accedi</Link>
          <Link href="/register" className='btn btn-close-white'>Registrati</Link>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}