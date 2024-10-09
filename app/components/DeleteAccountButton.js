"use client"

import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const DeleteAccountButton = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleDeleteAccount = async () => {
    if(!session) return;

    try {
        await axios.delete(`http://localhost:4567/delete_user/${session.user.id}`, {
            withCredentials: true,
        });

        await signOut({ redirect: false });
        alert('Account cancellato con successo');
        router.push('/login');
    } catch (error) {
        console.error('Errore nella cancellazione dell\'account:', error);
      setErrorMessage('Errore durante la cancellazione dell\'account. Riprova.');
    }
  };

  return (
    <>
      {session && (
        <button onClick={handleDeleteAccount} className='btn btn-danger'>
          Cancella Account
        </button>
      )}
    </>
  );
};

export default DeleteAccountButton;