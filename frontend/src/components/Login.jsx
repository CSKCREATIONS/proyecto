import React from 'react'

export default function Login() {
  return (
    <div className='container'>

      <h1 className="Titulo">Portal JLA Global Company</h1>
      <div className="container-form">
        <div className="login-container">
          <div className="input-container">
            <input type="email" id="email" required placeholder=" " />
            <label for="email">Usuario</label>
          </div>
          <div className="input-container">
            <input type="password" id="password" required placeholder=" " />
            <label for="password">Contraseña</label>
          </div>
          <button className='btn-inicio'>Iniciar Sesion</button>
        </div>
        <div className="recuperar-contraseña">
          <p>¿Has olvidado tu contraseña?</p>
          <a href="#">Recuperala aquí</a>
        </div>
      </div>

    </div>
  )
}
