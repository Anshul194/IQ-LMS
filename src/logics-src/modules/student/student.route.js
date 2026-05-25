import express from 'express';
import { StudentController } from './student.controller.js';

const router = express.Router();

router.post('/', StudentController.createStudent);
router.get('/', StudentController.getAllStudents);
router.get('/:id', StudentController.getStudentById);
router.patch('/:id', StudentController.updateStudent);
router.delete('/:id', StudentController.deleteStudent);

export const StudentRoutes = router;
