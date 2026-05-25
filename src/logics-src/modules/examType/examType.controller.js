import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { ExamTypeService } from './examType.service.js';

const createExamType = catchAsync(async (req, res) => {
    const result = await ExamTypeService.createExamType(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Exam Type created successfully',
        data: result,
    });
});

const getAllExamTypes = catchAsync(async (req, res) => {
    const result = await ExamTypeService.getAllExamTypes(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Exam Types retrieved successfully',
        data: result,
    });
});

const getExamTypeById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ExamTypeService.getExamTypeById(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Exam Type retrieved successfully',
        data: result,
    });
});

const updateExamType = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ExamTypeService.updateExamType(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Exam Type updated successfully',
        data: result,
    });
});

const deleteExamType = catchAsync(async (req, res) => {
    const { id } = req.params;
    await ExamTypeService.deleteExamType(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Exam Type deleted successfully',
        data: null,
    });
});

export const ExamTypeController = {
    createExamType,
    getAllExamTypes,
    getExamTypeById,
    updateExamType,
    deleteExamType
};
