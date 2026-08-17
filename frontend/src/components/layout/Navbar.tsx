import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <header className="flex h-16 bg-slate-900 items-center justify-between border-b border-slate-700 px-6">
      <h1 className="text-lg font-semibold text-white">Controle de Produção</h1>
      <span className="text-sm text-slate-300"> Usuário</span>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
      >
        <LogOut size={18} />
        Sair
      </button>
    </header>
  );
}

export default Navbar;
