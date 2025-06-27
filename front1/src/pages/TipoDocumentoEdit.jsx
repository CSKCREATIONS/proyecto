import React from "react";
import Fijo from "../components/Fijo";
import NavDocumentacion from "../components/NavDocumentacion";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'


export default function TipoDocumentoEdit() {
  const handleClick = () => 
    Swal.fire({
    text: 'El Tipo de Documento ha sido editado correctamente',
    icon: 'success',
    showCancelButton: false,
    showCloseButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aceptar'
  })
  return (
    <div>
      <Fijo />
      <div className="content">
        <NavDocumentacion />

        <section className="edit-container">
          <fieldset className="edit-fieldset">
            <legend>Editar Tipo de Documento</legend>

            <label className="label">Nombre</label>
            <br />
               <input
                type="text"
                className="input-boxTD"
               />
          </fieldset>

          <Link to={`/TipoDocumento`} className="icons"  onClick={handleClick}>
          <button className="btn">Aceptar</button>
          </Link>

          <Link to={`/TipoDocumento`} className="icons">
          <button style={{ marginLeft: "1rem" }}className="btn">Cancelar</button>
          </Link>

        </section>
      </div>
    </div>
  );
}
