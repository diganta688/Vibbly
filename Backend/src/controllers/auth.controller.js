import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
const isProduction = process.env.NODE_ENV === 'production';
const cookieOptions = {
  httpOnly: true,
  secure: isProduction, 
  sameSite: isProduction ? 'None' : 'Lax',
  maxAge: 24 * 60 * 60 * 1000,
};

export const signup = async (req, res) => {
  const { username, email, password, fullname } = req.body;

  try {
    if (!email || !password || !fullname || !username) {
      return res.status(400).json({ message: "All fields are required" });
    } else if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists please login" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      fullname: fullname,
      password: hashedPassword,
    });
    if (newUser) {
      const token = generateToken(newUser._id);
      res.cookie("jwt", token, cookieOptions);

      await newUser.save();
      return res
        .status(201)
        .json({ user: newUser, message: "User created successfully" });
    } else {
      return res.status(500).json({ message: "Error creating user" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error in signup" });
  }
};

export const login = async (req, res) => {
  try {
    let { username, password } = req.body;
    username = username?.trim();
    password = password?.trim();

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    let email = null;
    if (username?.includes("@")) {
      email = username.toLowerCase();
      username = null;
    }

    const conditions = [];
    if (email) conditions.push({ email });
    if (username) conditions.push({ username: username });

    if (conditions.length === 0) {
      return res.status(400).json({
        message: "Email/username is required",
      });
    }

    const user = await User.findOne({ $or: conditions });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id, res);
    res.cookie("jwt", token, cookieOptions);

    return res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
      },
      message: "Welcome back!",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
  res.clearCookie("jwt", cookieOptions);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error in logout" });
  }
  res.send("Logout Page");
};

export const updateProfile = async (req, res) => {
  const { fullname, username, email } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (req.file && req.file.path) {
      updateData.profilePicture = req.file.path;
    }
    if (updateData.username === user.username) {
      return res
        .status(400)
        .json({ message: "Username already exists choose different username" });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Error updating profile" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ user: req.user, message: "User is authenticated" });
  } catch (error) {
    return res.status(500).json({ message: "Error checking authentication" });
  }
};
