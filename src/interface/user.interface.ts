export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "superAdmin",
}

export interface IUser extends Document {
  _id: string;
  refreshToken?: string;
  name: string;
  email: string;
  picture?: string;
  role: UserRole;
  isActive: boolean;
  signAccessToken(): string;
  signRefreshToken(): string;
  compareRefreshToken(refreshToken: string): Promise<boolean>;
}

export interface IUserDao {
  findByGoogleId(googleId: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(data: Partial<IUser>): Promise<IUser | null>;
}
