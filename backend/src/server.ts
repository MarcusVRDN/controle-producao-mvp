import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clienteRoutes from "./routes/cliente.routes.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/clientes", clienteRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "Production Control API running"
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});