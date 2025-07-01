import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { login } from '../js/auth';
import '../App.css';

const MySwal = withReactContent(Swal);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/Home';
    }

    // Prevención del historial al usar "Atrás"
    window.onpageshow = function (event) {
      if (event.persisted || window.performance?.navigation?.type === 2) {
        if (!localStorage.getItem('token')) {
          window.location.href = '/Home';
        }
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { success, result, error } = await login(email, password);

    if (success) {
      if (rememberMe) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.user._id);
        localStorage.setItem('userRole', result.user.role);
      }

      MySwal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: `Hola, ${result.user.username}`,
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => {
        window.location.href = '/Home';
      }, 2000);
    } else {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: result?.message || error || 'Error desconocido'
      });
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="login-logo" />
        </div>

        <h2 className="login-title">Iniciar Sesión</h2>

        <div className="form-group">
          <label>Usuario:</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
