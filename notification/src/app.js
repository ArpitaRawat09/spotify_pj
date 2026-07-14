import express from "express";
import sendEmail from "./utils/email.js";
const app = express();

sendEmail(
  "rawatarpita6267@gmail.com",
  "Test Email",
  "This is a test email from Spotify Project",
  "<h1>This is a test email from Spotify Project</h1>",
);

export default app;
