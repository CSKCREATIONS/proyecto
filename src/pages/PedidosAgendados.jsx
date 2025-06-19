import React from "react";
import Fijo from "../components/Fijo";
import NavVentas from "../components/NavVentas";
import EncabezadoModulo from "../components/EncabezadoModulo";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaExclamationTriangle } from "react-icons/fa";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { openModal } from '../funciones/animaciones'
import EditarPedido from "../components/EditarPedido";



/****Funcion para exportar a pdf*** */

const exportarPDF = () => {
  const input = document.getElementById('tabla_pedidos_agendados');
  const originalWidth = input.style.width; // Guardar ancho original

  // Forzar un ancho fijo (ej: 100% del contenedor o un valor en px)
  input.style.width = '100%';

  html2canvas(input, {
    scale: 1, // Evita zoom automático
    width: input.offsetWidth, // Usa el ancho forzado
    windowWidth: input.scrollWidth // Captura el ancho completo
  }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Ajustar imagen al ancho del PDF (190mm es el ancho útil de A4)
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save('pedidosAgendados.pdf');

    // Restaurar el ancho original
    input.style.width = originalWidth;
  });
};



// Funcion exportar a Excel


const exportToExcel = () => {
  const table = document.getElementById('tabla_pedidos_agendados');
  if (!table) return;

  // Ocultar elementos no exportables
  const elementosNoExport = table.querySelectorAll('.no-export');
  elementosNoExport.forEach(el => el.style.display = 'none');

  // Convertir tabla a hoja de cálculo
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Pedidos" });
  
  // Ajustar anchos de columna (ejemplo: 20 unidades por columna)
  workbook.Sheets["Pedidos"]["!cols"] = Array(10).fill({ width: 20 });

  // Generar y descargar archivo
  XLSX.writeFile(workbook, 'pedidosAgendados.xlsx');

  // Restaurar elementos
  elementosNoExport.forEach(el => el.style.display = '');
};





export default function PedidosAgendados() {
  const navigate = useNavigate();
  //cancelar pedido
  const handleCancelarPedido = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este pedido se cancelará y no podrás revertirlo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        // texto despues del si
        Swal.fire('Cancelado', 'El pedido ha sido cancelado.', 'success');
        navigate('/PedidosCancelados')
      }
    });
  };


  //pedido confirmado
  const handleConfirmarPedido = () => {
    Swal.fire({
      title: 'Marcar como cumplido',
      text: '¿Se ha cumplido con el pedido 011021',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        // texto despues del si
        Swal.fire('Listo', 'Se ha marcado como cumplido.', 'success');
        navigate('/PedidosEntregados')
      }
    });
  };

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo titulo="Pedidos Agendados"
            exportarPDF={exportarPDF}
            exportToExcel={exportToExcel}
            buscar = 'Buscar pedido'
            />
            
          {/* Tabla */}
          <div className="container-tabla">
            <div className="table-container" >
              <table id="tabla_pedidos_agendados">
                <thead><br/>
                  <tr>
                    <th style={{ textAlign: 'center' }} colSpan="5">Pedido</th>
                    <th style={{ textAlign: 'center' }} colSpan="4">Cliente</th>
                  </tr>
                  <tr>
                    <th>No</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>F. Agendamiento</th>
                    <th>F. Entrega</th>
                    <th>Nombre / Razón Social</th>
                    <th>Ciudad</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Pasto</td>
                    <td>5</td>
                    <td>10/04/2025</td>
                    <td>15/04/2025</td>
                    <td>Natalia</td>
                    <td>Bogotá</td>
                    <td>3153234</td>
                    <td>Nataliamaria@gmail</td>
                    <td>N/A</td>
                    <div className="no-export" style={{ display: 'flex', gap: '0.3rem' }}>
                      <button className='btnTransparente' style={{ height: '35px', width: '50px' }} onClick={() => openModal('editarPedidoModal')}>
                        <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                      </button>

                      <button className="btnTransparente" style={{ height: '35px', width: '50px' }} onClick={handleCancelarPedido}>
                        <i className="fa-solid fa-cancel fa-xl" style={{ color: 'red' }}></i>
                      </button>
                      <button className='btnTransparente' style={{ height: '35px', width: '50px' }} onClick={handleConfirmarPedido}
                      >
                        <i className="fa-solid fa-check fa-xl" style={{ color: 'green' }}></i>
                      </button>
                    </div>


                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Pasto</td>
                    <td>5</td>
                    <td>10/04/2025</td>
                    <td>15/04/2025</td>
                    <td>Natalia</td>
                    <td>Bogotá</td>
                    <td>3153234</td>
                    <td>Nataliamaria@gmail</td>
                    <td>N/A</td>
                    <div className="no-export" style={{ display: 'flex', gap: '0.3rem' }}>
                      <button className='btnTransparente' style={{ height: '35px', width: '50px' }} onClick={() => openModal('editarPedidoModal')}>
                        <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                      </button>

                      <button className="btnTransparente" style={{ height: '35px', width: '50px' }} onClick={handleCancelarPedido}>
                        <i className="fa-solid fa-cancel fa-xl" style={{ color: 'red' }}></i>
                      </button>
                      <button className='btnTransparente' style={{ height: '35px', width: '50px' }} onClick={handleConfirmarPedido}
                      >
                        <i className="fa-solid fa-check fa-xl" style={{ color: 'green' }}></i>
                      </button>
                    </div>


                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Pasto</td>
                    <td>5</td>
                    <td>10/04/2025</td>
                    <td>15/04/2025</td>
                    <td>Natalia</td>
                    <td>Bogotá</td>
                    <td>3153234</td>
                    <td>Nataliamaria@gmail</td>
                    <td>N/A</td>
                    <div className="no-export" style={{ display: 'flex', gap: '0.3rem' }}>
                      <button className='btnTransparente' style={{ height: '35px', width: '50px' }} onClick={() => openModal('editarPedidoModal')}>
                        <i className="fa-solid fa-pen fa-xl" style={{ color: 'orange' }}></i>
                      </button>

                      <button className="btnTransparente" style={{ height: '35px', width: '50px' }} onClick={handleCancelarPedido}>
                        <i className="fa-solid fa-cancel fa-xl" style={{ color: 'red' }}></i>
                      </button>
                      <button className='btnTransparente' style={{ height: '35px', width: '50px' }} onClick={handleConfirmarPedido}
                      >
                        <i className="fa-solid fa-check fa-xl" style={{ color: 'green' }}></i>
                      </button>
                    </div>


                  </tr>
                </tbody>
              </table>
              <EditarPedido />

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}