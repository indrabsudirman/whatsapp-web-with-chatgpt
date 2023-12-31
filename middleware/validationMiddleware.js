import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/customErrors.js";
import User from "../models/userModel.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);

        const firstMessage = errorMessages[0];
        console.log(Object.getPrototypeOf(firstMessage));
        if (errorMessages[0].startsWith("no message")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          throw new UnauthorizedError("not authorized to access this route");
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateRegisterInput = withValidationErrors([
  body("fullName").notEmpty().withMessage("fullName is required").trim(),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone Number is required")
    .isNumeric()
    .withMessage("Phone Number must be a number")
    .isLength({ min: 8 })
    .withMessage("Phone Number must be at least 8 numbers long")
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("Email already exists");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("The passwords do not match"),
]);

export const validateLoginInput = withValidationErrors([
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone Number is required")
    .isNumeric()
    .withMessage("Phone Number must be a number")
    .isLength({ min: 8 })
    .withMessage("Phone Number must be at least 8 numbers long"),
  body("password").notEmpty().withMessage("password is required"),
]);
