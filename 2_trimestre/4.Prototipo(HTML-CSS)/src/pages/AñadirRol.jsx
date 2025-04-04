import React from 'react'
import Fijo from '../components/Fijo'
import NavUsuarios from '../components/NavUsuarios'
import { useState } from "react";
import { toggleCheckboxes } from "../funciones/animaciones";

export default function AñadirRol() {
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
          <div class="container-Rol">
            <br />
            <label>Nombre de rol</label>
            <input type="text" style={{marginLeft:'1.5rem'}}/><br/><br />
            <label>Módulos con acceso</label>
            <div class="checkbox-group">
              <input type="checkbox" /> Usuarios
              <input type="checkbox" /> Ventas
              <input type="checkbox" /> SIG
            </div>

            <div class="section">
              <h3>Permisos módulo ventas</h3>
              <br />
              <div class="permissions">


                <div className="group">
                  <label>
                    <input type="checkbox" name="agendar" checked={selected.agendar} onChange={handleChange} />
                    Agendar pedido
                  </label>
                  <br />
                  <label>
                    <input type="checkbox" name="agendados" checked={selected.agendados} onChange={handleChange} />
                    Pedidos agendados
                  </label>
                  <br />
                  <label>
                    <input type="checkbox" name="entregados" checked={selected.entregados} onChange={handleChange} />
                    Pedidos entregados
                  </label>
                  <br />
                  <label>
                    <input type="checkbox" name="devueltos" checked={selected.devueltos} onChange={handleChange} />
                    Pedidos devueltos
                  </label>
                </div>
                <div className="group">
                  <label>
                    <input type="checkbox" name="cancelados" checked={selected.cancelados} onChange={handleChange} />
                    Pedidos cancelados
                  </label>
                  <br />
                  <label>
                    <input type="checkbox" name="cotizacion" checked={selected.cotizacion} onChange={handleChange} />
                    Registrar cotización
                  </label>
                  <br />
                  <label>
                    <input type="checkbox" name="listaCotizaciones" checked={selected.listaCotizaciones} onChange={handleChange} />
                    Lista de cotizaciones
                  </label>
                  <br />
                  <label>
                    <input type="radio" name="todos" onClick={() => toggleCheckboxes(setSelected)} />
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

            <div class="section">
              <h3>Permisos módulo SIG</h3><br />
              <div class="form-group-rol">
                <label>Permisos para agregar documentos</label>
                <div class="radio-options">
                  <div>
                    <input type="radio" name="agregar-doc" /> Sí
                  </div>
                  <div>
                    <input type="radio" name="agregar-doc" /> No
                  </div>
                </div>
              </div>
              <div class="form-group-rol">
                <label>Permisos para editar documentos</label>
                <div class="radio-options">
                <div>
                    <input type="radio" name="agregar-doc" /> Sí
                  </div>
                  <div>
                    <input type="radio" name="agregar-doc" /> No
                  </div>
                </div>
              </div>
              <div class="form-group-rol">
                <label>Permisos para eliminar documentos</label>
                <div class="radio-options">
                <div>
                    <input type="radio" name="agregar-doc" /> Sí
                  </div>
                  <div>
                    <input type="radio" name="agregar-doc" /> No
                  </div>
                </div>
              </div>
              <div class="form-group-rol">
                <label>Permisos para añadir procesos</label>
                <div class="radio-options">
                <div>
                    <input type="radio" name="agregar-doc" /> Sí
                  </div>
                  <div>
                    <input type="radio" name="agregar-doc" /> No
                  </div>
                </div>
              </div>
              <div class="form-group-rol">
                <label>Permisos para editar procesos</label>
                <div class="radio-options">
                <div>
                    <input type="radio" name="agregar-doc" /> Sí
                  </div>
                  <div>
                    <input type="radio" name="agregar-doc" /> No
                  </div>
                </div>
              </div>
              <div class="form-group-rol">
                <label>Permisos para eliminar procesos</label>
                <div class="radio-options">
                <div>
                    <input type="radio" name="agregar-doc" /> Sí
                  </div>
                  <div>
                    <input type="radio" name="agregar-doc" /> No
                  </div>
                </div>
              </div>
              <div class="form-group-rol">
                <label>Permisos para añadir tipos de procesos</label>
                <div class="radio-options">
                <div>
                    <input type="radio" name="agregar-doc" /> Sí
                  </div>
                  <div>
                    <input type="radio" name="agregar-doc" /> No
                  </div>
                </div>
              </div>
              <div class="form-group-rol">
                <label>Permisos para editar tipos de procesos</label>
                <div class="radio-options">
                <div>
                    <input type="radio" name="agregar-doc" /> Sí
                  </div>
                  <div>
                    <input type="radio" name="agregar-doc" /> No
                  </div>
                </div>
              </div>
              <div class="form-group-rol">
                <label>Permisos para eliminar tipos de procesos</label>
                <div class="radio-options">
                <div>
                    <input type="radio" name="agregar-doc" /> Sí
                  </div>
                  <div>
                    <input type="radio" name="agregar-doc" /> No
                  </div>
                </div>
              </div>
            </div>
            <div className="buttons">
              <button className='btn btn-primary'>Crear usuario bb</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}