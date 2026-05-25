import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { ChapterService } from './chapter.service.js';

const createChapter = catchAsync(async (req, res) => {
    const result = await ChapterService.createChapter(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Chapter created successfully',
        data: result,
    });
});

const getAllChapters = catchAsync(async (req, res) => {
    const result = await ChapterService.getAllChapters(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Chapters retrieved successfully',
        data: result,
    });
});

const getChapterById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ChapterService.getChapterById(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Chapter retrieved successfully',
        data: result,
    });
});

const updateChapter = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ChapterService.updateChapter(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Chapter updated successfully',
        data: result,
    });
});

const deleteChapter = catchAsync(async (req, res) => {
    const { id } = req.params;
    await ChapterService.deleteChapter(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Chapter deleted successfully',
        data: null,
    });
});

export const ChapterController = {
    createChapter,
    getAllChapters,
    getChapterById,
    updateChapter,
    deleteChapter
};
