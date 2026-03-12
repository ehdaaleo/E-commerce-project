import transporter from "./transporter.js";
import { emailTemplate } from "./emailTemplate.js";
import jwt from "jsonwebtoken";

export default async function sendEmail(email) {
  // Sign the email address into a JWT using the env secret
  const emailToken = jwt.sign(
    { email },
    process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  await transporter.sendMail({
    from: `"E-Commerce Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirm your email address",
    html: emailTemplate(emailToken),
  });
}
