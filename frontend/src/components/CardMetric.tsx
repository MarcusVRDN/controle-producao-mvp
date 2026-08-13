type CardMetricProps = {
  titulo: string;
  valor: number;
};

function CardMetric({ titulo, valor }: CardMetricProps) {
  return (
    <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{titulo}</p>

      <p className="mt-2 text-3xl font-semibold text-slate-900">
        {valor}
      </p>
    </div>
  );
}

export default CardMetric;