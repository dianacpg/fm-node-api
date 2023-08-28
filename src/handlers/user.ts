import { Request, Response, NextFunction } from "express";
import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";
import { CustomError } from "../utils/custom-error";

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });
    const token = createJWT(user);
    res.json({ token });
  } catch (e) {
    const customError = new CustomError((e as Error).message, "input");
    next(customError);
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      res.status(401).json({ message: "User not found." });
      return;
    }

    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      res.status(401).json({ message: "Password is incorrect." });
      return;
    }

    const token = createJWT(user);
    res.json({ token });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ message: "An error occurred during sign in." });
  }
};
