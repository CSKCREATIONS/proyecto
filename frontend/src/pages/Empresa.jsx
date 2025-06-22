import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo2 from '../components/EncabezadoModulo2'
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import NavAgendar from '../components/NavAgendar';


export default function AgendarVenta() {
  // Coloca useNavigate directamente dentro del componente
  const navigate = useNavigate();

  // Agendar venta
  const handleAgendado = () => {
    Swal.fire({
      title: 'Venta agendada',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
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
          <EncabezadoModulo2
            titulo='Agendar pedido'
          />
          <NavAgendar/>

          <div className="contenido-modulo">
          <div className="container-tabla">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Razon social</th>
                    <th>Ciudad</th>
                    <th>Telefono</th>
                    <th>Correo</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Fecha entrega</th>
                    <th>Observacion</th>
                  </tr>
                </thead>
                <tbody> 
                  <tr >
                    <td><input type='text' className='cuadroTexto' autoFocus/></td>
                    <td><input className='cuadroTexto'/></td>
                    <td><input className='cuadroTexto'/></td>
                    <td><input className='cuadroTexto'/></td>
                    <td><input className='cuadroTexto'/></td>
                    <td><input className='cuadroTexto'/></td>
                    <td><input className='cuadroTexto'/></td>
                    <td ><input className='cuadroTexto'/></td>



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
    </div>
  )
}
