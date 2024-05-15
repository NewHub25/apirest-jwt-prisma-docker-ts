import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/password.service";
import prisma from "../models/user"
import { generateToken } from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
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

    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ message: "Los datos ya están registrados" });
      return;
    }
    console.log(error);
    res.status(500).json({ error: "Hubo un error en el registro" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Usuario o contraseña no coinciden" });
      return;
    }

    const isMatch = await comparePasswords(password, user!.password);
    if (!isMatch) {
      res.status(401).json({ error: "Usuario o contraseña no coinciden" });
      return;
    }

    const token = generateToken(user);
    res.status(202).json({ token });
  } catch (error) { console.log(`Error: ${error}`); }
};
