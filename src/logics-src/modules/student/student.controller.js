import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { StudentService } from './student.service.js';

const createStudent = catchAsync(async (req, res) => {
    const result = await StudentService.createStudent(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Student created successfully',
        data: result,
    });
});

const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentService.getAllStudents(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Students retrieved successfully',
        data: result,
    });
});

const getStudentById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await StudentService.getStudentById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student retrieved successfully',
        data: result,
    });
});

const updateStudent = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await StudentService.updateStudent(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student updated successfully',
        data: result,
    });
});

const deleteStudent = catchAsync(async (req, res) => {
    const { id } = req.params;
    await StudentService.deleteStudent(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student deleted successfully',
        data: null,
    });
});

export const StudentController = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};
