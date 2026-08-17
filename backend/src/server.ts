import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clienteRoutes from "./routes/cliente.routes.js"
import pecaRoutes from "./routes/peca.routes.js"
import pedidoRoutes from "./routes/pedido.routes.js"
import ordemServicoRoutes from "./routes/ordemServico.routes.js"
import authRoutes from "./routes/auth.routes.js"

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);
app.use(express.json());
app.use("/clientes", clienteRoutes)
app.use("/pecas", pecaRoutes)
app.use("/pedidos", pedidoRoutes)
app.use("/ordensServico", ordemServicoRoutes)
app.use("/auth", authRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "Production Control API running"
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});