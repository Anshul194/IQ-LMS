import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { QuestionMasterService } from './questionMaster.service.js';

const createQuestion = catchAsync(async (req, res) => {
    const result = await QuestionMasterService.createQuestion(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Question created successfully',
        data: result,
    });
});

const getAllQuestions = catchAsync(async (req, res) => {
    const result = await QuestionMasterService.getAllQuestions(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Questions retrieved successfully',
        data: result,
    });
});

const getQuestionById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await QuestionMasterService.getQuestionById(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Question retrieved successfully',
        data: result,
    });
});

const updateQuestion = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await QuestionMasterService.updateQuestion(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Question updated successfully',
        data: result,
    });
});

const deleteQuestion = catchAsync(async (req, res) => {
    const { id } = req.params;
    await QuestionMasterService.deleteQuestion(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Question deleted successfully',
        data: null,
    });
});

const assignQuestions = catchAsync(async (req, res) => {
    const { from, to } = req.body;
    const result = await QuestionMasterService.assignQuestions(from, to);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `${result.length} questions assigned successfully`,
        data: result,
    });
});

export const QuestionMasterController = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    assignQuestions
};
