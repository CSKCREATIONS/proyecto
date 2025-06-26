import { toggleSubMenu } from '../funciones/animaciones'
import Swal from 'sweetalert2'
import { closeModal } from '../funciones/animaciones'
import { Link } from 'react-router-dom'

export default function EditarPerfil() {
    const handleClick = () =>
        Swal.fire({
            text: 'Perfil actualizado',
            icon: 'success',
            showCancelButton: false,
            showCloseButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
        });

    return (
        <div className="modal" id='editar-perfil'>
            <div className="form-group">
                <label>Primer nombre</label>
                <input className='entrada' type="text" required />
            </div>
            <div className="form-group">
                <label>Segundo nombre</label>
                <input className='entrada' type="text" />
            </div>
            <div className="form-group">
                <label>Primer apellido</label>
                <input className='entrada' type="text" required />
            </div>
            <div className="form-group">
                <label>Segundo apellido</label>
                <input className='entrada' type="text" />
            </div>
            <div className="form-group">
                <label>Rol</label>
                <select className='entrada' name="" id="" disabled>
                </select>
            </div>
            <div className="form-group">
                <label>Correo</label>
                <input className='entrada' type="email" required />
            </div>
            <div className="form-group">
                <label>Nombre de usuario</label>
                <input className='entrada' type="text" />
            </div>
            <div className="buttons">
                <button className='btn btn-secondary' onClick={() => toggleSubMenu('changePassword')}>Cambiar contraseña</button>
            </div>
            <div className='dropdown' id='changePassword' style={{ border: '1px solid #ccc', padding: '0.5rem', marginTop: '1rem' }}>
                <div className="form-group"><label>Nueva contraseña</label><input className='entrada' type="password" /></div>
                <div className="form-group"><label>Confirmar contraseña</label><input className='entrada' type="password" /></div>
            </div>
            <div className="buttons">
                <button className="btn btn-secondary" onClick={() => closeModal('editar-perfil')}>Cancelar</button>
                <Link onClick={handleClick} to='/Perfil'><button onClick={() => closeModal('editar-perfil')} className="btn btn-primary" >Guardar Cambios</button> </Link>
            </div>

        </div>
    )
}