import express from 'express';
import { AptitudeController } from './aptitude.controller.js';
import auth from '../../../middlewares/auth.js';

const router = express.Router();

// Student routes
router.post('/submit', auth('student'), AptitudeController.submitAptitudeResult);
router.get('/my-results', auth('student'), AptitudeController.getMyAptitudeResults);

// Admin routes
router.get('/', auth('admin'), AptitudeController.getAllAptitudeResults);

// Config routes (Admin only)
router.get('/config/settings', auth('admin'), AptitudeController.getConfig);
router.patch('/config/settings', auth('admin'), AptitudeController.updateConfig);

// Shared — student can view own; admin can view any (controller enforces ownership)
router.get('/:id', auth('student', 'admin'), AptitudeController.getAptitudeResultById);
router.get('/:id/report', auth('student', 'admin'), AptitudeController.downloadAptitudeReport);

export const AptitudeRoutes = router;
