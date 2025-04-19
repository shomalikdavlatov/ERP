import { Router } from 'express';
import StaffsController from './../controllers/staffs.controller.js';
import { authenticateJWT } from './../middlewares/auth.middleware.js';
import { authorizeRoles } from './../middlewares/role.middleware.js';

const router = Router();
const controller = new StaffsController();

router.get('/', authenticateJWT, authorizeRoles('superadmin', 'admin'), controller.getAllStaffsController.bind(controller));
router.post('/teacher', authenticateJWT, authorizeRoles('superadmin', 'admin'), controller.createTeacherController.bind(controller));
router.post('/admin', authenticateJWT, authorizeRoles('superadmin'), controller.createAdminController.bind(controller));
router.post('/superadmin', authenticateJWT, authorizeRoles('superadmin'), controller.createSuperAdminController.bind(controller));

export default router;