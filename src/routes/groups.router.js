import GroupsController from './../controllers/groups.controller.js';
import { Router } from 'express';
import { authenticateJWT } from './../middlewares/auth.middleware.js';
import { authorizeRoles } from './../middlewares/role.middleware.js';

const router = Router();
const controller = new GroupsController();

router.post('/', authenticateJWT, authorizeRoles('superadmin', 'admin'), controller.createGroupController.bind(controller));

export default router;