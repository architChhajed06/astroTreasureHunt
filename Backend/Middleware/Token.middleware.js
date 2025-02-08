import jwt from "jsonwebtoken";
import User from "../Model/User.js";

const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    { userId: userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return refreshToken;
};

const generateAccessToken = (userId) => {
  const accessToken = jwt.sign(
    { userId: userId },
    process.env.JWT_ACCESS_SECRET,
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
      console.log("Decoded JWT: ", decoded);
      req.user = await User.findById(decoded.userId);

      const newAccessToken = generateAccessToken(req.user._id);

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
      req.user = await User.findById(decoded.userId);
      console.log("Decoded JWT: ", decoded);
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid access token" });
    }
  }
};


const protectedAdminRoutes = async (req, res, next) => {
  try{

    const user = req.user;
    console.log("USER IS ", req.user.role)
    if(user.role !== "admin"){
      console.log(req.user.email, "IS NOT AN ADMIN", req.user.role);
      return res.status(401).json({message: "This is a protected route. Only admins are authorized"})
    }
    next();
  }
  catch(error){
    return res.status(500).json({message: "Error in protectedAdminRoutes", error: error.message,
      completeError: error})
  }
}

export { auth, generateAccessToken, generateRefreshToken, protectedAdminRoutes };
