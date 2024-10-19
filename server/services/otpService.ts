import crypto from "crypto";
import nodemailer from "nodemailer";

import { type MailOptions } from "nodemailer/lib/json-transport";

export type OTPResponse = {
  success: boolean;
  error?: string;
};

// nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

export const sendOTP = async (email: string): Promise<OTPResponse> => {
  // generate 6 digit randomIntString
  const otp = crypto.randomInt(100000, 999999).toString();

  // configure nodemailer transport options
  const mailOptions: MailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  };

  // send OPT email
  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error" };
  }
};
