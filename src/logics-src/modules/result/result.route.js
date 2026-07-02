import express from 'express';
import { ResultController } from './result.controller.js';
import auth from '../../../middlewares/auth.js';

const router = express.Router();

// Student routes
router.post('/submit', auth('student'), ResultController.submitResult);
router.get('/my-results', auth('student'), ResultController.getMyResults);
router.get('/my-certificates', auth('student'), ResultController.getMyCertificates);

// Admin only
router.get('/', auth('admin'), ResultController.getAllResults);

// Shared (student + admin)
router.get('/:id', auth('student', 'admin'), ResultController.getResultById);
router.get('/:id/certificate', auth('student', 'admin'), ResultController.generateCertificate);

// PDF Report — student can download their own; admin can download any
router.get('/:id/report', auth('student', 'admin'), ResultController.generateReport);

export const ResultRoutes = router;
