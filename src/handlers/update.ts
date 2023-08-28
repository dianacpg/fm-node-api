import { Request, Response } from "express";
import prisma from "../db";
import { User } from "../modules/auth";
import { Update } from "@prisma/client";

// Extend the Request type to include a user property
interface RequestWithUser extends Request {
  user?: User;
}

// Get All Update Notes
export const getUpdates = async (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    res.status(401);
    res.send("Not authorized");
    return;
  }
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updateNotes = products.reduce((allUpdates: Update[], product) => {
    return [...allUpdates, ...product.updates];
  }, []);
  res.json({ data: updateNotes });
};

// Get One Update Note by ID
export const getOneUpdate = async (req: Request, res: Response) => {
  const updateNote = await prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: updateNote });
};

// Create Update Note
export const createUpdate = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });
  if (!product) {
    return res.json({ message: "nope" });
  }

  const updateNote = await prisma.update.create({
    data: {
      title: req.body.title,
      body: req.body.body,
      product: { connect: { id: product.id } },
    },
  });

  res.json({ data: updateNote });
};

// Update Update Note
export const updateUpdate = async (req: RequestWithUser, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user?.id,
    },
    include: {
      updates: true,
    },
  });

  const updateNotes = products.reduce((allUpdates: Update[], product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  const match = updateNotes.find((update) => update.id === req.params.id);

  if (!match) {
    return res.json({ message: "nope" });
  }

  const updateUpdateNote = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  res.json({ data: updateUpdateNote });
};

// Delete Update Note
export const deleteUpdate = async (req: RequestWithUser, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user?.id,
    },
    include: {
      updates: true,
    },
  });

  const updateNotes = products.reduce((allUpdates: Update[], product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  const match = updateNotes.find((update) => update.id === req.params.id);

  if (!match) {
    return res.json({ message: "nope" });
  }

  const deleted = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: deleted });
};
