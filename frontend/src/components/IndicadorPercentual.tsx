import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

type IndicadorPercentualProps = {
  titulo: string;
  valor: number;
};

function IndicadorPercentual({
  titulo,
  valor,
}: IndicadorPercentualProps) {
  const valorLimitado = Math.min(Math.max(valor, 0), 100);

  const dados = [
    {
      name: titulo,
      value: valorLimitado,
    },
    {
      name: "Restante",
      value: 100 - valorLimitado,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-medium text-slate-600">
        {titulo}
      </h2>

      <div className="relative h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dados}
              dataKey="value"
              innerRadius={50}
              outerRadius={70}
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="#2563eb" />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold text-slate-900">
            {valorLimitado.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default IndicadorPercentual;