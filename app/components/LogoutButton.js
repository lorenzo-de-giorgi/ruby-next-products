import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const LogoutButton = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      // Disconnetti l'utente
      await signOut({ redirect: false }); // Non reindirizzare automaticamente
      // Esegui eventuali azioni dopo il logout, come il reindirizzamento
      //router.push('/login'); // Reindirizza alla pagina di login (o alla home)
      alert('Logout effettuato con successo!');
    } catch (error) {
      alert('Errore durante il logout. Riprova.');
    }
  };

  return (
    <>
      {session && (
        <button onClick={handleLogout} className='btn btn-danger'>
          Esci
        </button>
      )}
    </>
  );
};

export default LogoutButton;