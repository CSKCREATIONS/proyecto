import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginForm(props) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const usuariosValidos = {
    admin: 'admin123',
    usuario1: 'clave1',
    usuario2: 'clave2'
  };

  const handleLogin = () => {
    // Validar usuario y contraseña
    if (usuariosValidos[usuario] && usuariosValidos[usuario] === password) {
      localStorage.setItem('usuario', usuario); // Opcional, para control en otras rutas

      // Redirección según el usuario
      if (usuario === 'admin') {
        navigate('/Home');
      }
      else if (usuario === 'usuario1') {
        navigate('/home1');
      }
      else if (usuario === 'usuario2') {
        navigate('/home2');
      }
      else {
        setError('Usuario o contraseña incorrectos');
      }
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };
 

  // En el login, cuando el usuario1 se loguea
    localStorage.setItem('usuario', 'usuario1');
    localStorage.setItem('modulo', 'SIG');
  // En el login, cuando el usuario2 se loguea
    localStorage.setItem('usuario', 'usuario2');
    localStorage.setItem('modulo', 'ventas');
  // En el login, cuando el admin se loguea
    localStorage.setItem('usuario', 'admin');
    localStorage.setItem('modulo', 'admin');



  return (
    <div className='container'>
      <h1 className="Titulo">Portal JLA Global Company</h1>

      <div className="container-form">
        <div className="login-container">
          <div className="input-container">
            <input
              type="email"
              id="email"
              required
              placeholder=" "
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
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

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button className='btn btn-secondary' onClick={handleLogin}>
            {props.accion}
          </button>
        </div>

        <div className="recuperar-contraseña">
          <p>{props.pregunta}</p>
          <Link to={props.enlace}>{props.ruta}</Link>
        </div>
      </div>
    </div>
  );
}
