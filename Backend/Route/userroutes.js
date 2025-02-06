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

router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body); // Debug log
    const result = await login(req, res);
    return result;
  } catch (error) {
    console.error("Login error:", error); // Debug log
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
router.get("/getHello", (req, res) => {
  res.json({ message: "Hello World" });
});
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
