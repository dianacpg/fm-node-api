import { body } from "express-validator";

export const validateProduct = body("name").isString();
