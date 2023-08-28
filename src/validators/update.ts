import { body } from "express-validator";

export const validateCreateUpdateNote = [
  body("title").exists().isString(),
  body("body").exists().isString(),
  body("productId").exists().isString(),
  body("status").isIn(["IN_PROGRESS", "SHIPPED", "DEPRECATED"]),
  body("version").optional(),
];

export const validateUpdateUpdateNote = [
  body("title").optional(),
  body("body").optional(),
  body("status").isIn(["IN_PROGRESS", "SHIPPED", "DEPRECATED"]),
  body("version").optional(),
];
