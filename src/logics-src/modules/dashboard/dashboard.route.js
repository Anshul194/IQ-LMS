import express from 'express';
import { DashboardController } from './dashboard.controller.js';
import auth from '../../../middlewares/auth.js';

const router = express.Router();

// Dashboard should only be accessible by admins or authorized staff
router.get('/stats', auth('admin', 'administrative_officer', 'coordinator'), DashboardController.getStats);

export const DashboardRoutes = router;
