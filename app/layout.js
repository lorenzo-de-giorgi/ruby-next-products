"use client";

import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './lib/fontawesome';
import { SessionProvider } from 'next-auth/react';
import NavBar from './components/NavBar.js';  // Assumi che NavBar sia stato spostato in un file separato
import Footer from './components/Footer.js';  // Assumi che Footer sia stato spostato in un file separato

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Gestione Negozio</title>
        </head>
        <body className='container'>
          <NavBar />
          <main>
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </SessionProvider>
  );
}