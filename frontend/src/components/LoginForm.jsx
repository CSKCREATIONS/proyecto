import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginForm(props) {
  const navigate = useNavigate();

  // Estado para email y password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Previene recarga

    try {
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirigir a la pantalla principal
        navigate('/Home');
      } else {
        setMensajeError(data.message || 'Error al iniciar sesión');
      }

      

    } catch (error) {
      setMensajeError('Error en el servidor');
      console.error('Login error:', error);
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
                id="email"
                required
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="email">Usuario</label>
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
              <label htmlFor="password">{props.label}</label>
            </div>

            {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}

            <div className="buttons">
              <button className='btn btn-secondary' type="submit">
                {props.accion}
              </button>
            </div>
          </form>
        </div>

        <div className="recuperar-contraseña">
          <p style={{ color: 'lightgray' }}>{props.pregunta}</p>
          <Link to={props.enlace} style={{ color: 'lightgray' }}><u>{props.ruta}</u></Link>
        </div>
      </div>
    </div>
  );
}
