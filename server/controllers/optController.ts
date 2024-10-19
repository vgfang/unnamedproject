import { type Response, type Request } from "express";
import * as OptService from "../services/otpService";

export const sendOPT = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({
      error: "Email is required",
    });
    return;
  }

  const response: OptService.OTPResponse = await OptService.sendOTP(email);

  if (response.success) {
    res.send(200).json({
      message: "OPT sent successfully",
    });
    return;
  } else {
    res.send(500).json({
      error: response.error || "Failed to send OTP",
    });
    return;
  }
};
