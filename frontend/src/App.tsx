import Layout from "./components/layout/Layout";
import Clientes from "./pages/Clientes";
import Pecas from "./pages/Pecas";
import Pedidos from "./pages/Pedidos";

function App() {
  return (
    <Layout>
      <Pecas />
    </Layout>
  );
}

export default App;