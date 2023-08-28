import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "./modules/middleware";
import {
  createProduct,
  deleteProduct,
  getOneProduct,
  getProducts,
  updateProduct,
} from "./handlers/product";
import {
  createUpdate,
  deleteUpdate,
  getOneUpdate,
  getUpdates,
  updateUpdate,
} from "./handlers/update";
import { validateProduct } from "./validators/product";
import {
  validateCreateUpdateNote,
  validateUpdateUpdateNote,
} from "./validators/update";

const router = Router();
/**
 * Product
 */
router.get("/product", getProducts);
router.get("/product/:id", getOneProduct);
router.put("/product/:id", validateProduct, handleInputErrors, updateProduct);
router.post("/product", validateProduct, handleInputErrors, createProduct);
router.delete("/product/:id", deleteProduct);

/**
 * Update
 */
router.get("/update", getUpdates);
router.get("/update/:id", getOneUpdate);
router.put("/update/:id", validateUpdateUpdateNote, updateUpdate);
router.post("/update", validateCreateUpdateNote, createUpdate);
router.delete("/update/:id", deleteUpdate);

export default router;
