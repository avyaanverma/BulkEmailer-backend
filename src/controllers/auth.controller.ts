import type { Request, Response } from "express";

import AuthService from "../services/auth.service.js";

class AuthController {
  /**
   * Google Login
   */
  async googleLogin(req: Request, res: Response) {
    const response = await AuthService.googleLogin(req.body);

    return response.send(res);
  }
}

export default new AuthController();
