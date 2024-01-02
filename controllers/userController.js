import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";

let userData = {};

export const getCurrentUser = async (req, res) => {
  console.log("User jwt", req.user);

  userData = req.user;
  getUserData();
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export function getUserData() {
  console.log("getUserData", userData);
  const { userId, phoneNumber } = userData;
  console.log(`Phone user ${phoneNumber}`);
  console.log(`User ID ${userId}`);
  return userData;
}
