// pages/RecuperarContraseña.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function RecuperarContraseña() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const handleRecuperar = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/recover-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Revisa tu correo electrónico',
          confirmButtonColor: '#3085d6'
        });
        navigate('/');
      } else {
        setMensajeError(data.message || 'No se pudo recuperar la contraseña');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensajeError('Error en el servidor');
    }
  };

  return (
    <div className='container'>
      <h1 className="Titulo">Portal JLA Global Company</h1>

      <div className="container-form">
        <form className="login-container" onSubmit={handleRecuperar}>
          <p style={{color: "gray"}}>Escribe tu correo electrónico. Allí te será enviada una contraseña provisional</p>
          <br />
          <div className="input-container">
            <input
              type="email"
              id="email"
              required
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Correo electrónico</label>
          </div>

          {mensajeError && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{mensajeError}</p>}
            <button className='btn login-button' type="submit">
              Recuperar contraseña
            </button>
        </form>


        <div className="recuperar-contraseña">
          <p style={{ color: 'lightgray' }}>¿Recordaste tu contraseña?</p>
          <Link to="/" style={{ color: 'lightgray' }}>
            <u>Inicia sesión aquí</u>
          </Link>
        </div>
      </div>
    </div>
  );
}
