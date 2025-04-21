import PaymentsController from './../controllers/payments.controller.js';
import { Router } from 'express';
import { authenticateJWT } from './../middlewares/auth.middleware.js';
import { authorizeRoles } from './../middlewares/role.middleware.js';

const router = Router();
const controller = new PaymentsController();

router.post('/', authenticateJWT, authorizeRoles('superadmin', 'admin'), controller.createPaymentController.bind(controller));

export default router;