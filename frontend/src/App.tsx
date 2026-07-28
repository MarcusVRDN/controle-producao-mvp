import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Clientes from "./pages/Clientes";
import Pecas from "./pages/Pecas";
import Pedidos from "./pages/Pedidos";
import OrdensServico from "./pages/OrdensServico";
import ClienteForm from "./pages/ClienteForm"
import PecaForm from "./pages/PecaForm";
import PedidoForm from "./pages/pedidoForm";
import OrdemServicoForm from "./pages/OrdemServicoForm";
import ClienteEditForm from "./pages/ClienteEditForm";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to= "/clientes" replace/>}/>
        <Route path="/clientes" element={<Clientes />}/>
        <Route path="/pecas" element={<Pecas />} />
        <Route path="/pedidos" element={<Pedidos/>} />
        <Route path="/ordens-servico" element={<OrdensServico/>}/>
        <Route path="/clientes/novo" element={<ClienteForm />} />
        <Route path="/pecas/novo" element={<PecaForm />} />
        <Route path="/pedidos/novo" element={<PedidoForm />} />
        <Route path="/ordem-servico/novo" element={<OrdemServicoForm />} />
        <Route path="/clientes/editar/:id" element={<ClienteEditForm />} />
      </Route>
    </Routes>
  );
}

export default App;