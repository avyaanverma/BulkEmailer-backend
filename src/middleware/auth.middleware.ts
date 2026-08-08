import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { config } from "../config/config.js";
import userDao from "../dao/user.dao.js";
import ErrorHandler from "../utils/error-handler.js";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new ErrorHandler({
        statusCode: 401,
        message: "Authentication required",
        errorCode: "AUTH_REQUIRED",
      });
    }

    const decoded = jwt.verify(token, config.access_token_secret) as {
      _id: string;
    };

    const user = await userDao.findById(decoded._id);

    if (!user) {
      throw new ErrorHandler({
        statusCode: 401,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    if (!user.isActive) {
      throw new ErrorHandler({
        statusCode: 403,
        message: "User account is inactive",
        errorCode: "USER_INACTIVE",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
