
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
      confirmButtonColor: '#3085d6',
    }).then(() => {
      // Una vez que se confirma la alerta, navegas a otra página
      navigate('/PedidosAgendados');
    });
  };

  return (
    <div>

        <div className="container-tabla">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Primer nombre</th>
                  <th>Segundo nombre</th>
                  <th>Primer apellido</th>
                  <th>Segundo apellido</th>
                  <th>ciudad</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Fecha entrega</th>
                  <th>Observación</th>
                </tr>
              </thead>
              <tbody>
                <tr >
                  <td><input type='text' className='cuadroTexto' autoFocus /></td>
                  <td><input className='cuadroTexto' /></td>
                  <td><input className='cuadroTexto' /></td>
                  <td><input className='cuadroTexto' /></td>
                  <td><input className='cuadroTexto' /></td>
                  <td><input className='cuadroTexto' /></td>
                  <td><input className='cuadroTexto' /></td>
                  <td ><input className='cuadroTexto' /></td>
                  <td ><input className='cuadroTexto' /></td>
                  <td ><input className='cuadroTexto' /></td>
                  <td ><input className='cuadroTexto' /></td>



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

      
  )
}
