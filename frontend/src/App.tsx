import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Clientes from "./pages/Clientes";
import Pecas from "./pages/Pecas";
import Pedidos from "./pages/Pedidos";
import OrdensServico from "./pages/OrdensServico";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to= "/clientes" replace/>}/>
        <Route path="/clientes" element={<Clientes />}/>
        <Route path="/pecas" element={<Pecas />} />
        <Route path="/pedidos" element={<Pedidos/>} />
        <Route path="/ordens-servico" element={<OrdensServico/>}/>
      </Route>
    </Routes>
  );
}

export default App;