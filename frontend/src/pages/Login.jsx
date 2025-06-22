import React from 'react'
import LoginForm  from '../components/LoginForm'

export default function Login() {
  return (
    <div>
      <LoginForm 
      label = 'Contraseña'
      accion= 'Iniciar sesion'
      pregunta = '¿Has olvidado tu contraseña?'
      ruta = 'Recuperala aquí'
      enlace = '/RecuperarContraseña'
      />
      
    </div>
  )
}
