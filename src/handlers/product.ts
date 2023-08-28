import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { User } from "../modules/auth";

// Extend the Request type to include a user property
interface RequestWithUser extends Request {
  user?: User;
}

// Get All Products
export const getProducts = async (req: RequestWithUser, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user?.id,
    },
    include: {
      products: true,
    },
  });

  res.json({ data: user?.products });
};

// Get One Product by ID
export const getOneProduct = async (req: RequestWithUser, res: Response) => {
  const id = req.params.id;
  const product = await prisma.product.findFirst({
    where: {
      id,
      belongsToId: req.user?.id,
    },
  });

  res.json({ data: product });
};

// Create Product
export const createProduct = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401);
    res.send("Not authorized");
    return;
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        belongsToId: req.user?.id,
      },
    });

    res.json({ data: product });
  } catch (e) {
    next(e);
  }
};

// Update Product
export const updateProduct = async (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    res.status(401);
    res.send("Not authorized");
    return;
  }
  const updated = await prisma.product.update({
    where: {
      id_belongsToId: {
        id: req.params.id,
        belongsToId: req.user?.id,
      },
    },
    data: {
      name: req.body.name,
    },
  });

  res.json({ data: updated });
};

// Delete Product
export const deleteProduct = async (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    res.status(401);
    res.send("Not authorized");
    return;
  }
  const deleted = await prisma.product.delete({
    where: {
      id_belongsToId: {
        id: req.params.id,
        belongsToId: req.user?.id,
      },
    },
  });

  res.json({ data: deleted });
};
