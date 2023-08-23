import { RequestHandler } from "express";
import * as userService from "../services/userService.js";
import { getJWTToken } from "../Utils/utils.js";

export const login: RequestHandler = async (req, res, next) => {
  await userService
    .login(req)
    .then((user) => {
      const token = getJWTToken(user.id);
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
      const token = getJWTToken(user.id);

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

export const getUser: RequestHandler = async (req, res, next) => {
  console.log(req.cookies.jwt);
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
