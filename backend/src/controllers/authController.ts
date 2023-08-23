import { RequestHandler } from "express";
import * as userService from "../services/userService.js";
import { getJWTToken, verifyJWTToken } from "../Utils/utils.js";

export const signin: RequestHandler = async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (token) {
    const decoded = await verifyJWTToken(token);
    console.log("decoded token is ", decoded);
    // TODO: use token to get a user
  }

  await userService
    .login(req)
    .then((user) => {
      const token = getJWTToken(user.user_id);
      res.status(200).json({ status: "success", token, data: { user } });
    })
    .catch((err) => {
      console.log(err);

      res
        .status(401)
        .json({ success: false, message: "Invalid credentials", data: {} });
    });
};

export const signup: RequestHandler = async (req, res, next) => {
  await userService
    .signup(req)
    .then((user) => {
      const token = getJWTToken(user.user_id);

      res
        .cookie("jwt", token, {
          expires: new Date(Date.now() + 900000), // TODO: use env variable
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
        })
        .status(201)
        .json({
          success: true,
          token,
          data: { user },
          message: "User created",
        });
    })
    .catch((err) => {
      console.log(err);

      if (err.code === "ER_DUP_ENTRY") {
        const entry = err.message.split("users.")[1];

        res.status(409).json({
          success: false,
          message: `${entry} is already taken`,
          data: {},
        });
      } else
        res.status(500).json({
          success: false,
          message: `Something went wrong ${err.message}`,
          data: {},
        });
    });
};

export const protect: RequestHandler = async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return next(new Error("No Token provided"));
  }

  const decoded = await verifyJWTToken(token);

  console.log("passing", decoded);

  next();
  // return next(new AppError("No Token provided", 401));

  // await userService
  //   .getUser(req)
  //   .then((user) => {
  //     res.status(200).json({ success: true, data: { user } });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //
  //     res.status(500).json({
  //       success: false,
  //       message: `Something went wrong ${err.message}`,
  //       data: {},
  //     });
  //   });
};
