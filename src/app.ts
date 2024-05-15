import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import authRouter from "./routes/auth-routes";

const app = express();
app.use(express.json());

// Routes
app.use("/auth", authRouter);
// Autenticación
// User

export default app;