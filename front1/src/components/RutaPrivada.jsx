import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const RutaPrivada = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuth(!!token);
  }, []);

  if (auth === null) return null; // Mientras se verifica, no mostrar nada

  return auth ? children : <Navigate to="/login" />;
};

export default RutaPrivada;
