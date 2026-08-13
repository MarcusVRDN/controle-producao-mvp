type OrdemEntrega = {
  id: number;
  numero: number;
  dataEntregaSolicitada: string;
  cliente: string;
  peca: string;
};

type ProximasEntregasProps = {
  ordens: OrdemEntrega[];
};

function ProximasEntregas({
  ordens,
}: ProximasEntregasProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4">
        <h2 className="font-semibold text-slate-900">
          Entregas prioritárias
        </h2>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3">OS</th>
            <th className="p-3">Cliente</th>
            <th className="p-3">Peça</th>
            <th className="p-3">Entrega</th>
          </tr>
        </thead>

        <tbody>
          {ordens.map((ordem) => (
            <tr
              key={ordem.id}
              className="border-t border-slate-200"
            >
              <td className="p-3">{ordem.numero}</td>
              <td className="p-3">{ordem.cliente}</td>
              <td className="p-3">{ordem.peca}</td>

              <td className="p-3">
                {new Date(
                  ordem.dataEntregaSolicitada,
                ).toLocaleDateString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProximasEntregas;