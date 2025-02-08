import User from "../Model/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../Middleware/Token.middleware.js";
import bcrypt from "bcrypt";
import twilio from "twilio";
import crypto from "crypto";

const expiresPlayerString = "100h";
const expiresAdminString = "1000h";
const expiresTeamLeaderString = "100h";

const getExpiresTime = (role) => {
  const expiresMap = {
    player: expiresPlayerString,
    admin: expiresAdminString,
    team_leader: expiresTeamLeaderString,
  };
  return expiresMap[role] || expiresPlayerString; // default to player expiry time
};

// In-memory storage for temporary registration data
const tempUserStore = new Map();

// Add OTP generation function
const generateOTP = () => {
  // Generate 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Initialize Twilio client using environment variables
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Add this function to send SMS
const sendSMS = async (phoneNumber, message) => {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`, // Adding India country code
    });
    console.log("SMS sent successfully:", response.sid);
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw new Error("Failed to send SMS");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("ENTERED THE LOGIN FUNCTION");
    const user = await User.findOne({ email });
    console.log("USER FOUND", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    console.log("GENERATING ACCESS TOKEN");
    const accessToken = generateAccessToken(user._id);
    console.log("ACCESS TOKEN GENERATED", accessToken);
    const refreshToken = generateRefreshToken(user._id);
    console.log("REFRESH TOKEN GENERATED", refreshToken);

    //Set access token in cookie
    console.log("SETTING ACCESS TOKEN IN COOKIE");
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 15 minutes
    });

    //Set refresh token in cookie
    console.log("SETTING REFRESH TOKEN IN COOKIE");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    //Update user with refresh token
    console.log("UPDATING USER WITH REFRESH TOKEN");
    user.refreshToken = refreshToken;
    await user.save();
    console.log("USER UPDATED WITH REFRESH TOKEN");


    // Return user info (excluding sensitive data)
    console.log("RETURNING USER INFO");
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

// Add a logout function
const logout = async (req, res) => {
  try {
    //Clear access token and refresh token from cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      error: error.message,
    });
  }
};

const register = async (req, res) => {
  const { name, email, rollNo, phoneNo, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  //Send an OTP to the user's phone number using Trello
  //Await User's confirmation of the OTP
  //If OTP is confirmed, create a new user

  const newUser = new User({
    name,
    email,
    rollNo,
    phoneNo,
    password: hashedPassword,
  });
  await newUser.save();

  return res.status(201).json({ message: "User created successfully" });
};

const verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
};

const showTempDataStorage = async (req, res) => {
  console.log("Temp user data storage:", tempUserStore);
  return res.status(200).json({ message: "Temp user data storage", tempUserStore });
};

// Step 1: Initiate registration and send OTP

const initiateRegister = async (req, res) => {
  try {
    const { name, email, rollNo, phoneNo, password } = req.body;

    //check if email belongs to domain id
    if(!isValidDomainID(email)){
      return res.status(400).json({message: "Domain ID must belong to NIT KKR."});
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP and registration token
    const newOTP = generateOTP();
    const registrationToken = crypto.randomBytes(32).toString("hex");

    // Store user data temporarily
    const tempUserData = {
      name,
      email,
      rollNo,
      phoneNo,
      password: await bcrypt.hash(password, 10),
      timestamp: Date.now(),
      otp: newOTP,
    };

    // Store registration data
    tempUserStore.set(registrationToken, tempUserData);

    // Set registration token in cookie
    res.cookie("registrationToken", registrationToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60 * 1000, // 10 minutes
      sameSite: "strict",
    });

    // Send OTP via SMS
    const message = `Your OTP for registration is: ${newOTP}. Valid for 10 minutes.`; //will send this message to email
    await sendEmail(email, message);

    return res.status(200).json({
      message: "OTP sent successfully to your domain ID", //replace this with email
      tempOTP: newOTP, // Remove this in production, only for testing
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to initiate registration",
      error: error.message,
    });
  }
};

// Step 2: Verify OTP and complete registration
const verifyAndRegister = async (req, res) => {
  const { otp } = req.body;
  const registrationToken = req.cookies.registrationToken;

  if (!registrationToken) {
    return res.status(400).json({
      message: "Registration session expired or invalid",
    });
  }
  console.log("Registration token:", registrationToken);

  // Get stored registration data using token
  const tempUserData = tempUserStore.get(registrationToken);
  console.log("Temp user data:", tempUserData);
  if (!tempUserData) {
    // Clear invalid cookie
    res.clearCookie("registrationToken");
    return res.status(400).json({
      message: "Registration session expired or invalid",
    });
  }

  if (tempUserData.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    console.log("OTP is valid");
    // Create and save new user
    const { otp: _, timestamp: __, ...userData } = tempUserData;
    console.log("User data:", userData);

    //Generate a new access token
    console.log("Generating access token");
    console.log("User data id:", userData);
    const accessToken = generateAccessToken(userData._id);
    console.log("Access Token generated by generateAccessToken");
    const refreshToken = generateRefreshToken(userData._id);
    console.log("Access token:", accessToken);
    console.log("Refresh token:", refreshToken);
    //Update user with refresh token
    userData.refreshToken = refreshToken;
    console.log("User data:", userData);
    //Create a new user
    console.log("Creating a new user");
    const newUser = new User({
      ...userData,
      isPhoneVerified: true,
    });
    console.log("New user:", newUser);
    await newUser.save();
    console.log("User saved");

    //Set access token in cookie
    console.log("Setting access token in cookie");
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 15 minutes
    });
    console.log("Access token set in cookie");
    //Set refresh token in cookie
    console.log("Setting refresh token in cookie");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    console.log("Refresh token set in cookie");

    // Clear temporary storage and cookie
    console.log("Clearing temporary storage and cookie");
    tempUserStore.delete(registrationToken);
    console.log("Temporary storage cleared");
    res.clearCookie("registrationToken");
    console.log("Registration token cleared from cookie");

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

export {
  login,
  logout,
  initiateRegister,
  verifyAndRegister,
  showTempDataStorage
  // ... other exports
};
