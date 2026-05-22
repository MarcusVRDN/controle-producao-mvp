-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('ABERTO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusOrdemServico" AS ENUM ('NAO_INICIADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "contato" TEXT,
    "telefone" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peca" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "tratamentoSuperficial" TEXT NOT NULL,
    "tratamentoTermico" TEXT NOT NULL,
    "terceirizacao" TEXT NOT NULL,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Peca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "status" "StatusPedido" NOT NULL DEFAULT 'ABERTO',
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdemServico" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "pecaId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "horasUnitarias" DOUBLE PRECISION NOT NULL,
    "horasTotais" DOUBLE PRECISION NOT NULL,
    "setores" TEXT NOT NULL,
    "dataEntregaSolicitada" TIMESTAMP(3) NOT NULL,
    "dataEntregaReal" TIMESTAMP(3),
    "observacao" TEXT,
    "status" "StatusOrdemServico" NOT NULL DEFAULT 'NAO_INICIADA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdemServico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cnpj_key" ON "Cliente"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Peca_codigo_clienteId_key" ON "Peca"("codigo", "clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_codigo_key" ON "Pedido"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "OrdemServico_numero_key" ON "OrdemServico"("numero");

-- AddForeignKey
ALTER TABLE "Peca" ADD CONSTRAINT "Peca_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_pecaId_fkey" FOREIGN KEY ("pecaId") REFERENCES "Peca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
