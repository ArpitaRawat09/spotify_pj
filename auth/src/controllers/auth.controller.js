import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function registerUser(req, res) {
  const {
    email,
    password,
    fullname: { firstName, lastName },
  } = req.body;

  const isUserAlreadyExist = await userModel.findOne({ email });

  if (isUserAlreadyExist) {
    return (res, status(400).json({ message: "User already exists" }));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new userModel({
    email,
    password: hashedPassword,
    fullName: { firstName, lastName },
  });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    config.JWT_SECRET,
    (expiresIn = "2d"),
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "USer registered successfully",
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  });
}
