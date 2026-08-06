import { Router } from "express";
import { create, findAll, findById, remove, update, patchStatusAndSetor } from "../controllers/ordemServico.controller.js";

const router = Router();

router.post (
   "/", create
)

router.get (
   "/", findAll 
);

router.get(
   "/:id", findById
);

router.put(
   "/:id", update
)

router.delete(
   "/:id", remove
)

router.patch(
  "/:id", patchStatusAndSetor,
);
export default router;