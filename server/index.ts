import express from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";
import session from "express-session";

import { type Express, type Response, type Request } from "express";
import type { MailOptions } from "nodemailer/lib/ses-transport";

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// sessions setup
app.use(
  session({
    secret: "4a119710-edec-4b5c-a8a7-1e2f09ed2b1e",
    resave: false,
    saveUninitialized: true,
  }),
);

// nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

app.post("/request-otp", async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email is required" });
  }

  // generate 6 digit randomIntString
  const otp = crypto.randomInt(100000, 999999).toString();

  // Send OTP via email
  const mailOptions: MailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ error: "Error sending OTP" });
    }
  });

  res.send(`OTP Sent to ${email}`);
});

// base url get
app.get("/", async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    message: "Here",
    success: true,
  });
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
