"use server";

import connectToDB from "@/lib/db.js";
import User from "@/models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "DEFAULT_KEY";

// Helper function to set cookies
const setCookie = (res, name, value, options = {}) => {
  const cookieOptions = {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    ...options,
  };

  const cookieString = Object.entries(cookieOptions)
    .map(([key, val]) => (val === true ? key : `${key}=${val}`))
    .join("; ");

  res.setHeader("Set-Cookie", `${name}=${value}; ${cookieString}`);
};

// Register User
export async function registerUserAction(formData) {
  await connectToDB();
  try {
    const { username, password } = formData;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return {
        success: false,
        message: "User already exists! Please try with a different username.",
      };
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(savedUser)),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong! Please try again.",
    };
  }
}

// Login User
export async function loginUserAction(formData, res) {
  await connectToDB();
  try {
    const { username, password } = formData;

    const user = await User.findOne({ username });
    if (!user) {
      return {
        success: false,
        message: "User does not exist! Please sign up.",
      };
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Incorrect password. Please try again.",
      };
    }

    const tokenData = { id: user._id, username: user.username };
    const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "30d" });

    setCookie(res, "token", token, { maxAge: 30 * 24 * 60 * 60 });

    return {
      success: true,
      message: "Login successful.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong! Please try again.",
    };
  }
}

// Fetch Authenticated User
export async function fetchAuthUserAction(req) {
  await connectToDB();
  try {
    const token = req.cookies?.token || "";
    if (!token) {
      return { success: false, message: "Token is invalid" };
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decodedToken.id });

    if (user) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(user)),
      };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Invalid token or server error" };
  }
}

// Logout
export async function logoutAction(res) {
  setCookie(res, "token", "", { maxAge: -1 });
  return { success: true, message: "Logged out successfully." };
}
