-- AlterTable
ALTER TABLE "OrdemServico" ADD COLUMN     "dataConclusao" TIMESTAMP(3),
ADD COLUMN     "dataDevolucao" TIMESTAMP(3),
ADD COLUMN     "dataRnc" TIMESTAMP(3),
ADD COLUMN     "possuiDevolucao" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "possuiRnc" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Peca" ALTER COLUMN "tratamentoSuperficial" DROP NOT NULL,
ALTER COLUMN "tratamentoTermico" DROP NOT NULL,
ALTER COLUMN "terceirizacao" DROP NOT NULL;
