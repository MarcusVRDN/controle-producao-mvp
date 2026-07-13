function Sidebar() {
    const menuItems = ["Dashboard", "Clientes", "Peças", "Pedidos", "Ordens de Serviço"]
  return (
    <aside className="h-screen w-64 bg-slate-950 p-6">
        <h1 className="text-center p-6 text-lg font-semibold text-white">Controle de Produção</h1>
        <nav>
            <ul className="space-y-2 text-white">
                {menuItems.map((texto) => (
                    <li 
                    key = {texto}
                    className= "rounded px-4 py-2 hover:bg-slate-800">
                        {texto}
                    </li>
                ))}
            </ul>
        </nav>
    </aside>
  )
}

export default Sidebar
