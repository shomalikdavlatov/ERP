import CoursesController from './../controllers/courses.controller.js';
import { Router } from 'express';
import { authenticateJWT } from './../middlewares/auth.middleware.js';
import { authorizeRoles } from './../middlewares/role.middleware.js';

const router = Router();
const controller = new CoursesController();

router.get('/', authenticateJWT, authorizeRoles('superadmin', 'admin'), controller.getAllCoursesController.bind(controller));
router.get('/:id', authenticateJWT, authorizeRoles('superadmin', 'admin'), controller.getCourseByIdController.bind(controller));
router.post('/', authenticateJWT, authorizeRoles('superadmin', 'admin'), controller.createCourseController.bind(controller));

export default router;