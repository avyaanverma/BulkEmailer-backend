import userModel from "../model/user.model.js";
import {
  type IUser,
  type IUserDao,
  UserRole,
} from "../interface/user.interface.js";
import mongoose, {
  type QueryFilter,
  type QueryOptions,
  Types,
  type UpdateQuery,
} from "mongoose";

class UserDao implements IUserDao {
  create(data: Partial<IUser>) {
    return userModel.create(data);
  }
  find(filter: QueryFilter<IUser>) {
    return userModel.find(filter);
  }
  findById(id: string | Types.ObjectId) {
    return userModel.findById(id);
  }
  findByIdWithRefreshToken(id: string | Types.ObjectId) {
    return userModel.findById(id).select("+refreshToken").exec();
  }
  findByEmail(email: string, session?: mongoose.ClientSession) {
    const query = userModel.findOne({ email: email.trim().toLowerCase() });
    4;
    if (session) {
      query.session(session);
    }

    return query.exec();
  }
  findByRefreshToken(refreshToken: string) {
    return userModel.findOne({ refreshToken });
  }
  findOneAndUpdate(
    filter: QueryFilter<IUser>,
    data: Partial<IUser>,
    options: QueryOptions = {
      new: true,
      runValidators: true,
    },
  ) {
    return userModel.findOneAndUpdate(filter, data, options);
  }
  update(
    id: string | Types.ObjectId,
    data: UpdateQuery<IUser>,
    session?: mongoose.ClientSession,
  ) {
    const query = userModel.findByIdAndUpdate(id, data);
    if (session) {
      query.session(session);
    }
    return query.exec();
  }
  async delete(id: string | Types.ObjectId) {
    const result = await userModel.findByIdAndUpdate(
      id,
      { role: UserRole.DELETED },
      { new: true },
    );
    return !!result;
  }
}

export default new UserDao();
