import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import AppError from '../../../utils/AppError.js';
import { AptitudeService } from './aptitude.service.js';
import { generateAptitudeReportPDF } from '../../../utils/aptitudeReportGenerator.js';

// ── Submit ────────────────────────────────────────────────────────────────────
const submitAptitudeResult = catchAsync(async (req, res) => {
    const data = await AptitudeService.submitAptitudeResult(req.user.userId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Career Aptitude Test submitted successfully.',
        data
    });
});

// ── My Results ────────────────────────────────────────────────────────────────
const getMyAptitudeResults = catchAsync(async (req, res) => {
    const data = await AptitudeService.getMyAptitudeResults(req.user.userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Aptitude results fetched.',
        data
    });
});

// ── Get By ID ─────────────────────────────────────────────────────────────────
const getAptitudeResultById = catchAsync(async (req, res) => {
    const data = await AptitudeService.getAptitudeResultById(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Aptitude result fetched.',
        data
    });
});

// ── All Results (admin) ────────────────────────────────────────────────────────
const getAllAptitudeResults = catchAsync(async (req, res) => {
    const data = await AptitudeService.getAllAptitudeResults(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All aptitude results fetched.',
        data
    });
});

// ── Download PDF Report ────────────────────────────────────────────────────────
const downloadAptitudeReport = catchAsync(async (req, res) => {
    const requestingUserId = req.user.role === 'admin' ? null : req.user.userId;
    const reportData = await AptitudeService.getAptitudeReportData(req.params.id, requestingUserId);

    const pdfBuffer = await generateAptitudeReportPDF(reportData);

    // Mark report as generated
    await reportData.rawResult.set({ reportGenerated: true }).save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=aptitude_report_${req.params.id}.pdf`);
    res.send(pdfBuffer);
});

// ── Config ──────────────────────────────────────────────────────────────────
const getConfig = catchAsync(async (req, res) => {
    const data = await AptitudeService.getAptitudeConfig();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Aptitude configuration fetched.',
        data
    });
});

const updateConfig = catchAsync(async (req, res) => {
    const data = await AptitudeService.updateAptitudeConfig(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Aptitude configuration updated.',
        data
    });
});

export const AptitudeController = {
    submitAptitudeResult,
    getMyAptitudeResults,
    getAptitudeResultById,
    getAllAptitudeResults,
    downloadAptitudeReport,
    getConfig,
    updateConfig
};
