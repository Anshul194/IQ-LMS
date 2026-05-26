import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { DashboardService } from './dashboard.service.js';

const getStats = catchAsync(async (req, res) => {
    const result = await DashboardService.getDashboardStats();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: result,
    });
});

export const DashboardController = {
    getStats
};
