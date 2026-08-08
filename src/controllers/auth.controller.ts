import type { Request, Response } from "express";
import AuthService from "../services/auth.service.js";
import ResponseHandler from "../utils/response.handler.js";
import { sendAuthToken } from "../utils/auth.util.js";

class AuthController {
  async googleLogin(req: Request, res: Response) {
    const { token } = req.body as { token: string };
    const user = await AuthService.googleLogin(token, res);

    if (user) {
      await sendAuthToken(user, res);
    }

    return ResponseHandler.success(
      {
        user: user,
      },
      "Login successful",
    );
  }
}

export default new AuthController();
