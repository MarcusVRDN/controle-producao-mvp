import { create, findAll, findById, remove, update } from "../controllers/peca.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

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