import { Router } from "express";
import { create , findAll, findById, remove, update } from "../controllers/pedido.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.post (
    "/", create
)

router.get (
    "/", findAll
);

router.get (
    "/:id", findById
)

router.put (
    "/:id", update
)

router.delete (
    "/:id", remove
)
export default router;