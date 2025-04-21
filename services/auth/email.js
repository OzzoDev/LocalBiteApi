import nodemailer from "nodemailer";
import { EmailError } from "../../errors/AuthErrors.js";
import { verifyEmailLayout } from "../../utils/templates/verifyEmailTemplate.js";

const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export const sendEmail = async (recipientEmail, subject, text, html) => {
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
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch {
    throw new EmailError();
  }
};
export const verifyEmail = async (recipientEmail, username, otp) => {
  const subject = "Verify your email";
  const text = `Hi ${username}! To successfully register your account use this code to verify your account`;
  const html = verifyEmailLayout(subject, text, otp);

  await sendEmail(recipientEmail, subject, text, html);
};
