import express from 'express';
import { ExportController } from './export.controller.js';

const router = express.Router();

router.get('/students', ExportController.exportStudents);
router.get('/coordinators', ExportController.exportCoordinators);
router.get('/team', ExportController.exportTeamMembers);
router.get('/schools', ExportController.exportSchools);
router.get('/exam-centers', ExportController.exportExamCenters);
router.get('/exam-types', ExportController.exportExamTypes);
router.get('/sections', ExportController.exportSections);
router.get('/chapters', ExportController.exportChapters);
router.get('/questions', ExportController.exportQuestions);
router.get('/results', ExportController.exportResults);
router.get('/admissions', ExportController.exportAdmissions);
router.get('/all', ExportController.exportAll);

export const ExportRoutes = router;
