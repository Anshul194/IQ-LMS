import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { ResultService } from './result.service.js';

import { generateCertificatePDF } from '../../../utils/certificateGenerator.js';

const submitResult = catchAsync(async (req, res) => {
    // Assuming userId is attached to req.user by auth middleware
    const result = await ResultService.submitResult(req.user.userId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Exam submitted successfully',
        data: result
    });
});

const getMyResults = catchAsync(async (req, res) => {
    const result = await ResultService.getMyResults(req.user.userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Results fetched successfully',
        data: result
    });
});

const getResultById = catchAsync(async (req, res) => {
    const result = await ResultService.getResultById(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Result detail fetched successfully',
        data: result
    });
});

const generateCertificate = catchAsync(async (req, res) => {
    const result = await ResultService.getResultById(req.params.id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Result not found');
    }

    if (result.status !== 'pass') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Certificate only available for passing results');
    }

    const studentName = result.userId?.fullName || 'Valued Student';
    const pdfBuffer = await generateCertificatePDF(result, studentName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate_${result._id}.pdf`);
    res.send(pdfBuffer);
});

const getMyCertificates = catchAsync(async (req, res) => {
    const result = await ResultService.getMyCertificates(req.user.userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Certificates fetched successfully',
        data: result
    });
});

const getAllResults = catchAsync(async (req, res) => {
    const result = await ResultService.getAllResults(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All results fetched successfully',
        data: result
    });
});

export const ResultController = {
    submitResult,
    getMyResults,
    getResultById,
    generateCertificate,
    getMyCertificates,
    getAllResults
};
