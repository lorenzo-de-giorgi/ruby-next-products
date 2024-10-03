import pool from '@/app/lib/db';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log("Credenziali ricevute:", credentials);

        // Controlla che le credenziali siano definite
        if (!credentials || !credentials.username || !credentials.password) {
          console.error("Credenziali mancanti durante l'autenticazione");
          throw new Error('Username e password sono richiesti');
        }

        let client;
        try {
          // Connetti al database
          client = await pool.connect();
          const res = await client.query(
            'SELECT * FROM users WHERE username = $1',
            [credentials.username]
          );

          const user = res.rows[0];
          console.log("Utente trovato nel database:", user);

          // Verifica se l'utente è stato trovato
          if (!user) {
            console.error(`Utente non trovato con username: ${credentials.username}`);
            throw new Error('Nessun utente trovato con l\'username fornito');
          }

          // Usa il campo corretto per la password
          const isValid = await compare(credentials.password, user.password_hash);
          console.log("Risultato verifica password:", isValid);

          if (!isValid) {
            console.error("Password errata per l'utente:", credentials.username);
            throw new Error('Password errata');
          }

          // Restituisci i dati dell'utente se la verifica della password è valida
          return { id: user.id, name: user.name, username: user.username };
        } catch (error) {
          console.error("Errore durante l'autenticazione:", error.message);
          throw new Error('Errore durante l\'autenticazione: ' + error.message);
        } finally {
          if (client) {
            client.release();
          }
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login', // Pagina di accesso personalizzata
    error: '/auth/error' // Pagina di errore personalizzata per gestire errori
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
