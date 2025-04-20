import GroupsController from './../controllers/groups.controller.js';
import { Router } from 'express';
import { authenticateJWT } from './../middlewares/auth.middleware.js';
import { authorizeRoles } from './../middlewares/role.middleware.js';

const router = Router();
const controller = new GroupsController();

router.get('/', authenticateJWT, authorizeRoles('superadmin', 'admin'), controller.getAllGroupsController.bind(controller));
router.get('/:id', authenticateJWT, authorizeRoles('superadmin', 'admin'), controller.getGroupByIdController.bind(controller));
router.get('/:id/lessons', authenticateJWT, controller.getLessonsByGroupIdController.bind(controller));
router.post('/', authenticateJWT, authorizeRoles('superadmin', 'admin'), controller.createGroupController.bind(controller));

export default router;