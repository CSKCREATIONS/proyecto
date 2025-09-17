import React, { useState, useEffect, useRef } from 'react';
import Fijo from '../components/Fijo';
import NavVentas from '../components/NavVentas';
import EncabezadoModulo from '../components/EncabezadoModulo';
import { openModal } from '../funciones/animaciones';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import FormatoCotizacion from '../components/FormatoCotizacion';
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

              {cotizacionSeleccionada && (
                <FormatoCotizacion
                  cotizacion={cotizacionSeleccionada}
                  setCotizacion={setCotizacionSeleccionada}
                  onClose={() => setCotizacionSeleccionada(null)}
                  onEdit={() => setModoEdicion(true)}
                  onSend={enviarCorreo}
                  onPrint={imprimir}
                  onSave={guardarEdicion}
                  productos={productos}
                  editable={modoEdicion}
                />
              )}
            </div>
          </div>
          <div className="filtros-tabla">
            <div className="filtro-grupo">
              <label>Fecha:</label>
              <input type="date" className="filtro-input" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
            </div>

              <br/><br/>
            <div className="filtro-grupo">
              <label>Cliente:</label>
              <input type="text" className="filtro-input" placeholder="Buscar cliente..." value={filtroCliente} onChange={(e) => setFiltroCliente(e.target.value)} />
            </div><br/>
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
      <td><a onClick={() => setCotizacionSeleccionada(cot)}>C-{cot._id.slice(-5)}</a></td>
      <td>{new Date(cot.fecha).toLocaleDateString()}</td>
      <td>{cot.cliente?.nombre || 'Sin nombre'}</td>
      <td>{cot.enviadoCorreo ? 'Sí' : 'No'}</td>
      <td>
        <button className='btnTransparente' onClick={() => handleEliminarCotizacion(cot._id)}>
          <i className="fa-solid fa-trash fa-xl" style={{ color: '#dc3545' }} />
        </button>
        <button className='btnTransparente' onClick={() => {
          setCotizacionSeleccionada(cot);
          setModoEdicion(true);
        }}>
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

      {cotizacionSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content modal-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>

            <div className="modal-content modal-lg">
              <div className="modal-header">
                <h5 className="modal-title">Editar Cotización</h5>
                <button className="modal-close" onClick={() => setCotizacionSeleccionada(null)}>&times;</button>
              </div>
              <div className="modal-body">
                <div style={{ backgroundColor: '#d9d9d9', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: '1 1 200px' }}>
                      <label><strong>Cliente:</strong></label>
                      <br />
                      <input
                        type="text"
                        className="input-estilo"
                        placeholder="Nombre del cliente"
                        value={cotizacionSeleccionada.cliente?.nombre || ''}
                        onChange={(e) =>
                          setCotizacionSeleccionada({
                            ...cotizacionSeleccionada,
                            cliente: { ...cotizacionSeleccionada.cliente, nombre: e.target.value }
                          })
                        }
                      />
                    </div>

                    <div style={{ flex: '1 1 200px' }}>
                      <label><strong>Teléfono:</strong></label>
                      <input
                        type="text"
                        className="input-estilo"
                        placeholder="Teléfono"
                        value={cotizacionSeleccionada.cliente?.telefono || ''}
                        onChange={(e) =>
                          setCotizacionSeleccionada({
                            ...cotizacionSeleccionada,
                            cliente: { ...cotizacionSeleccionada.cliente, telefono: e.target.value }
                          })
                        }
                      />
                    </div>

                    <div style={{ flex: '1 1 200px' }}>
                      <label><strong>Ciudad:</strong></label>
                      <br />
                      <input
                        type="text"
                        className="input-estilo"
                        placeholder="Ciudad"
                        value={cotizacionSeleccionada.cliente?.ciudad || ''}
                        onChange={(e) =>
                          setCotizacionSeleccionada({
                            ...cotizacionSeleccionada,
                            cliente: { ...cotizacionSeleccionada.cliente, ciudad: e.target.value }
                          })
                        }
                      />
                    </div>

                    <div style={{ flex: '1 1 200px' }}>
                      <label><strong>Email:</strong></label>
                      <br />
                      <input
                        type="email"
                        className="input-estilo"
                        placeholder="Correo electrónico"
                        value={cotizacionSeleccionada.cliente?.correo || ''}
                        onChange={(e) =>
                          setCotizacionSeleccionada({
                            ...cotizacionSeleccionada,
                            cliente: { ...cotizacionSeleccionada.cliente, correo: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ flex: '1 1 300px' }}>
                      <label><strong>Descripción:</strong></label>
                      <br />
                      <input
                        type="text"
                        className="input-estilo"
                        placeholder="Descripción"
                        value={limpiarHTML(cotizacionSeleccionada.descripcion || '')}
                        onChange={(e) =>
                          setCotizacionSeleccionada({
                            ...cotizacionSeleccionada,
                            descripcion: e.target.value
                          })
                        }
                      />
                    </div>

                    <div style={{ flex: '1 1 300px' }}>
                      <label><strong>Condiciones de pago:</strong></label>
                      <br />
                      <textarea
                        className="input-estilo"
                        rows="1"
                        placeholder="Condiciones de pago"
                        value={limpiarHTML(cotizacionSeleccionada.condicionesPago || '')}
                        onChange={(e) =>
                          setCotizacionSeleccionada({
                            ...cotizacionSeleccionada,
                            condicionesPago: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Producto</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Valor Unitario</th>
                      <th>Descuento</th>
                      <th>Valor Total</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cotizacionSeleccionada.productos.map((p, idx) => {
                      const productoInfo = productos.find(prod => prod._id === p.producto);
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <select
                              className="cuadroTexto"
                              value={p.producto}
                              onChange={(e) => {
                                const actualizado = [...cotizacionSeleccionada.productos];
                                actualizado[idx].producto = e.target.value;
                                setCotizacionSeleccionada({ ...cotizacionSeleccionada, productos: actualizado });
                              }}
                            >
                              <option value="">Seleccione un producto</option>
                              {productos.map(prod => (
                                <option key={prod._id} value={prod._id}>{prod.name}</option>
                              ))}
                            </select>
                          </td>
                          <td><input type="text" value={productoInfo?.description || ''} disabled /></td>
                          <td>
                            <input
                              type="number"
                              value={p.cantidad || ''}
                              onChange={(e) => {
                                const actualizado = [...cotizacionSeleccionada.productos];
                                actualizado[idx].cantidad = e.target.value;
                                setCotizacionSeleccionada({ ...cotizacionSeleccionada, productos: actualizado });
                              }}
                            />
                          </td>
                          <td><input type="number" value={productoInfo?.price || ''} disabled /></td>
                          <td>
                            <input
                              type="number"
                              value={p.descuento || ''}
                              onChange={(e) => {
                                const actualizado = [...cotizacionSeleccionada.productos];
                                actualizado[idx].descuento = e.target.value;
                                setCotizacionSeleccionada({ ...cotizacionSeleccionada, productos: actualizado });
                              }}
                            />
                          </td>
                          <td>{((parseFloat(productoInfo?.price || 0) * parseFloat(p.cantidad || 0)) * (1 - parseFloat(p.descuento || 0) / 100)).toFixed(2)}</td>
                          <td><button className="btn btn-danger" onClick={() => eliminarProducto(idx)}>Eliminar</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                <br />
                <button className="btn btn-success mt-2" onClick={agregarProducto}>Agregar Producto</button>
              </div>
              <div className="modal-content modal-lg" ref={modalRef} style={{ maxHeight: '85vh', overflowY: 'auto' }}>
                <div className="modal-footer">
                  <button className="btn btn-cancel" onClick={() => setCotizacionSeleccionada(null)}>Cancelar</button>
                  <button className="btn btn-save" onClick={guardarEdicion}>Guardar</button>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400 tracking-wide text-center">
          © 2025{" "}
          <span className="text-yellow-400 font-semibold transition duration-300 hover:text-yellow-300 hover:brightness-125">
            PANGEA
          </span>
          . Todos los derechos reservados.
        </p>
        </div>
        
      )}
    </div>


  )
};
