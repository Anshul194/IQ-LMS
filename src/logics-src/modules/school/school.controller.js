import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { SchoolService } from './school.service.js';

const createSchool = catchAsync(async (req, res) => {
    const result = await SchoolService.createSchool(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'School created successfully',
        data: result,
    });
});

const getAllSchools = catchAsync(async (req, res) => {
    const result = await SchoolService.getAllSchools(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Schools retrieved successfully',
        data: result,
    });
});

const getSchoolById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SchoolService.getSchoolById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'School retrieved successfully',
        data: result,
    });
});

const updateSchool = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SchoolService.updateSchool(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'School updated successfully',
        data: result,
    });
});

const deleteSchool = catchAsync(async (req, res) => {
    const { id } = req.params;
    await SchoolService.deleteSchool(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'School deleted successfully',
        data: null,
    });
});

export const SchoolController = {
    createSchool,
    getAllSchools,
    getSchoolById,
    updateSchool,
    deleteSchool
};
