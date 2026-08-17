import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.ordemServico.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.peca.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.user.deleteMany();

  const senhaHash = await bcrypt.hash("12345678", 10);

  await prisma.user.create({
    data: {
      nome: "Marcus",
      email: "marcus@email.com",
      senha: senhaHash,
    },
  });

  const cliente1 = await prisma.cliente.create({
    data: {
      nome: "Metalúrgica São José",
      cnpj: "12.345.678/0001-01",
      contato: "Carlos Mendes",
      telefone: "(12) 98888-1001",
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      nome: "Indústria Vale do Paraíba",
      cnpj: "23.456.789/0001-02",
      contato: "Fernanda Lima",
      telefone: "(12) 98888-1002",
    },
  });

  const cliente3 = await prisma.cliente.create({
    data: {
      nome: "TecnoMec Usinagem",
      cnpj: "34.567.890/0001-03",
      contato: "Ricardo Alves",
      telefone: "(12) 98888-1003",
    },
  });

  const cliente4 = await prisma.cliente.create({
    data: {
      nome: "AeroParts Brasil",
      cnpj: "45.678.901/0001-04",
      contato: "Juliana Rocha",
      telefone: "(12) 98888-1004",
    },
  });

  const cliente5 = await prisma.cliente.create({
    data: {
      nome: "Precisão Industrial",
      cnpj: "56.789.012/0001-05",
      contato: "André Souza",
      telefone: "(12) 98888-1005",
    },
  });

  const pecasCliente1 = await Promise.all([
    prisma.peca.create({
      data: {
        codigo: "PCA-001",
        clienteId: cliente1.id,
        descricao: "Eixo principal",
        material: "Aço SAE 1045",
        tratamentoTermico: "Têmpera",
        tratamentoSuperficial: "Oxidação Negra",
      },
    }),
    prisma.peca.create({
      data: {
        codigo: "PCA-002",
        clienteId: cliente1.id,
        descricao: "Bucha de apoio",
        material: "Bronze SAE 660",
      },
    }),
  ]);

  const pecasCliente2 = await Promise.all([
    prisma.peca.create({
      data: {
        codigo: "PVB-001",
        clienteId: cliente2.id,
        descricao: "Flange de acoplamento",
        material: "Aço inox 304",
      },
    }),
    prisma.peca.create({
      data: {
        codigo: "PVB-002",
        clienteId: cliente2.id,
        descricao: "Suporte lateral",
        material: "Aço SAE 1020",
        tratamentoSuperficial: "Zincagem",
      },
    }),
  ]);

  const pecasCliente3 = await Promise.all([
    prisma.peca.create({
      data: {
        codigo: "TMU-001",
        clienteId: cliente3.id,
        descricao: "Pino guia",
        material: "Aço VC 131",
        tratamentoTermico: "Têmpera a Vácuo",
      },
    }),
    prisma.peca.create({
      data: {
        codigo: "TMU-002",
        clienteId: cliente3.id,
        descricao: "Base usinada",
        material: "Aço SAE 1045",
      },
    }),
  ]);

  const pecasCliente4 = await Promise.all([
    prisma.peca.create({
      data: {
        codigo: "AER-001",
        clienteId: cliente4.id,
        descricao: "Suporte aeronáutico",
        material: "Alumínio 7075",
        tratamentoSuperficial: "Anodização Dura",
      },
    }),
    prisma.peca.create({
      data: {
        codigo: "AER-002",
        clienteId: cliente4.id,
        descricao: "Placa estrutural",
        material: "Alumínio 6061",
        tratamentoSuperficial: "Anodização Natural",
      },
    }),
  ]);

  const pecasCliente5 = await Promise.all([
    prisma.peca.create({
      data: {
        codigo: "PRI-001",
        clienteId: cliente5.id,
        descricao: "Engrenagem",
        material: "Aço 8620",
        tratamentoTermico: "Cementação",
      },
    }),
    prisma.peca.create({
      data: {
        codigo: "PRI-002",
        clienteId: cliente5.id,
        descricao: "Corpo de válvula",
        material: "Aço inox 316",
      },
    }),
  ]);

  const pedido1 = await prisma.pedido.create({
    data: {
      codigo: "PED-001",
      clienteId: cliente1.id,
      status: "EM_ANDAMENTO",
      observacao: "Prioridade média",
    },
  });

  const pedido2 = await prisma.pedido.create({
    data: {
      codigo: "PED-002",
      clienteId: cliente1.id,
      status: "ABERTO",
    },
  });

  const pedido3 = await prisma.pedido.create({
    data: {
      codigo: "PED-003",
      clienteId: cliente2.id,
      status: "EM_ANDAMENTO",
    },
  });

  const pedido4 = await prisma.pedido.create({
    data: {
      codigo: "PED-004",
      clienteId: cliente3.id,
      status: "ABERTO",
    },
  });

  const pedido5 = await prisma.pedido.create({
    data: {
      codigo: "PED-005",
      clienteId: cliente4.id,
      status: "EM_ANDAMENTO",
    },
  });

  const pedido6 = await prisma.pedido.create({
    data: {
      codigo: "PED-006",
      clienteId: cliente5.id,
      status: "ABERTO",
    },
  });

  const pedido7 = await prisma.pedido.create({
    data: {
      codigo: "PED-007",
      clienteId: cliente2.id,
      status: "CONCLUIDO",
    },
  });

  const pedido8 = await prisma.pedido.create({
    data: {
      codigo: "PED-008",
      clienteId: cliente3.id,
      status: "EM_ANDAMENTO",
    },
  });

  const hoje = new Date();

  function dias(offset: number) {
    const data = new Date(hoje);
    data.setDate(data.getDate() + offset);
    return data;
  }

  const ordens = [
    {
      numero: 1001,
      pedidoId: pedido1.id,
      pecaId: pecasCliente1[0].id,
      quantidade: 10,
      horasUnitarias: 2.5,
      setores: "TORNO_MECANICO,RETIFICA,QUALIDADE",
      dataEntregaSolicitada: dias(2),
      status: "EM_ANDAMENTO" as const,
      setorAtual: "TORNO_MECANICO" as const,
      possuiRnc: false,
      possuiDevolucao: false,
    },
    {
      numero: 1002,
      pedidoId: pedido1.id,
      pecaId: pecasCliente1[1].id,
      quantidade: 15,
      horasUnitarias: 1.5,
      setores: "TORNO_CNC,AJUSTAGEM",
      dataEntregaSolicitada: dias(5),
      status: "EM_ANDAMENTO" as const,
      setorAtual: "TORNO_CNC" as const,
      possuiRnc: false,
      possuiDevolucao: false,
    },
    {
      numero: 1003,
      pedidoId: pedido2.id,
      pecaId: pecasCliente1[0].id,
      quantidade: 8,
      horasUnitarias: 3,
      setores: "FRESA_CONVENCIONAL,QUALIDADE",
      dataEntregaSolicitada: dias(8),
      status: "NAO_INICIADA" as const,
      setorAtual: "FRESA_CONVENCIONAL" as const,
      possuiRnc: false,
      possuiDevolucao: false,
    },
    {
      numero: 1004,
      pedidoId: pedido3.id,
      pecaId: pecasCliente2[0].id,
      quantidade: 20,
      horasUnitarias: 1.2,
      setores: "CENTRO_USINAGEM,QUALIDADE",
      dataEntregaSolicitada: dias(-2),
      status: "EM_ANDAMENTO" as const,
      setorAtual: "CENTRO_USINAGEM" as const,
      possuiRnc: false,
      possuiDevolucao: false,
    },
    {
      numero: 1005,
      pedidoId: pedido3.id,
      pecaId: pecasCliente2[1].id,
      quantidade: 12,
      horasUnitarias: 2,
      setores: "FRESA_CONVENCIONAL,SERVICO_EXTERNO",
      dataEntregaSolicitada: dias(3),
      status: "EM_ANDAMENTO" as const,
      setorAtual: "SERVICO_EXTERNO" as const,
      possuiRnc: false,
      possuiDevolucao: false,
    },
    {
      numero: 1006,
      pedidoId: pedido4.id,
      pecaId: pecasCliente3[0].id,
      quantidade: 30,
      horasUnitarias: 0.8,
      setores: "TORNO_CNC,RETIFICA",
      dataEntregaSolicitada: dias(10),
      status: "NAO_INICIADA" as const,
      setorAtual: "TORNO_CNC" as const,
      possuiRnc: false,
      possuiDevolucao: false,
    },
    {
      numero: 1007,
      pedidoId: pedido4.id,
      pecaId: pecasCliente3[1].id,
      quantidade: 5,
      horasUnitarias: 5,
      setores: "MANDRILHADORA,AJUSTAGEM",
      dataEntregaSolicitada: dias(6),
      status: "EM_ANDAMENTO" as const,
      setorAtual: "MANDRILHADORA" as const,
      possuiRnc: false,
      possuiDevolucao: false,
    },
    {
      numero: 1008,
      pedidoId: pedido5.id,
      pecaId: pecasCliente4[0].id,
      quantidade: 6,
      horasUnitarias: 4,
      setores: "CENTRO_USINAGEM,QUALIDADE",
      dataEntregaSolicitada: dias(-7),
      dataEntregaReal: dias(-5),
      status: "CONCLUIDA" as const,
      setorAtual: "LIBERADO" as const,
      possuiRnc: false,
      possuiDevolucao: false,
    },
    {
      numero: 1009,
      pedidoId: pedido5.id,
      pecaId: pecasCliente4[1].id,
      quantidade: 9,
      horasUnitarias: 3,
      setores: "CENTRO_USINAGEM,SERVICO_EXTERNO",
      dataEntregaSolicitada: dias(-10),
      dataEntregaReal: dias(-6),
      status: "CONCLUIDA" as const,
      setorAtual: "LIBERADO" as const,
      possuiRnc: true,
      dataRnc: dias(-5),
      possuiDevolucao: false,
    },
    {
      numero: 1010,
      pedidoId: pedido6.id,
      pecaId: pecasCliente5[0].id,
      quantidade: 18,
      horasUnitarias: 2.2,
      setores: "TORNO_CNC,QUALIDADE",
      dataEntregaSolicitada: dias(1),
      status: "EM_ANDAMENTO" as const,
      setorAtual: "QUALIDADE" as const,
      possuiRnc: false,
      possuiDevolucao: false,
    },
    {
      numero: 1011,
      pedidoId: pedido6.id,
      pecaId: pecasCliente5[1].id,
      quantidade: 11,
      horasUnitarias: 2.7,
      setores: "CENTRO_USINAGEM,AJUSTAGEM",
      dataEntregaSolicitada: dias(4),
      status: "EM_ANDAMENTO" as const,
      setorAtual: "AJUSTAGEM" as const,
      possuiRnc: false,
      possuiDevolucao: false,
    },
    {
      numero: 1012,
      pedidoId: pedido7.id,
      pecaId: pecasCliente2[0].id,
      quantidade: 14,
      horasUnitarias: 1.4,
      setores: "TORNO_MECANICO,QUALIDADE",
      dataEntregaSolicitada: dias(-15),
      dataEntregaReal: dias(-15),
      status: "CONCLUIDA" as const,
      setorAtual: "LIBERADO" as const,
      possuiRnc: false,
      possuiDevolucao: true,
      dataDevolucao: dias(-12),
    },
    {
      numero: 1013,
      pedidoId: pedido8.id,
      pecaId: pecasCliente3[0].id,
      quantidade: 25,
      horasUnitarias: 1.1,
      setores: "TORNO_CNC,RETIFICA",
      dataEntregaSolicitada: dias(-1),
      status: "EM_ANDAMENTO" as const,
      setorAtual: "RETIFICA" as const,
      possuiRnc: false,
      possuiDevolucao: false,
    },
    {
      numero: 1014,
      pedidoId: pedido8.id,
      pecaId: pecasCliente3[1].id,
      quantidade: 7,
      horasUnitarias: 4.5,
      setores: "MANDRILHADORA,AJUSTAGEM",
      dataEntregaSolicitada: dias(7),
      status: "NAO_INICIADA" as const,
      setorAtual: "MANDRILHADORA" as const,
      possuiRnc: false,
      possuiDevolucao: false,
    },
    {
      numero: 1015,
      pedidoId: pedido2.id,
      pecaId: pecasCliente1[1].id,
      quantidade: 16,
      horasUnitarias: 1.8,
      setores: "TORNO_MECANICO,AJUSTAGEM",
      dataEntregaSolicitada: dias(-12),
      dataEntregaReal: dias(-8),
      status: "CONCLUIDA" as const,
      setorAtual: "LIBERADO" as const,
      possuiRnc: true,
      dataRnc: dias(-7),
      possuiDevolucao: true,
      dataDevolucao: dias(-5),
    },
  ];

  for (const ordem of ordens) {
    await prisma.ordemServico.create({
      data: {
        ...ordem,
        horasTotais: ordem.quantidade * ordem.horasUnitarias,
      },
    });
  }

  console.log("Seed concluído com sucesso.");
  console.log("Login: marcus@email.com");
  console.log("Senha: 12345678");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });