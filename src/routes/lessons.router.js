import LessonsController from './../controllers/lessons.controller.js';
import { Router } from 'express';
import { authenticateJWT } from './../middlewares/auth.middleware.js';
import { authorizeRoles } from './../middlewares/role.middleware.js';

const router = Router();
const controller = new LessonsController();

router.post('/', authenticateJWT, authorizeRoles('superadmin', 'admin', 'teacher'), controller.createLessonController.bind(controller));

export default router;
