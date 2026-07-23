import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { publishToQueue } from "../broker/rabbit.js";

export async function registerUser(req, res) {
  const {
    email,
    password,
    fullName: { firstName, lastName },
  } = req.body;

  const isUserAlreadyExist = await userModel.findOne({ email });

  if (isUserAlreadyExist) {
    return (res, status(400).json({ message: "User already exists" }));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email,
    password: hashedPassword,
    fullName: { firstName, lastName },
  });

  await user.save();

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      fullName: user.fullName,
    },
    config.JWT_SECRET,
    { expiresIn: "2d" },
  );

  await publishToQueue("user_registered", {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  });

  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  });
}

export async function googleAuthCallback(req, res) {
  const user = req.user;

  if (!user || !user.emails?.length) {
    return res.status(400).json({
      message: "Google authentication failed.....",
    });
  }

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ email: user.emails[0].value }, { googleId: user.id }],
  });

  if (isUserAlreadyExist) {
    const token = jwt.sign(
      {
        id: isUserAlreadyExist._id,
        role: isUserAlreadyExist.role,
        fullName: isUserAlreadyExist.fullName,
      },
      config.JWT_SECRET,
      { expiresIn: "2d" },
    );

    res.cookie("token", token);

    return res.redirect("http://localhost:5173/"); // Redirect to the frontend after successful login
  }

  const newUser = await userModel.create({
    googleId: user.id,
    email: user.emails[0].value,
    fullName: {
      firstName: user.name.givenName,
      lastName: user.name.familyName,
    },
  });

  await publishToQueue("user_registered", {
    id: newUser._id,
    email: newUser.email,
    fullName: newUser.fullName,
    role: newUser.role,
  });

  const token = jwt.sign(
    {
      id: newUser._id,
      role: newUser.role,
      fullName: newUser.fullName,
    },
    config.JWT_SECRET,
    { expiresIn: "2d" },
  );

  res.cookie("token", token);

  return res.redirect("http://localhost:5173/"); // Redirect to the frontend after successful login
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      fullName: user.fullName,
    },
    config.JWT_SECRET,
    { expiresIn: "2d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged-In successfully",
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  });
}
