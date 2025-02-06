import express from "express";
import cors from "cors";
import session from "express-session";

const app = express();

// Increase header limits
app.use(
  cors({
    exposedHeaders: ["Content-Length", "Authorization"],
    maxAge: 600,
  })
);

// Increase payload limits
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// Add header size configuration
app.use((req, res, next) => {
  res.setHeader("Connection", "Keep-Alive");
  res.setHeader("Keep-Alive", "timeout=600");
  next();
});

app.use(
  session({
    secret: process.env.JWT_ACCESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
  })
);

// ... rest of your routes and middleware
