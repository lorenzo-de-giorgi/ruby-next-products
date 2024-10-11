"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Assumiamo l'uso di next-auth per la gestione delle sessioni

const ProfilePage = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    surname: '',
    date_of_birth: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Recupera i dati dell'utente dalla sessione
  useEffect(() => {
    const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:4567/user/${session.user.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.id}`, // Usando session.id come token di autenticazione
            },
          });

          if (!response.ok) {
            throw new Error('Errore nel recupero dei dati utente');
          }

          const userData = await response.json();
          console.log(userData)
          setFormData({
            username: userData.username || '',
            email: userData.email || '',
            name: userData.name || '',
            surname: userData.surname || '',
            date_of_birth: userData.date_of_birth || '',
            password: '', // La password rimane vuota per sicurezza
          });
        } catch (error) {
          console.error('Errore nel recupero dei dati utente:', error);
          setError('Impossibile recuperare i dati utente. Riprova più tardi.');
        } finally {
          
        }
    };

    fetchUserData();
  }, [session]);

  // Gestione dell'input del form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Gestione dell'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!session?.user?.id) {
      setError("Sessione utente non valida");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4567/update_profile/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'aggiornamento del profilo');
      }

      if(response.status == 200){
        window.location.href = '/products';
      }

      setSuccess(true);
    } catch (error) {
      console.error('Errore nella richiesta API:', error);
      setError('Errore durante l\'aggiornamento del profilo');
    }
  };

  if (!session) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className="container mt-5">
    <h2 className="text-2xl font-bold mb-5">Aggiorna il tuo profilo</h2>
  
  <form onSubmit={handleSubmit}>
    
    {/* Row per Nome utente e Email */}
    <div className="row mb-3">
      <div className="col-md-6">
        <label htmlFor="username" className="form-label">Nome utente</label>
        <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="form-control"/>
      </div>
      <div className="col-md-6">
        <label htmlFor="email" className="form-label">Email</label>
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="form-control"/>
      </div>
    </div>

    {/* Row per Nome e Cognome */}
    <div className="row mb-3">
      <div className="col-md-6">
        <label htmlFor="name" className="form-label">Nome</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="form-control"/>
      </div>
      <div className="col-md-6">
        <label htmlFor="surname" className="form-label">Cognome</label>
        <input type="text" name="surname" id="surname" value={formData.surname} onChange={handleChange} className="form-control"/>
      </div>
    </div>

    {/* Row per Data di nascita */}
    <div className="row mb-3">
      <div className="col-md-6">
        <label htmlFor="date_of_birth" className="form-label">Data di nascita</label>
        <input type="date" name="date_of_birth" id="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="form-control"/>
      </div>
    </div>

    {/* Row per Password */}
    <div className="row mb-3">
      <div className="col-md-12">
        <label htmlFor="password" className="form-label">Ripeti la tua password per confermare le modifiche</label>
        <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="form-control"/>
      </div>
    </div>

    <button type="submit" className="btn btn-primary w-100">Aggiorna profilo</button>
  </form>
</div>

  );
};

export default ProfilePage;