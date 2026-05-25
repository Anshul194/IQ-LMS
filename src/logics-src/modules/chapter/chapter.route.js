import express from 'express';
import { ChapterController } from './chapter.controller.js';

const router = express.Router();

router.post('/', ChapterController.createChapter);
router.get('/', ChapterController.getAllChapters);
router.get('/:id', ChapterController.getChapterById);
router.patch('/:id', ChapterController.updateChapter);
router.delete('/:id', ChapterController.deleteChapter);

export const ChapterRoutes = router;
