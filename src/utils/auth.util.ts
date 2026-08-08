import { config } from "../config/config.js";
import type { IUser } from "../interface/user.interface.js";
import type { Response } from "express";
import bcrypt from "bcryptjs";
import userDao from "../dao/user.dao.js";
import ms from "ms";
// interface for token options
interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "none" | "lax" | undefined;
}
const isProd = config.node_env === "production";
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + config.refresh_token_expires),
  maxAge: config.refresh_token_expires,
  httpOnly: isProd,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + config.refresh_token_expires),
  maxAge: config.refresh_token_expires,
  httpOnly: isProd,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};

export const sendAuthToken = async (user: IUser, res: Response) => {
  // sign tokens
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  // hash refresh token
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  // update in user db
  await userDao.update(user._id, {
    refreshToken: hashedRefreshToken,
  });

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  return {
    user,
  };
};
