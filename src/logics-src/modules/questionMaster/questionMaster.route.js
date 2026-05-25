import express from 'express';
import { QuestionMasterController } from './questionMaster.controller.js';

const router = express.Router();

router.post('/', QuestionMasterController.createQuestion);
router.get('/', QuestionMasterController.getAllQuestions);
router.get('/:id', QuestionMasterController.getQuestionById);
router.patch('/:id', QuestionMasterController.updateQuestion);
router.delete('/:id', QuestionMasterController.deleteQuestion);

// Assign Feature
router.post('/assign', QuestionMasterController.assignQuestions);

export const QuestionMasterRoutes = router;
