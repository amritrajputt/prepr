import { Router } from "express";
import { AuthController } from "./auth.controller.js";

export const authRoutes: Router = Router();

authRoutes.post('/created', AuthController.createUser);
authRoutes.post('/updated', AuthController.updateUser);
authRoutes.delete('/delete', AuthController.deleteUser);