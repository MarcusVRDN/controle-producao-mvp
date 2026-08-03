import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type Cliente = {
  id: number;
  nome: string;
  cnpj: string;
  contato?: string;
  telefone?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
};

function ClienteView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    async function buscarCliente() {
      const response = await fetch(`http://localhost:3001/clientes/${id}`);
      if (response.ok) {
        const clienteApi = await response.json();
        setCliente(clienteApi);
      } else {
        console.error("Erro ao buscar cliente");
      }
    }
    buscarCliente();
  }, [id]);

  if (!cliente) {
    return <p>Carregando...</p>;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Detalhes do cliente
          </h1>

          <p className="text-sm text-slate-300">
            Consulte as informações completas do cliente
          </p>
        </div>

        <button 
        className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        onClick={() => navigate("/clientes")}>Voltar</button>
      </div>

      <div className="w-full max-w-4xl rounded-xl border border-slate-300 bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Nome</p>
            <p className="font-medium text-slate-900">{cliente.nome}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">CNPJ</p>
            <p className="font-medium text-slate-900">{cliente.cnpj}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Contato</p>
            <p className="font-medium text-slate-900">
              {cliente.contato ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Telefone</p>
            <p className="font-medium text-slate-900">
              {cliente.telefone ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Ativo</p>
            <p className="font-medium text-slate-900">
              {cliente.ativo ? "Ativo" : "Inativo"}
            </p>
          </div>
          <div className="mt-6 border-t border-slate-300 pt-6">
            <div>
              <p className="text-sm text-slate-500">Criado em:</p>
              <p className="font-medium text-slate-900">
                {new Date(cliente.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Última atualização</p>
              <p className="font-medium text-slate-900">
                {new Date(cliente.updatedAt).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClienteView;
