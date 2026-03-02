import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async function sendEmail(email) {
  const transporter = nodemailer.createTransport({
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Sends a verification email to the user.
     * @param {string} email - the email address of the user.
     * @returns {Promise<void>} - a promise that resolves when the email is sent.
     */
    /*******  5b7ed920-252d-4794-98cb-384256c99816  *******/ service: "gmail",
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Sign the email address into a JWT using the env secret
  const emailToken = jwt.sign(
    { email },
    process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  await transporter.sendMail({
    from: `"Note App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirm your email address",
    html: emailTemplate(emailToken),
  });
}
