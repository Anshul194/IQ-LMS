import express from 'express';
import { ExamCenterController } from './examCenter.controller.js';

const router = express.Router();

router.post('/', ExamCenterController.createExamCenter);
router.get('/', ExamCenterController.getAllExamCenters);
router.get('/:id', ExamCenterController.getExamCenterById);
router.patch('/:id', ExamCenterController.updateExamCenter);
router.delete('/:id', ExamCenterController.deleteExamCenter);

export const ExamCenterRoutes = router;
