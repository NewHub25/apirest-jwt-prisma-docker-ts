import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import authRouter from "./routes/auth-routes";
import userRouter from "./routes/user-routes";

const app = express();
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);

export default app;