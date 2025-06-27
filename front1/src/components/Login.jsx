import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();

      if (res.ok) {
        // Guardar token y datos en localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.user._id);
        localStorage.setItem('userRole', result.user.role);

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `Hola, ${result.user.username}`,
          timer: 2000,
          showConfirmButton: false
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || 'Credenciales inválidas'
        });
      }
    } catch (error) {
      console.error('[LOGIN ERROR]', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo conectar con el servidor'
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ minWidth: 300, maxWidth: 400, width: '100%' }}>
        <h3 className="text-center mb-3">Iniciar Sesión</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
