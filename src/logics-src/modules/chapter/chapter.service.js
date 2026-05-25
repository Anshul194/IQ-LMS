import { ChapterRepository } from './chapter.repository.js';
import AppError from '../../../utils/AppError.js';
import httpStatus from 'http-status-codes';

const createChapter = async (payload) => {
    return await ChapterRepository.createChapter(payload);
};

const getAllChapters = async (query) => {
    return await ChapterRepository.getAllChapters(query);
};

const getChapterById = async (id) => {
    const result = await ChapterRepository.getChapterById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Chapter not found');
    }
    return result;
};

const updateChapter = async (id, payload) => {
    const result = await ChapterRepository.updateChapter(id, payload);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Chapter not found');
    }
    return result;
};

const deleteChapter = async (id) => {
    const result = await ChapterRepository.deleteChapter(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Chapter not found');
    }
    return result;
};

export const ChapterService = {
    createChapter,
    getAllChapters,
    getChapterById,
    updateChapter,
    deleteChapter
};
