import express from 'express';
import { SchoolController } from './school.controller.js';

const router = express.Router();

router.post('/', SchoolController.createSchool);
router.get('/', SchoolController.getAllSchools);
router.get('/:id', SchoolController.getSchoolById);
router.patch('/:id', SchoolController.updateSchool);
router.delete('/:id', SchoolController.deleteSchool);

export const SchoolRoutes = router;
