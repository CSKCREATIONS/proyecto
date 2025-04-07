import React from "react";
import Fijo from "../components/Fijo";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';


export default function Proceso() {
  const handleClick = () => 
      Swal.fire({
      text: 'El Proceso ha sido añadido correctamente',
      icon: 'success',
      showCancelButton: false,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    });

  return (
    <div>
      <Fijo />
      <div className="content">

        <div className="form-container">
          <h2 className="title">Añadir Proceso</h2>

          <form className="form">
            <label className="label">Código</label>
            <input type="text" className= "textDOCS" />
            
            <br />
            <label className="label">Nombre</label>
            <input
              type="text"
              className= "textDOCS"              
            />

            <label className="label">Responsable</label>
            <textarea
              className="textarea-box"
              
            ></textarea>

            {/* Botones */}
              <Link to={`/Proceso`} onClick={handleClick}>
                <button className="btn">Adicionar</button>
                </Link>
               <Link to={`/Proceso`}>
                <button style={{ marginLeft: "1rem" }} className="btn">Cancelar</button>
              </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
