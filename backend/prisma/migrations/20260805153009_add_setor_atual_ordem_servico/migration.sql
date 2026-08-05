/*
  Warnings:

  - You are about to drop the column `dataConclusao` on the `OrdemServico` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SetorOrdemServico" AS ENUM ('TORNO_MECANICO', 'TORNO_CNC', 'CENTRO_USINAGEM', 'FRESA_CONVENCIONAL', 'MANDRILHADORA', 'RETIFICA', 'ROSQUEADEIRA', 'AJUSTAGEM', 'SERVICO_EXTERNO');

-- AlterTable
ALTER TABLE "OrdemServico" DROP COLUMN "dataConclusao",
ADD COLUMN     "setorAtual" "SetorOrdemServico";
