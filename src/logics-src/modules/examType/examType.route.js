import express from 'express';
import { ExamTypeController } from './examType.controller.js';

const router = express.Router();

router.post('/', ExamTypeController.createExamType);
router.get('/', ExamTypeController.getAllExamTypes);
router.get('/:id', ExamTypeController.getExamTypeById);
router.patch('/:id', ExamTypeController.updateExamType);
router.delete('/:id', ExamTypeController.deleteExamType);

export const ExamTypeRoutes = router;
