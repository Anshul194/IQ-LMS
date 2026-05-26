import express from 'express';
import { ResultController } from './result.controller.js';
import auth from '../../../middlewares/auth.js';

const router = express.Router();

router.post('/submit', auth('student'), ResultController.submitResult);
router.get('/my-results', auth('student'), ResultController.getMyResults);
router.get('/my-certificates', auth('student'), ResultController.getMyCertificates);
router.get('/:id', auth('student', 'admin'), ResultController.getResultById);
router.get('/:id/certificate', auth('student', 'admin'), ResultController.generateCertificate);

export const ResultRoutes = router;
