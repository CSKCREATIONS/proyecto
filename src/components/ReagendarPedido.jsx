import React from 'react'
import { closeModal } from '../funciones/animaciones'
import Swal from 'sweetalert2';


export default function EditarUsuario() {
    const handleClick = () => {
            Swal.fire({
              text: 'Pedido Regendado correctamente',
              icon: 'success',
              showCancelButton: false,
              showCloseButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              closeModal('editUserModal'); // cerrar después de aceptar
            });
          };
    return (

        <div className="modal" id="editUserModal">
            <div className="modal-content">
                <div className="form-group">
                    <label>Fecha de Entrega</label>
                    <input type="date" required />
                </div>
                <div className="form-group">
                    <label>Producto</label>
                    <select name="" id="" >
                        <option value="">Grama sintetica</option>
                        <option value="">Cilindros de oxigeno</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Cantidad</label>
                    <input className='number' style={{marginLeft:"1rem",width:"100px"} } cols="40"type="number" />
                </div>
                <div className="form-group">
                    <label>Observacion</label>
                    <textarea style={{marginLeft:"1rem"}} className='textarea'  cols="40"></textarea>
                </div>
                
                <div className="buttons">
                    <button className="btn btn-secondary" onClick={() => closeModal('editUserModal')}>Cancelar</button>
                    <button className="btn btn-primary" onClick={handleClick}>Guardar Cambios</button>
                </div>

                



            </div>
        </div>
    )
}
