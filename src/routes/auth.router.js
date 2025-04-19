import { Router } from 'express';
import AuthController from './../controllers/auth.controller.js';
import { authenticateJWT } from './../middlewares/auth.middleware.js';
import { authorizeRoles } from './../middlewares/role.middleware.js';

export const authRouter = Router();
const controller = new AuthController();

authRouter.post('/login', (req, res) => controller.login(req, res));
authRouter.get('/user', authenticateJWT, (req, res) => controller.user(req, res));
authRouter.get('/admin', authenticateJWT, authorizeRoles('admin'), controller.admin);