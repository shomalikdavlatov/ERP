import { Router } from 'express';
import StudentsController from './../controllers/students.controller.js'
import { authenticateJWT } from './../middlewares/auth.middleware.js';
import { authorizeRoles } from './../middlewares/role.middleware.js';

const router = Router();
const controller = new StudentsController();

router.get('/', authenticateJWT, authorizeRoles('superadmin', 'admin', 'teacher'), controller.getAllStudentsController.bind(controller));
router.get('/:id', authenticateJWT, authorizeRoles('superadmin', 'admin', 'teacher'), controller.getStudentByIdController.bind(controller));
router.get('/:studentId/attendance', authenticateJWT, controller.getAttendancesByStudentIdController.bind(controller));
router.post('/', authenticateJWT, authorizeRoles('superadmin', 'admin'), controller.createStudentController.bind(controller));

export default router;