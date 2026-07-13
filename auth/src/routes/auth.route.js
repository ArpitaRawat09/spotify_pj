import express from "express";
import * as authController from "../controllers/auth.controller.js";
import * as validationRules from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post(
  "/register",
  validationRules.registerUserValidationRules,
  authController.registerUser,
);

export default router;
