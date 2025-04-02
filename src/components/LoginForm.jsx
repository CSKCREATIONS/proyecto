import React from 'react'
import { Link } from 'react-router-dom'

export default function LoginForm(props) {
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
            <label for="password">{props.label}</label>

          </div>
          <Link
              as={Link}
              to={props.confirm}
            ><button className='btn btn-secondary'>{props.accion}</button>
          </Link>
        </div>
        <div className="recuperar-contraseña">
          <p>{props.pregunta}</p>
          <Link
            as={Link}
            to={props.enlace}>
            {props.ruta}
          </Link>
        </div>
      </div>

    </div>
  )
}
