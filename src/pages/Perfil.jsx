import React from 'react'
import Fijo from '../components/Fijo'
import { openModal } from '../funciones/animaciones'
import EditarUsuario from '../components/EditarUsuario'


console.log("kdcgwekcggery")
export default function Perfil() {
	return (
		<div>

			<Fijo />
			<div className="content">
				
				<div className='contenido-modulo'>
				<div className="header">
					<h1>Hamburguesa</h1>
					<button onClick={() => openModal('editUserModal')} style={{background:'transparent'}}>◀ Editar</button>
				</div>


					<div className="containerPerfil">

						<div className="user-info">
							<div className="info-item"><strong>No documento</strong><p>1034567829</p></div>
							<div className="info-item"><strong>Nombre completo</strong><p>El perez</p></div>
							<div className="info-item"><strong>No teléfono</strong><p>3034567829</p></div>
							<div className="info-item"><strong>Correo electrónico</strong><p>pepa@gmail.com</p></div>
							<div className="info-item"><strong>Nombre de usuario</strong><p>el pepe</p></div>
							<div className="info-item"><strong>Contraseña</strong><p>******</p></div>
							<div className="info-item"><strong>Rol</strong><p>Salchipapa</p></div>
							<button className="btn btn-secondary">Cerrar sesión</button>
						</div>
							
					</div>
				</div>


			</div>

			<EditarUsuario />
		</div>
	)
}
