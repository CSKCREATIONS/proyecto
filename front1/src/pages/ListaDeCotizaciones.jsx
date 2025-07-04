import React, { useState, useEffect } from 'react';
import Fijo from '../components/Fijo';
import NavVentas from '../components/NavVentas';
import EncabezadoModulo from '../components/EncabezadoModulo';
import { openModal } from '../funciones/animaciones';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';





const exportarPDF = () => {
  const input = document.getElementById('tabla_cotizaciones');
  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('listaCotizaciones.pdf');
  });
};



const exportToExcel = () => {
  const table = document.getElementById('tabla_cotizaciones');
  if (!table) return;
  const workbook = XLSX.utils.table_to_book(table);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'listaCotizaciones.xlsx');
};

export default function ListaDeCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem('token');

  if (!token) {
    Swal.fire('Error', 'Sesión expirada. Vuelve a iniciar sesión.', 'warning');
    return;
  }

  fetch('http://localhost:3000/api/cotizaciones', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Fallo en autenticación');
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        setCotizaciones(data);
      } else {
        console.error('Formato de datos inesperado:', data);
      }
    })
    .catch(err => {
      console.error('Error al cargar cotizaciones:', err);
      Swal.fire('Error', 'No se pudieron cargar las cotizaciones.', 'error');
    });
}, []);


  const handleEliminarCotizacion = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta Cotización se cancelará y no podrás revertirlo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/api/cotizaciones/${id}`, {
          method: 'DELETE'
        })
          .then(() => {
            setCotizaciones(prev => prev.filter(c => c._id !== id));
            Swal.fire('Perfecto', 'Se ha eliminado la cotización.', 'success');
          })
          .catch(() => Swal.fire('Error', 'No se pudo eliminar.', 'error'));
      }
    });
  };

const [filtroFecha, setFiltroFecha] = useState('');
const [filtroCliente, setFiltroCliente] = useState('');
const [filtroEnviado, setFiltroEnviado] = useState('');

const cotizacionesFiltradas = cotizaciones.filter(cot => {
  const coincideFecha = !filtroFecha || new Date(cot.fecha).toISOString().slice(0, 10) === filtroFecha;
  const coincideCliente = !filtroCliente || cot.cliente?.nombre?.toLowerCase().includes(filtroCliente.toLowerCase());
  const coincideEnviado = !filtroEnviado || 
    (filtroEnviado === 'Si' && cot.enviadoCorreo) ||
    (filtroEnviado === 'No' && !cot.enviadoCorreo);
  
  return coincideFecha && coincideCliente && coincideEnviado;
});



  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <EncabezadoModulo
            titulo="Lista de cotizaciones"
            exportarPDF={exportarPDF}
            exportToExcel={exportToExcel}
            buscar='Buscar cotización'
          />

          <div className="filtros-tabla">
            <div className="filtro-grupo">
              <label>Fecha:</label>
              <input 
                type="date" 
                className="filtro-input" 
                value={filtroFecha} 
                onChange={(e) => setFiltroFecha(e.target.value)} 
              />
                  </div>
                  <div className="filtro-grupo">
                    <label>Cliente:</label>
                    <input 
                      type="text" 
                      className="filtro-input" 
                      placeholder="Buscar cliente..." 
                      value={filtroCliente} 
                      onChange={(e) => setFiltroCliente(e.target.value)} 
                    />
                  </div>
                  <div className="filtro-grupo">
                    <label>Enviado:</label>
                    <select 
                      className="filtro-select" 
                      value={filtroEnviado} 
                      onChange={(e) => setFiltroEnviado(e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="Si">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>


          <div className="container-tabla">
            <div className="table-container">
              <table id='tabla_cotizaciones'>
                <thead>
                  <tr>
                    <th># Cotización</th>
                    <th>Fecha elaboración</th>
                    <th>Cliente</th>
                    <th>Enviado por correo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizacionesFiltradas.map((cot, index) => (
                    <tr key={cot._id}>
                      <td><a onClick={() => openModal('cotizacionPreview')}>C-{cot._id.slice(-5)}</a></td>
                      <td>{new Date(cot.fecha).toLocaleDateString()}</td>
                      <td>{cot.cliente?.nombre || 'Sin nombre'}</td>
                      <td>{cot.enviadoCorreo ? 'Sí' : 'No'}</td>
                      <td>
                        <button className='btnTransparente' onClick={() => handleEliminarCotizacion(cot._id)}>
                          <i className="fa-solid fa-trash fa-xl" style={{ color: '#dc3545' }} />
                        </button>
                        <button className='btnTransparente' onClick={() => openModal('')}>  
                          <i className="fa-regular fa-calendar fa-xl"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
