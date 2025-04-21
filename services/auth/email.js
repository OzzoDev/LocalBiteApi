import nodemailer from "nodemailer";
import { EmailError } from "../../errors/AuthErrors.js";
import { emailLayout } from "../../utils/templates/verifyEmailTemplate.js";

const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export const sendEmail = async (recipientEmail, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL,
    to: recipientEmail,
    subject,
    text,
    html: emailLayout(subject, text),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch {
    throw new EmailError();
  }
};
export const verifyEmail = async (recipientEmail, username, otp) => {
  const subject = "Verify your email";
  const text = `Hi ${username}! To successfully register your account use this code to verify your account: ${otp}`;

  await sendEmail(recipientEmail, subject, text);
};
