import express from 'express';
import { SectionController } from './section.controller.js';

const router = express.Router();

router.post('/', SectionController.createSection);
router.get('/', SectionController.getAllSections);
router.get('/:id', SectionController.getSectionById);
router.patch('/:id', SectionController.updateSection);
router.delete('/:id', SectionController.deleteSection);

export const SectionRoutes = router;
