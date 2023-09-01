import { ErrorRequestHandler } from "express";

const errorController: ErrorRequestHandler = async (err, req, res) => {
  if (process.env.NODE_ENV === "poroduction")
    return res
      .status(500)
      .json({ status: 500, message: "Something went wrong" });

  res.status(500).json({
    status: 500,
    message: err.message,
  });

  console.log("error controller", err);
};

export default errorController;
