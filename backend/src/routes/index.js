import { Router } from 'express';
import healthRoutes from './health.routes.js';
import ticketRoutes from './ticket.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use('/health', healthRoutes);

router.use('/tickets', ticketRoutes);

router.use('/dashboard', dashboardRoutes);

export default router;