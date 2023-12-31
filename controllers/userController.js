import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
  console.log("User jwt", req.user);
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const getCurrentPhoneNumber = (req, res) => {
  console.log("User jwt", req.user);
  const { phoneNumber } = req.user;
  return phoneNumber;
};
