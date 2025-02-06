import express from "express";
import multer from "multer";
import { auth } from "../Middleware/Token.middleware.js";
import { addQuestion, addLevel, modifyQuestion } from "../Controller/admin.controller.js";
import { upload } from "../config/multer.js";

const router = express.Router();

// Use upload.single('image') middleware for image upload
router.post(
  "/addQuestion",
  auth,
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).json({
          message: "File upload error",
          error: err.message,
        });
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(500).json({
          message: "Unknown error",
          error: err.message,
        });
      }
      // Everything went fine.
      next();
    });
  },
  addQuestion
);
router.post("/addLevel", auth, addLevel);
router.patch("/modifyQuestion/:questionId", auth, modifyQuestion);


export default router;
