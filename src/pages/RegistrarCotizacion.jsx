import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo2 from '../components/EncabezadoModulo2'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

export default function RegistrarCotizacion() {
  const navigate = useNavigate();
  //Agendar venta
  const handleCotizado = () => {
    Swal.fire({
      title: 'Cotización registrada',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
    }).then(() => {
      // Una vez que se confirma la alerta, navegas a otra página
      navigate('/ListaDeCotizaciones');
    });
  };

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo2 
          titulo="Registrar cotizacion"
          />

        <div className="contenido-modulo">
        <div className="container-tabla">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre / Razón Social</th>
                    <th>Ciudad</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Producto</th>
                    <th>Fecha</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="text" className='cuadroTexto' /></td>
                    <td><input type="text" className='cuadroTexto' /></td>
                    <td><input type="text" className='cuadroTexto' /></td>
                    <td><input type="text" className='cuadroTexto' /></td>
                    <td>
                      <select className='cuadroTexto'>
                        <option >Seleccione</option>
                        <option>Cilindro</option>
                        <option>Grama</option>
                      </select>
                    </td>
                    <td><input type="text" className='cuadroTexto' /></td>
                    <td><input type="text" className='cuadroTexto' /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
          
          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={handleCotizado}
            >
              Registrar Cotización
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
