import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo from '../components/EncabezadoModulo'
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';


export default function AgendarVenta() {
  // Coloca useNavigate directamente dentro del componente
  const navigate = useNavigate();

  // Agendar venta
  const handleAgendado = () => {
    Swal.fire({
      title: 'Venta agendada',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
    }).then(() => {
      // Una vez que se confirma la alerta, navegas a otra página
      navigate('/PedidosAgendados');
    });
  };

  return (
    <div>
      <Fijo />
      <div className="content">

        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo='Agendar pedido'
          />

          <div className="container-tabla">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Nombre completo</th>
                    <th>Rol</th>
                    <th>Correo</th>
                    <th>Username</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Creado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr >
                    <td><input></input></td>
                    <td><input></input></td>
                    <td><input></input></td>
                    <td><input></input></td>
                    <td><input></input></td>
                    <td><input></input></td>
                    <td><input></input></td>
                    <td ><input></input></td>



                  </tr>
                </tbody>
              </table>
            </div>
            <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={handleAgendado}
            >
              Agendar Venta
            </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  )
}
