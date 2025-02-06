import express from "express";
import { auth } from "../Middleware/Token.middleware.js";
import {
  login,
  logout,
  initiateRegister,
  verifyAndRegister,
  showTempDataStorage,
} from "../Controller/user_admin.controller.js";
const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register/initiate", initiateRegister);
router.post("/register/verify", verifyAndRegister);
router.get("/showTempDataStorage", showTempDataStorage);

// Example of protected route using verifyToken middleware
router.get("/profile", auth, async (req, res) => {
  // Access user info from req.user
  // Handle profile logic
});

export default router;
