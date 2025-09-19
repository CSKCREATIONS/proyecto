import React, { useState, useEffect, useRef } from 'react';
import Fijo from '../components/Fijo';
import NavVentas from '../components/NavVentas';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import FormatoCotizacion from '../components/FormatoCotizacion';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom'; // ya lo tienes o debes agregarlo

export default function ListaDeCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const modalRef = useRef();
  const navigate = useNavigate();




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


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'Sesión expirada. Vuelve a iniciar sesión.', 'warning');
      return;
    }



    const fetchData = async () => {
      try {
        const [cotRes, prodRes] = await Promise.all([
          fetch('http://localhost:5000/api/cotizaciones', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/products', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!cotRes.ok || !prodRes.ok) throw new Error('Error al obtener los datos');

        const [cotData, prodData] = await Promise.all([cotRes.json(), prodRes.json()]);

        setCotizaciones(Array.isArray(cotData) ? cotData : []);
        setProductos(Array.isArray(prodData.data) ? prodData.data : []);

      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
      }
    };

    fetchData();
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
        fetch(`http://localhost:5000/api/cotizaciones/${id}`, {
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

  const guardarEdicion = async () => {

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5000/api/cotizaciones/${cotizacionSeleccionada._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cotizacionSeleccionada)
      });

      if (!res.ok) throw new Error('Error al guardar los cambios');
      Swal.fire('Éxito', 'Cotización actualizada correctamente', 'success');
      setModoEdicion(false);
      setCotizacionSeleccionada(null);

      const nuevasCotizaciones = cotizaciones.map(c =>
        c._id === cotizacionSeleccionada._id ? cotizacionSeleccionada : c
      );
      setCotizaciones(nuevasCotizaciones);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const agregarProducto = () => {
    const nuevosProductos = [...cotizacionSeleccionada.productos, {
      producto: '',
      cantidad: '',
      descuento: '',
    }];
    setCotizacionSeleccionada({ ...cotizacionSeleccionada, productos: nuevosProductos });
  };


  const eliminarProducto = (index) => {
    const nuevosProductos = cotizacionSeleccionada.productos.filter((_, i) => i !== index);
    setCotizacionSeleccionada({ ...cotizacionSeleccionada, productos: nuevosProductos });
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



  /*** PAGINACIÓN ***/
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cotizacionesFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cotizacionesFiltradas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const subtotal = cotizacionSeleccionada?.productos?.reduce((acc, p) => {
    const cantidad = parseFloat(p?.cantidad) || 0;
    const precio = parseFloat(p?.precioUnitario) || 0;
    return acc + cantidad * precio;
  }, 0) || 0;


  const enviarCorreo = () => {
    Swal.fire('Enviado', 'Correo enviado con éxito (simulado)', 'success');
  };

  const imprimir = () => {
    const printContent = modalRef.current;
    const win = window.open('', '', 'width=800,height=600');
    win.document.write('<html><head><title>Cotización</title></head><body>');
    win.document.write(printContent.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  const abrirFormato = (cotizacion) => {
    setCotizacionSeleccionada(cotizacion);
    setModoEdicion(false);
  };

  const abrirEdicion = (cotizacion) => {
    setCotizacionSeleccionada(cotizacion);
    setModoEdicion(true);
  };


  const limpiarHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };


  return (
    <div>
      <Fijo />
      <div className="content">
        <NavVentas />
        <div className="contenido-modulo">
          <div className='encabezado-modulo'>
            <div>
              <h3 className='titulo-profesional'>Lista de cotizaciones</h3>
              {/* BOTONES EXPORTAR */}
              <button
                onClick={() => exportToExcel(cotizaciones)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.9rem', border: '1.5px solid #16a34a', borderRadius: '8px', background: 'transparent', color: '#16a34a',
                  fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.3s ease'
                }}
              >
                <i className="fa-solid fa-file-excel" style={{ color: 'inherit', fontSize: '16px' }}></i>
                <span>Exportar a Excel</span>
              </button>

              <button
                onClick={exportarPDF}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.9rem', border: '1.5px solid #dc2626', borderRadius: '8px', background: 'transparent', color: '#dc2626',
                  fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.3s ease'
                }}
              >
                <i className="fa-solid fa-file-pdf" style={{ color: 'inherit', fontSize: '16px' }}></i>
                <span>Exportar a PDF</span>
              </button>

              {cotizacionSeleccionada && ReactDOM.createPortal(
                <FormatoCotizacion
                  datos={cotizacionSeleccionada}
                  onClose={() => setCotizacionSeleccionada(null)}
                />,
                document.body
              )}




            </div>
          </div>
          <div className="filtros-tabla">
            <div className="filtro-grupo">
              <label>Fecha:</label>
              <input type="date" className="filtro-input" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
            </div>
            <div className="filtro-grupo">
              <label>Cliente:</label>
              <input type="text" className="filtro-input" placeholder="Buscar cliente..." value={filtroCliente} onChange={(e) => setFiltroCliente(e.target.value)} />
            </div>
            <div className="filtro-grupo"><br></br>
              <label>Enviado:</label>
              <select className="filtro-select" value={filtroEnviado} onChange={(e) => setFiltroEnviado(e.target.value)}>
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
                  {currentItems.map((cot, index) => (
                    <tr key={cot._id}>
                      <td><a>{cot.codigo}</a></td>
                      <td>{new Date(cot.fecha).toLocaleDateString()}</td>
                      <td>{cot.cliente?.nombre || 'Sin nombre'}</td>
                      <td>{cot.enviadoCorreo ? 'Sí' : 'No'}</td>
                      <td>
                        <button className='btnTransparente' onClick={() => handleEliminarCotizacion(cot._id)}>
                          <i className="fa-solid fa-trash fa-xl" style={{ color: '#dc3545' }} />
                        </button>
                        <button
                          className='btnTransparente'
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              const res = await fetch(`http://localhost:5000/api/cotizaciones/${cot._id}`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                              });
                              if (!res.ok) throw new Error('No se pudo obtener la cotización');
                              const cotizacionCompleta = await res.json();
                              setCotizacionSeleccionada(cotizacionCompleta);
                            } catch (err) {
                              Swal.fire('Error', 'No se pudo cargar la cotización completa.', 'error');
                            }
                          }}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>


                        <button
                          className='btnTransparente'
                          onClick={() => {
                            if (cot.cliente?._id) {
                              navigate(`/AgendarVenta/${cot.cliente._id}`);
                            } else {
                              Swal.fire('Error', 'Esta cotización no tiene un cliente válido asignado.', 'warning');
                            }
                          }}
                        >
                          <i className="fa-solid fa-calendar-plus" style={{ color: '#28a745' }} title="Agendar venta" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cotizaciones.length === 0 && <tr><td colSpan="9">No hay cotizaciones disponibles</td></tr>}
                </tbody>

              </table>

            </div>
            {/* PAGINACIÓN */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={currentPage === i + 1 ? 'active-page' : ''}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>


    </div>


  )
};
