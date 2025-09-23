import Fijo from '../components/Fijo'
import NavVentas from '../components/NavVentas'
import { Link, useLocation } from 'react-router-dom';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import React, { useState, useEffect } from 'react';

/**** Funcion para exportar a pdf ***/
const exportarPDF = () => {
  const input = document.getElementById('tabla_prospectos');

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

    pdf.save('listaProspectos.pdf');
  });
};

const exportToExcel = () => {
  const table = document.getElementById('tabla_prospectos');
  if (!table) {
    console.error("Tabla no encontrada");
    return;
  }
  const workbook = XLSX.utils.table_to_book(table);
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'listaProspectos.xlsx');
};

export default function ListaDeClientes() {
  const [prospectos, setProspectos] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  const location = useLocation();

  const fetchProspectos = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/clientes?esCliente=false', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProspectos(data);
    } catch (err) {
      console.error('Error al cargar prospectos', err);
    }
  };

  useEffect(() => {
    fetchProspectos();
  }, [location]);

  // Filtrado por cliente
  const prospectosFiltrados = prospectos.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  // Paginación
  const indiceUltimo = paginaActual * registrosPorPagina;
  const indicePrimero = indiceUltimo - registrosPorPagina;
  const prospectosPaginados = prospectosFiltrados.slice(indicePrimero, indiceUltimo);

  const totalPaginas = Math.ceil(prospectosFiltrados.length / registrosPorPagina);

  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <div className='encabezado-modulo'>
            <div>
              <h3 className='titulo-profesional'>Prospectos de clientes</h3>

              {/* BOTONES EXPORTAR */}
              <button
                onClick={() => exportToExcel(prospectos)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '0.45rem 0.9rem', border: '1.5px solid #16a34a',
                  borderRadius: '8px', background: 'transparent', color: '#16a34a',
                  fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fa-solid fa-file-excel" style={{ color: 'inherit', fontSize: '16px' }}></i>
                <span>Exportar a Excel</span>
              </button>

              <button
                onClick={exportarPDF}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '0.45rem 0.9rem', border: '1.5px solid #dc2626',
                  borderRadius: '8px', background: 'transparent', color: '#dc2626',
                  fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fa-solid fa-file-pdf" style={{ color: 'inherit', fontSize: '16px' }}></i>
                <span>Exportar a PDF</span>
              </button>
            </div>
          </div>

          {/* FILTRO */}
          <div style={{ margin: "15px 0" }}>
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={filtroTexto}
              onChange={(e) => { 
                setFiltroTexto(e.target.value); 
                setPaginaActual(1); 
              }}
              style={{
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                width: "250px"
              }}
            />
          </div>

          {/* TABLA */}
          <div className="container-tabla">
            <div className="table-container">
              <table id='tabla_prospectos'>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Ciudad</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                  </tr>
                </thead>
                <tbody>
                  {prospectosPaginados.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>No hay prospectos registrados.</td>
                    </tr>
                  ) : (
                    prospectosPaginados.map((cliente, index) => (
                      <tr key={index}>
                        <td>{cliente.nombre}</td>
                        <td>{cliente.ciudad}</td>
                        <td>{cliente.telefono}</td>
                        <td>{cliente.correo}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINACIÓN */}
          <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "8px" }}>
            {Array.from({ length: totalPaginas }, (_, i) => (
              <button
                key={i}
                onClick={() => setPaginaActual(i + 1)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: paginaActual === i + 1 ? "#5a3badff" : "white",
                  color: paginaActual === i + 1 ? "white" : "#333",
                  cursor: "pointer"
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        
      </div>
      <div className="custom-footer">
          <p className="custom-footer-text">
            © 2025 <span className="custom-highlight">PANGEA</span>. Todos los derechos reservados.
          </p>
        </div>
    </div>
  )
}
