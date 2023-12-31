import { Router } from "express";
import { getCurrentUser } from "../controllers/userController.js";
const router = Router();

router.get("/current-user", getCurrentUser);
// router.patch(
//   "/update-user",
//   checkForTestUser,
//   upload.single("avatar"),
//   validateUpdateUserInput,
//   updateUser
// );

export default router;
