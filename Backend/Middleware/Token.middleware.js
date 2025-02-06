import jwt from "jsonwebtoken";
import User from "../Model/User.js";

const generateRefreshToken = (userDetails) => {
  const refreshToken = jwt.sign(
    { userDetails },
    process.env.JWT_REFRESH_SECRET, // Changed from JWT_SECRET
    {
      expiresIn: "7d",
    }
  );
  return refreshToken;
};

const generateAccessToken = (userDetails) => {
  const accessToken = jwt.sign(
    { userDetails },
    process.env.JWT_ACCESS_SECRET, // Changed from JWT_SECRET
    {
      expiresIn: "1h",
    }
  );
  return accessToken;
};

const auth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      console.log("Decoded JWT: ",decoded);
      req.user = decoded;

      const newAccessToken = generateAccessToken(req.user.userId);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;
      console.log("Decoded JWT: ",decoded);
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid access token" });
    }
  }
};

export { auth, generateAccessToken, generateRefreshToken };
