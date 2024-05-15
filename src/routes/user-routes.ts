import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "Default-secret";

// Middleware  de JWT para ver si estamos autenticados
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error en la autenticación:\n" + err);
      return res.status(403).json({ error: "No tienes acceso a este recurso" });
    }

    next();
  });
};

router.post("/", authenticateToken, () => { console.log("post"); });
router.get("/", authenticateToken, () => { console.log("getAll"); });
router.get("/:id", authenticateToken, () => { console.log("getById"); });
router.put("/:id", authenticateToken, () => { console.log("put"); });
router.delete("/:id", authenticateToken, () => { console.log("delete"); });

export default router;