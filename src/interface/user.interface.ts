import mongoose, {
  Types,
  type QueryFilter,
  type QueryOptions,
  type UpdateQuery,
} from "mongoose";
export enum UserRole {
  DELETED = "deleted",
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
  create(data: Partial<IUser>): Promise<IUser>;
  find(filter: QueryFilter<IUser>): Promise<IUser[]>;
  findById(
    id: string | Types.ObjectId,
    session?: mongoose.ClientSession,
  ): Promise<IUser | null>;
  findByIdWithRefreshToken(
    id: string | Types.ObjectId,
    session?: mongoose.ClientSession,
  ): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByRefreshToken(refreshToken: string): Promise<IUser | null>;
  findOneAndUpdate(
    filter: QueryFilter<IUser>,
    data: UpdateQuery<IUser>,
    options: QueryOptions,
  ): Promise<IUser | null>;
  update(
    id: string | Types.ObjectId,
    data: UpdateQuery<IUser>,
    session?: mongoose.ClientSession,
  ): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}
