import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { AuthService } from './auth.service.js';

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthService.loginUser(req.body);

    const { refreshToken, accessToken, user } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User logged in successfully',
        data: {
            accessToken,
            user
        },
    });
});

const loginStudentByDob = catchAsync(async (req, res) => {
    const result = await AuthService.loginStudentByDob(req.body);

    const { refreshToken, accessToken, user } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student logged in successfully',
        data: {
            accessToken,
            user
        },
    });
});

export const AuthController = {
    loginUser,
    loginStudentByDob
};
