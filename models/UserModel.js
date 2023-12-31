import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is mandatory"],
    },
    phoneNumber: {
      type: Number,
      required: [true, "Please input your phone number"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please input your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please input valid email"],
    },
    password: {
      type: String,
      required: [true, "Please input your password"],
      minLength: [8, "Min password length is 8 character"],
      select: false,
    },
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", UserSchema);
