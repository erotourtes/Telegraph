import { RequestHandler } from "express";

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email, password);
  const token = "future token";
  res.status(200).json({ status: "success", token });
};

export const signup: RequestHandler = async (req, res, next) => {};
