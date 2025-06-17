import Fijo from '../components/Fijo'
import NavUsuarios from '../components/NavUsuarios'
import { useState } from "react";
import { toggleCheckboxes } from "../funciones/animaciones";
import { toggleSubMenu } from '../funciones/animaciones';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'

export default function AñadirRol() {


  const handleClick = () =>
    Swal.fire({
      text: 'Rol añadido correctamente',
      icon: 'success',
      showCancelButton: false,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    });
  const [selected, setSelected] = useState({
    agendar: false,
    agendados: false,
    entregados: false,
    devueltos: false,
    cancelados: false,
    cotizacion: false,
    listaCotizaciones: false,
  });

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setSelected((prev) => ({ ...prev, [name]: checked }));
  };
  return (
    <div>
      <Fijo />
      <div className="content">
        <NavUsuarios />
        <div className="contenido-modulo">
          <h2>Añadir rol</h2>
          <div class="container-form">
            <form action="">
              <br />
              <label>Nombre de rol</label>
              <input className='entrada' type="text" style={{ marginLeft: '1.5rem' }} /><br /><br />
              <label >Módulos con acceso</label>
              <br />
              <br />
              <div class="checkbox-group">
                <input type="checkbox" onClick={() => toggleSubMenu('permisos-usuarios')} /> Usuarios
                <input type="checkbox" onClick={() => toggleSubMenu('permisos-compras')} /> Compras
                <input type="checkbox" onClick={() => toggleSubMenu('permisos-productos')} /> Productos
                <input type="checkbox" onClick={() => toggleSubMenu('permisos-ventas')} /> Ventas
              </div>
              <br />
              <div className="section dropdown" id='permisos-usuarios'>
                <h3>Permisos módulo usuarios</h3>
                <br />
                <div class="permissions">
                  <div className="group">
                    <label >
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" onChange={() => toggleSubMenu('lista-usuarios')} />
                      Lista de usuarios
                    </label>
                    <br />
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" />
                      Añadir usuario
                    </label>
                    <br />

                  </div>
                  <div className="group">
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" />
                      Añadir rol
                    </label>
                    <br />

                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="radio" />
                      Todos
                    </label>
                  </div>
                  <br />

                </div>
                <br />
                <div class="form-group-rol dropdown" id='lista-usuarios'>
                  <label>Permisos para lista de usuarios</label>
                  <div class="radio-options">
                    <input type="radio" name="usersListPermissions" /> Solo ver
                    <input type="checkbox" /> Editar usuarios
                    <input type="checkbox" /> Habilitar / Inhabilitar
                    <input type="checkbox" /> Eliminar usuarios
                    <input type="radio" name="usersListPermissions"/> Todos los permisos
                  </div>
                </div>

              </div>
              <div className="section dropdown" id='permisos-compras'>
                <h3>Permisos módulo compras</h3>
                <br />
                <div class="permissions">
                  <div className="group">
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" />
                      Lista de proveedores
                    </label>
                    <br />
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="entregados" checked={selected.entregados} onChange={handleChange} />
                      Historial de compras
                    </label>
                    <br />
                  </div>
                  <div className="group">
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="cancelados" checked={selected.cancelados} onChange={handleChange} />
                      Ver reportes
                    </label>
                    <br />

                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="radio" />
                      Todos
                    </label>
                  </div>
                </div>
                <br />

              </div>
              <div className="section dropdown" id='permisos-productos'>
                <h3>Permisos módulo productos</h3>
                <br />

                <div class="permissions">

                  <div className="group">
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" />
                      Lista de productos
                    </label>
                    <br />
                  </div>
                  <div className="group">
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="cancelados" checked={selected.cancelados} onChange={handleChange} />
                      Pedidos cancelados
                    </label>
                    <br />
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="cotizacion" checked={selected.cotizacion} onChange={handleChange} />
                      Registrar cotización
                    </label>
                    <br />
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="listaCotizaciones" checked={selected.listaCotizaciones} onChange={handleChange} />
                      Lista de cotizaciones
                    </label>
                    <br />
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="radio" name="todos" onClick={() => toggleCheckboxes(setSelected)} />
                      Todos
                    </label>
                  </div>
                </div>
                <br />

                <div class="form-group-rol">
                  <label>Permisos para pedidos agendados</label>
                  <div class="radio-options">
                    <div>
                      <input type="radio" /> Solo ver
                    </div>
                    <div>
                      <input type="radio" /> Todos los permisos
                    </div>
                  </div>
                </div>
                <div class="form-group-rol">
                  <label>Permisos para pedidos entregados</label>
                  <div class="radio-options">
                    <div>
                      <input type="radio" /> Solo ver
                    </div>
                    <div>
                      <input type="radio"/> Todos los permisos
                    </div>
                  </div>
                </div>
                <div class="form-group-rol">
                  <label>Permisos para lista de devoluciones</label>
                  <div class="radio-options">
                    <div>
                      <input type="radio"  /> Solo ver
                    </div>
                    <div>
                      <input type="radio" name="pedidosagendados" /> Todos los permisos
                    </div>
                  </div>
                </div>
                <div class="form-group-rol">
                  <label>Permisos para lista de cotizaciones</label>
                  <div class="radio-options">
                    <div>
                      <input type="radio" name="pedidosagendados" /> Solo ver
                    </div>
                    <div>
                      <input type="radio" name="pedidosagendados" /> Todos los permisos
                    </div>
                  </div>
                </div>
                <div class="form-group-rol">
                  <label>Permisos para lista de clientes</label>
                  <div class="radio-options">
                    <div>
                      <input type="radio" name="pedidosagendados" /> Solo ver
                    </div>
                    <div>
                      <input type="radio" name="pedidosagendados" /> Todos los permisos
                    </div>
                  </div>
                </div>
                <div class="form-group-rol">
                  <label>Permisos para prospectos de cliente</label>
                  <div class="radio-options">
                    <div>
                      <input type="radio" name="pedidosagendados" /> Solo ver
                    </div>
                    <div>
                      <input type="radio" name="pedidosagendados" /> Todos los permisos
                    </div>
                  </div>
                </div>
              </div>
              <div className="section dropdown" id='permisos-ventas'>
                <h3>Permisos módulo ventas</h3>
                <br />

                <div class="permissions">

                  <div className="group">
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="agendar" checked={selected.agendar} onChange={handleChange} />
                      Agendar pedido
                    </label>
                    <br />
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="agendados" checked={selected.agendados} onChange={handleChange} />
                      Pedidos agendados
                    </label>
                    <br />
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="entregados" checked={selected.entregados} onChange={handleChange} />
                      Pedidos entregados
                    </label>
                    <br />
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="devueltos" checked={selected.devueltos} onChange={handleChange} />
                      Pedidos devueltos
                    </label>
                  </div>
                  <div className="group">
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="cancelados" checked={selected.cancelados} onChange={handleChange} />
                      Pedidos cancelados
                    </label>
                    <br />
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="cotizacion" checked={selected.cotizacion} onChange={handleChange} />
                      Registrar cotización
                    </label>
                    <br />
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="checkbox" name="listaCotizaciones" checked={selected.listaCotizaciones} onChange={handleChange} />
                      Lista de cotizaciones
                    </label>
                    <br />
                    <label>
                      <input style={{ marginRight: '0.5rem', marginBottom: '.5rem' }} type="radio" name="todos" onClick={() => toggleCheckboxes(setSelected)} />
                      Todos
                    </label>
                  </div>
                </div>
                <br />

                <div class="form-group-rol">
                  <label>Permisos para pedidos agendados</label>
                  <div class="radio-options">
                    <div>
                      <input type="radio" name="pedidosagendados" /> Solo ver
                    </div>
                    <div>
                      <input type="radio" name="pedidosagendados" /> Todos los permisos
                    </div>
                  </div>
                </div>
                <div class="form-group-rol">
                  <label>Permisos para pedidos entregados</label>
                  <div class="radio-options">
                    <div>
                      <input type="radio" name="pedidosagendados" /> Solo ver
                    </div>
                    <div>
                      <input type="radio" name="pedidosagendados" /> Todos los permisos
                    </div>
                  </div>
                </div>
                <div class="form-group-rol">
                  <label>Permisos para lista de devoluciones</label>
                  <div class="radio-options">
                    <div>
                      <input type="radio" name="pedidosagendados" /> Solo ver
                    </div>
                    <div>
                      <input type="radio" name="pedidosagendados" /> Todos los permisos
                    </div>
                  </div>
                </div>
                <div class="form-group-rol">
                  <label>Permisos para lista de cotizaciones</label>
                  <div class="radio-options">
                    <div>
                      <input type="radio" name="pedidosagendados" /> Solo ver
                    </div>
                    <div>
                      <input type="radio" name="pedidosagendados" /> Todos los permisos
                    </div>
                  </div>
                </div>
                <div class="form-group-rol">
                  <label>Permisos para lista de clientes</label>
                  <div class="radio-options">
                    <div>
                      <input type="radio" name="pedidosagendados" /> Solo ver
                    </div>
                    <div>
                      <input type="radio" name="pedidosagendados" /> Todos los permisos
                    </div>
                  </div>
                </div>
                <div class="form-group-rol">
                  <label>Permisos para prospectos de cliente</label>
                  <div class="radio-options">
                    <div>
                      <input type="radio" name="pedidosagendados" /> Solo ver
                    </div>
                    <div>
                      <input type="radio" name="pedidosagendados" /> Todos los permisos
                    </div>
                  </div>
                </div>
              </div>
              <div className="buttons">
                <Link to={`/AñadirRol`} onClick={handleClick}>
                  <button className="btn btn-primary">Crear Rol</button>
                </Link>
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  )
}