import { findById } from "../controllers/cliente.controller.js";
import { create, findAll, remove, update } from "../controllers/peca.controller.js";
import { Router } from "express";

const router = Router();

router.post(
    "/", create
);

router.get(
    "/", findAll
);

router.get(
    "/:id", findById
);

router.put(
    "/:id", update
);

router.delete(
    "/:id", remove
)

export default router;