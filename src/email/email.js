import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";
import jwt from "jsonwebtoken";

export default async function sendEmail(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: "omarabdelstar2002@gmail.com",
      pass: "skpr mcdt aixm ltrh",
    },
  });

  const emailToken = jwt.sign(email, "newemail");

  const info = await transporter.sendMail({
    from: '"Note APP" <omarabdelstar2002@gmail.com>',
    to: email,
    subject: "Hello ✔",
    text: "Hello world?",
    html: emailTemplate(emailToken),
  });
}
