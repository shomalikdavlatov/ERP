import { Router } from 'express';
import AuthController from './../controllers/auth.controller.js';
import { authenticateJWT } from './../middlewares/auth.middleware.js';
import { authorizeRoles } from './../middlewares/role.middleware.js';

const router = Router();
const controller = new AuthController();

router.post('/login', (req, res) => controller.login(req, res));
router.get('/user', authenticateJWT, (req, res) => controller.user(req, res));
router.get('/admin', authenticateJWT, authorizeRoles('admin'), controller.admin);

export default router;