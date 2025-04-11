import React from 'react'
import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import EncabezadoModulo from '../components/EncabezadoModulo'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

export default function RegistrarCotizacion() {
  const navigate = useNavigate();
  //Agendar venta
  const handleCotizado = () => {
    Swal.fire({
      title: 'Cotización registrada',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#d33',
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
          <EncabezadoModulo titulo="Registrar cotizacion" />


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
                    <td>Natalia</td>
                    <td>Bogotá</td>
                    <td>3153234</td>
                    <td>Nataliamaria@gmail</td>
                    <td>
                      <select>
                        <option>Pasto</option>
                        <option>Grama</option>
                      </select>
                    </td>
                    <td>07/04/2027</td>
                    <td>N/A</td>
                  </tr>
                </tbody>
              </table>
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
