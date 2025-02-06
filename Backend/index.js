import express from "express";
import dotenv from "dotenv";
import { connect } from "./Configuration/Database.js";
import routes from "./Route/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Load environment variables before any other imports
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Database connection
connect();

// Routes
app.use("/api", routes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Hello World",
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
