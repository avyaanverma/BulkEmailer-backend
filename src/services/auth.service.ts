import { google } from "googleapis";
import { config } from "../config/config.js";
import type { IUser } from "../interface/user.interface.js";
import type { Response } from "express";
import userDao from "../dao/user.dao.js";

import ResponseHandler from "../utils/response.handler.js";
import ErrorHandler from "../utils/error-handler.js";

// Google OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  config.google_client_id,
  config.google_client_secret,
  config.google_redirect_url,
);

// Google Profile
interface IGoogleProfilePayload {
  email: string;
  name: string;
  picture?: string;
}

class AuthService {
  /**
   * Google Login
   */
  async googleLogin(token: string, res: Response) {
    const ticket = await this.verifyGoogleToken(token);

    const profile = this.extractGoogleProfile(ticket);

    const user = await this.socialLogin(profile);

    return user;
  }

  /**
   * Verify Google Token
   */
  private async verifyGoogleToken(token: string) {
    if (!token) {
      throw new ErrorHandler({
        statusCode: 400,
        message: "Google token is required",
        errorCode: "GOOGLE_TOKEN_REQUIRED",
      });
    }

    return oauth2Client.verifyIdToken({
      idToken: token,
      audience: config.google_client_id,
    });
  }

  /**
   * Extract Google Profile
   *
   * NOTE:
   * Don't use LoginTicket here because googleapis and
   * google-auth-library may install different versions.
   */
  private extractGoogleProfile(ticket: any): IGoogleProfilePayload {
    const payload = ticket.getPayload();

    if (!payload) {
      throw new ErrorHandler({
        statusCode: 401,
        message: "Invalid Google token",
        errorCode: "INVALID_GOOGLE_TOKEN",
      });
    }

    if (!payload.email_verified) {
      throw new ErrorHandler({
        statusCode: 401,
        message: "Google email is not verified",
        errorCode: "EMAIL_NOT_VERIFIED",
      });
    }

    if (!payload.email || !payload.name) {
      throw new ErrorHandler({
        statusCode: 400,
        message: "Email and name are required",
        errorCode: "INVALID_GOOGLE_PROFILE",
      });
    }

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  }

  /**
   * Social Login
   */
  private async socialLogin(profile: IGoogleProfilePayload): Promise<IUser> {
    const user = await userDao.findByEmail(profile.email);

    if (user) {
      return user;
    }

    return this.createGoogleUser(profile);
  }

  /**
   * Create Google User
   */
  private async createGoogleUser(
    profile: IGoogleProfilePayload,
  ): Promise<IUser> {
    const data: Partial<IUser> = {
      email: profile.email,
      name: profile.name,
    };

    if (profile.picture) {
      data.picture = profile.picture;
    }

    const user = await userDao.create(data);

    if (!user) {
      throw new ErrorHandler({
        statusCode: 500,
        message: "Unable to create user",
        errorCode: "USER_CREATION_FAILED",
      });
    }

    return user;
  }
}

export default new AuthService();
