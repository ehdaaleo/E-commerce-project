import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a single reusable transporter with connection pooling
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    pool: true,
    maxConnections: 3,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export default transporter;
