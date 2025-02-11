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
  console.log("AUTH MIDDLEWARE CALLED");
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  console.log("ACCESS TOKEN: ", accessToken);
  console.log("REFRESH TOKEN: ", refreshToken);


  if (!accessToken) {
    console.log("NO ACCESS TOKEN FOUND");
    if (!refreshToken) {
      console.log("NO REFRESH TOKEN FOUND");
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      console.log("DECODING TOKEN: ");
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      console.log("Decoded JWT: 1 ", decoded);
      req.user = await User.findById(decoded.userId);
      console.log("Found user:  ", req.user);

      console.log("GENERATING NEW ACCESS TOKEN: ");
      const newAccessToken = generateAccessToken(req.user._id);
      req.newAccessToken = newAccessToken;
      console.log("NEW ACCESS TOKEN: ", newAccessToken);


      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      console.log("decoded object: ", decoded);
      req.user = await User.findById(decoded.userId);
      console.log("FOUND USER: ", req.user);
      console.log("Decoded JWT: 3", decoded);
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
