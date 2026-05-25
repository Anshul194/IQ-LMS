import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { UserService } from './user.service.js';

const createStudent = catchAsync(async (req, res) => {
    const result = await UserService.createStudent(req.body, req.file);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Student created successfully',
        data: result,
    });
});

const createTeamMember = catchAsync(async (req, res) => {
    const result = await UserService.createTeamMember(req.body, req.file);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Team member created successfully',
        data: result,
    });
});

const getTeamByRole = catchAsync(async (req, res) => {
    const { role } = req.params;
    const result = await UserService.getTeamByRole(role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Team members retrieved successfully',
        data: result,
    });
});

const getTeamById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await UserService.getTeamById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Team member retrieved successfully',
        data: result,
    });
});

const updateTeam = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await UserService.updateTeam(id, req.body, req.file);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Team member updated successfully',
        data: result,
    });
});

const deleteTeam = catchAsync(async (req, res) => {
    const { id } = req.params;
    await UserService.deleteTeam(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Team member deleted successfully',
        data: null,
    });
});

export const UserController = {
    createStudent,
    createTeamMember,
    getTeamByRole,
    getTeamById,
    updateTeam,
    deleteTeam
};
