import { Schema, model, Document } from "mongoose";
import { type IUser, UserRole } from "../interface/user.interface.js";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    picture: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// sign a JWT Access token for the user document
userSchema.methods.signAccessToken = function (this: IUser) {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    config.access_token_secret,
    {
      expiresIn: config.access_token_expires,
    } as jwt.SignOptions,
  );
};
// sign a JWT Refresh token for the user document
userSchema.methods.signRefreshToken = function (this: IUser) {
  return jwt.sign(
    {
      _id: this._id,
    },
    config.refresh_token_secret,
    {
      expiresIn: config.refresh_token_expires,
    } as jwt.SignOptions,
  );
};

// compare JWT refresh token for the User document
userSchema.methods.compareRefreshToken = function (this: IUser, token: string) {
  if (!this.refreshToken) {
    throw new Error("Refresh token is required");
  }
  return bcrypt.compareSync(this.refreshToken, token);
};
export default model<IUser>("User", userSchema);
