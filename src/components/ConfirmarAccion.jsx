import React from 'react'
import { closeModal } from '../funciones/animaciones'

export default function ConfirmarAccion(props) {
    return (
        <div class="modal" id={props.idItem}>
            <div class="modal-content">
                <h3>Alerta</h3>
                <p>{props.pregunta}</p>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onClick={() => closeModal('deleteUser')}>No</button>
                    <button class="btn btn-danger" >Sí, eliminar</button>
                </div>
            </div>
        </div>
    )
}
