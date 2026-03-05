import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateSignin, validateSignup } from "../middleware/validation.js";
import sendEmail from "../email/email.js";
import transporter from "../email/transporter.js";
import { forgotPasswordTemplate } from "../email/forgotPasswordTemplate.js";

export const signup = async (req, res) => {
  try {
    const valid = validateSignup(req.body);

    if (!valid) {
      return res.status(400).json({
        timestamp: new Date(),
        success: false,
        errors: validateSignup.errors,
      });
    }

    const { name, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        timestamp: new Date(),
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    // Send confirmation email — non-blocking, log errors without failing signup
    sendEmail(user.email).catch((err) =>
      console.error("Failed to send confirmation email:", err),
    );

    // NOTE: No token is returned at signup — the user must confirm email first
    res.status(201).json({
      timestamp: new Date(),
      success: true,
      message: `Welcome ${user.name}! Please check your email to confirm your account.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isConfirmed: user.isConfirmed,
      },
    });
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(500).json({
      timestamp: new Date(),
      success: false,
      message: error.message,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const valid = validateSignin(req.body);
    if (!valid) {
      return res.status(400).json({
        timestamp: new Date(),
        success: false,
        errors: validateSignin.errors,
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        timestamp: new Date(),
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        timestamp: new Date(),
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isConfirmed) {
      return res.status(401).json({
        timestamp: new Date(),
        success: false,
        message: "Please verify your email before signing in",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" },
    );

    res.status(200).json({
      timestamp: new Date(),
      success: true,
      message: `Welcome back ${user.name}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(500).json({
      timestamp: new Date(),
      success: false,
      message: error.message,
    });
  }
};

// export const verifyEmail = async (req, res) => {
//   const secret = process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET;

//   jwt.verify(req.params.token, secret, async (err, decoded) => {
//     if (err) {
//       return res.status(401).json({
//         timestamp: new Date(),
//         success: false,
//         message: "Verification link is invalid or has expired.",
//       });
//     }

//     // decoded is { email: '...' }
//     const user = await User.findOneAndUpdate(
//       { email: decoded.email },
//       { isConfirmed: true },
//       { new: true },
//     );

//     if (!user) {
//       return res.status(404).json({
//         timestamp: new Date(),
//         success: false,
//         message: "No account found for this email.",
//       });
//     }

//     res.status(200).json({
//       timestamp: new Date(),
//       success: true,
//       message: "Email verified successfully. You can now sign in.",
//     });
//   });
// };
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Use the same secret that was used to sign the token (see emailTemplate.js)
    const secret = process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    // The payload contains { email }
    const { email } = decoded;

    // Find the user by email and update the verified status
    const user = await User.findOneAndUpdate(
      { email },
      { isConfirmed: true }, // or `emailVerified: true` depending on your schema
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Verification token has expired. Please request a new one.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid verification token.",
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Server error during email verification.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Auth Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Forgot Password (sends reset link to email) ───
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Create a short-lived token (15 minutes)
    const secret = process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET;
    const resetToken = jwt.sign(
      { id: user._id, email: user.email, purpose: "password-reset" },
      secret,
      { expiresIn: "15m" },
    );

    // Send the reset email (non-blocking — respond immediately)
    transporter
      .sendMail({
        from: `"E-Commerce Store" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Reset Your Password",
        html: forgotPasswordTemplate(resetToken),
      })
      .catch((err) => console.error("Failed to send reset email:", err));

    res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// ─── Reset Password via Token (from email link) ───
export const resetPasswordByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const secret = process.env.JWT_EMAIL_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    // Make sure this token was created for password reset
    if (decoded.purpose !== "password-reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully. You can now sign in.",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Reset link has expired. Please request a new one.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid reset link.",
      });
    }

    console.error("Reset Password By Token Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
