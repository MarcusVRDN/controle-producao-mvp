import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      nome: "Clientes",
      caminho: "/clientes",
    },
    {
      nome: "Peças",
      caminho: "/pecas",
    },
    {
      nome: "Pedidos",
      caminho: "/pedidos",
    },
    {
      nome: "Ordens de Serviço",
      caminho: "/ordens-servico",
    },
  ];
  return (
    <aside className="h-screen w-64 bg-slate-950 p-6">
      <h1 className="text-center p-6 text-lg font-semibold text-white">
        Controle de Produção
      </h1>
      <nav>
        <ul className="space-y-2 text-white">
          {menuItems.map((item) => (
            <li key={item.nome}>
              <NavLink
                to={item.caminho}
                className={({ isActive }) =>
                  `flex rounded-lg px-4 py-3 transition ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-900"
                  }`
                }
              >
                {item.nome}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
