import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface User {
  id: string;
  createdAt: Date;
  username: string;
  password: string;
}

// Extend the Request type to include a user property
interface RequestWithUserJWT extends Request {
  user?: string | jwt.JwtPayload;
}

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string) => {
  const saltOrRounds = 10;
  return bcrypt.hash(password, saltOrRounds);
};

export const createJWT = (user: User) => {
  if (!process.env.JWT_SECRET) throw Error("unable to create jwt");
  console.log(process.env.JWT_SECRET);
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );

  return token;
};

export const protect = (
  req: RequestWithUserJWT,
  res: Response,
  next: NextFunction
) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  const bearer = req.headers.authorization;
  if (!bearer) {
    res.status(401);
    res.send("Not authorized");
    return;
  }

  const [, token] = bearer.split(" ");
  if (!token) {
    res.status(401);
    res.send("Not authorized");
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
    return;
  } catch (e) {
    console.error(e);
    res.status(401);
    res.send("Not authorized");
    return;
  }
};
