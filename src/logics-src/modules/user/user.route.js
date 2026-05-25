import express from 'express';
import { UserController } from './user.controller.js';
import upload from '../../../utils/uploader.js';

const router = express.Router();

router.post('/create-student', upload.single('idProof'), UserController.createStudent);
router.post('/create-team', upload.single('idProof'), UserController.createTeamMember);
router.get('/role/:role', UserController.getTeamByRole);
router.get('/:id', UserController.getTeamById);
router.patch('/:id', upload.single('idProof'), UserController.updateTeam);
router.delete('/:id', UserController.deleteTeam);

export const UserRoutes = router;
