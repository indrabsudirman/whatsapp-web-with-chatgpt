import { Router } from "express";
import { getQRCode } from "../controllers/whatsappController.js";
const router = Router();

router.get("/", getQRCode);
// router.patch(
//   "/update-user",
//   checkForTestUser,
//   upload.single("avatar"),
//   validateUpdateUserInput,
//   updateUser
// );

export default router;
