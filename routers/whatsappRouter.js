import { Router } from "express";
const router = Router();
import { initWhatsApp } from "../controllers/whatsappController.js";

router.get("/init", initWhatsApp);

export default router;
