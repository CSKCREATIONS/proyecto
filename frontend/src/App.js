import React from 'react';
import { Routes, Route, BrowserRouter, } from "react-router-dom";
import ListaDeUsuarios from './pages/ListaDeUsuarios';
import Home from './pages/Home';
import RolesYPermisos from './pages/RolesYPermisos'
import InformacionDeFuente from './pages/InformacionDeFuente';
import Documentacion from './pages/Documentacion';
import AgendarVenta from './pages/AgendarVenta';
import PedidosAgendados from './pages/PedidosAgendados';
import PedidosEntregados from './pages/PedidosEntregados';
import PedidosCancelados from './pages/PedidosCancelados';
import RegistrarCotizacion from './pages/RegistrarCotizacion';
import ListaDeCotizaciones from './pages/ListaDeCotizaciones';
import ListaDeClientes from './pages/ListaDeClientes';
import ProspectosDeCliente from './pages/ProspectosDeCliente';
import Login from './pages/Login';
import RecuperarContraseña from './pages/RecuperarContraseña';
import TipoDocumentoAdicionar from './pages/TipoDocumentoAdicionar';
import TipoDocumento from './pages/TipoDocumento';
import TipoDocumentoEdit from './pages/TipoDocumentoEdit';
import Proceso from './pages/Proceso';
import ProcesoEdit from './pages/ProcesoEdit';
import ProcesoAdicionar from './pages/ProcesoAdicionar';
import DocumentacionAdicionar from './pages/DocumentacionAdicionar';
import DocumentacionEdit from './pages/DocumentacionEdit';
import Trazabilidad from './pages/Trazabilidad';
import Perfil from './pages/Perfil';
import Error404 from './pages/Error404';
import Error504 from './pages/Error504';
import Empresa from './pages/Empresa';
import Home1 from './pages/Home1';
import Home2 from './pages/Home2';
import Perfil1 from './pages/Perfil1';
import Perfil2 from './pages/Perfil2';
import GestionProductos from './pages/GestionProductos';
import ReporteVentas from './pages/ReporteVentas';
import PrivateRoute from './routes/PrivateRoute';
import PermisoRoute from './routes/PermisoRoute';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {/* Rutas públicas */}
          <Route index path='/' element={<Login />} />
          <Route path='/RecuperarContraseña' element={<RecuperarContraseña />} />

          <Route path='/Home' element={<PrivateRoute><Home /></PrivateRoute>} />

          <Route
            path='/ListaDeUsuarios'
            element={
              <PrivateRoute>
                <PermisoRoute permiso="usuarios.ver">
                  <ListaDeUsuarios />
                </PermisoRoute>
              </PrivateRoute>

            }
          />

          <Route
            path="/RolesYPermisos"
            element={
              <PermisoRoute permiso="roles.ver">
                <RolesYPermisos />
              </PermisoRoute>
            }
          />
          <Route path='/InformacionDeFuente' element={<InformacionDeFuente />} />
          <Route path='/Documentacion' element={<Documentacion />} />
          <Route path='/DocumentacionAdicionar' element={<DocumentacionAdicionar />} />
          <Route path='/AgendarVenta' element={<AgendarVenta />} />
          <Route path='/PedidosAgendados' element={<PedidosAgendados />} />
          <Route path='/PedidosEntregados' element={<PedidosEntregados />} />
          <Route path='/PedidosCancelados' element={<PedidosCancelados />} />
          <Route path='/RegistrarCotizacion' element={<RegistrarCotizacion />} />
          <Route path='/ListaDeCotizaciones' element={<ListaDeCotizaciones />} />
          <Route path='/ListaDeClientes' element={<ListaDeClientes />} />
          <Route path='/ProspectosDeClientes' element={<ProspectosDeCliente />} />
          <Route path='/TipoDocumentoAdicionar' element={<TipoDocumentoAdicionar />} />
          <Route path='/TipoDocumento' element={<TipoDocumento />} />
          <Route path='/TipoDocumentoEdit' element={<TipoDocumentoEdit />} />
          <Route path='/Proceso' element={<Proceso />} />
          <Route path='/ProcesoEdit' element={<ProcesoEdit />} />
          <Route path='/ProcesoAdicionar' element={<ProcesoAdicionar />} />
          <Route path='/DocumentacionEdit' element={<DocumentacionEdit />} />
          <Route path='/Trazabilidad' element={<Trazabilidad />} />
          <Route path='/Perfil' element={<Perfil />} />
          <Route path='Login' element={<Login />} />
          <Route path="/error504" element={<Error504 />} />
          <Route path="*" element={<Error404 />} />
          <Route path="Empresa" element={<Empresa />} />
          <Route path='/Home1' element={<Home1 />} />
          <Route path='/Home2' element={<Home2 />} />
          <Route path='/Perfil1' element={<Perfil1 />} />
          <Route path='/Perfil2' element={<Perfil2 />} />
          <Route path='/GestionProductos' element={<GestionProductos />} />
          <Route path='/ReporteVentas' element={<ReporteVentas />} />


        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;