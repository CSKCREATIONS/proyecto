import React from 'react'
import LoginForm from '../components/LoginForm'

export default function RecuperarContraseña() {
  return (
    <div>
      <LoginForm
      label = 'Correo electrónico'
      accion = 'Recuperar contraseña'
      pregunta = '¿Recordaste tu contraseña?'
      ruta = 'Inicia sesión aquí'
      enlace = '/'
      />
      
    </div>
  )
}
