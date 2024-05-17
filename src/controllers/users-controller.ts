import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import prisma from "../models/user";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "El correo es obligatorio" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "La contraseña es obligatoria" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    res.status(201).json(user);
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ message: "Los datos ya están registrados" });
      return;
    }
    console.log(error);
    res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.findMany();
    res.status(200).json(users);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  const { password } = req.body;

  try {
    const dataToUpdate = { ...req.body };
    if (password) {
      dataToUpdate.password = await hashPassword(password);
    }
    const user = await prisma.update({ where: { id: userId }, data: dataToUpdate });
    res.status(200).json(user);
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ error: "El email ingresado ya existe" });
    } else if (error?.code === "P2025") {
      res.status(404).json({ error: "Usuario no encontrado" });
    } else {
      console.log(error);
      res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
    }
  }
}; 7

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);

  try {
    await prisma.delete({ where: { id: userId } });
    res
      .status(200)
      .json({ message: `El usuario ${userId} ha sido eliminado` })
      .end();
  } catch (error: any) {
    if (error?.code === "P2025") {
      res.status(404).json({ error: "Usuario no encontrado" });
    } else {
      console.log(error);
      res.status(500).json({ error: "Hubo un error, pruebe más tarde" });
    }
  }
}