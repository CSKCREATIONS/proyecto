// pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
  
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.mustChangePassword) {
          navigate('/cambiar-contrasena');
        } else {
          navigate('/Home');
        }
      } else {
        setMensajeError(data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMensajeError('Error en el servidor');
    }
  };

  return (
    <div className='container'>
      <h1 className="Titulo">Portal JLA Global Company</h1>

      <div className="container-form">
        <div className="login-container">
          <form onSubmit={handleLogin}>
            <div className="input-container">
              <input
                type="text"
                id="username"
                required
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="username">Usuario</label>
            </div>

            <div className="input-container">
              <input
                type="password"
                id="password"
                required
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Contraseña</label>
            </div>

            {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}

            <div className="buttons">
              <button className='btn btn-secondary' type="submit">
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>

        <div className="recuperar-contraseña">
          <p style={{ color: 'lightgray' }}>¿Has olvidado tu contraseña?</p>
          <Link to="/RecuperarContraseña" style={{ color: 'lightgray' }}>
            <u>Recupérala aquí</u>
          </Link>
        </div>
      </div>
    </div>
  );
}
