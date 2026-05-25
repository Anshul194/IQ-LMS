import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { ExamCenterService } from './examCenter.service.js';

const createExamCenter = catchAsync(async (req, res) => {
    const result = await ExamCenterService.createExamCenter(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Exam center created successfully',
        data: result,
    });
});

const getAllExamCenters = catchAsync(async (req, res) => {
    const result = await ExamCenterService.getAllExamCenters(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Exam centers retrieved successfully',
        data: result,
    });
});

const getExamCenterById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ExamCenterService.getExamCenterById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Exam center retrieved successfully',
        data: result,
    });
});

const updateExamCenter = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ExamCenterService.updateExamCenter(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Exam center updated successfully',
        data: result,
    });
});

const deleteExamCenter = catchAsync(async (req, res) => {
    const { id } = req.params;
    await ExamCenterService.deleteExamCenter(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Exam center deleted successfully',
        data: null,
    });
});

export const ExamCenterController = {
    createExamCenter,
    getAllExamCenters,
    getExamCenterById,
    updateExamCenter,
    deleteExamCenter
};
