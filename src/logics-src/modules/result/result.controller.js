import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { ResultService } from './result.service.js';
import AppError from '../../../utils/AppError.js';
import { generateCertificatePDF } from '../../../utils/certificateGenerator.js';
import { generateReportPDF } from '../../../utils/reportGenerator.js';
import Student from '../../models/student.js';

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT RESULT
// POST /results/submit
// ─────────────────────────────────────────────────────────────────────────────
const submitResult = catchAsync(async (req, res) => {
    const data = await ResultService.submitResult(req.user.userId, req.body);

    // If retest required, return 200 with the retest message (not an error)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: data.status === 'RETEST_REQUIRED'
            ? 'Retest required. Student must score at least 11 correct answers.'
            : 'Exam submitted successfully.',
        data
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET MY RESULTS
// GET /results/my-results
// ─────────────────────────────────────────────────────────────────────────────
const getMyResults = catchAsync(async (req, res) => {
    const result = await ResultService.getMyResults(req.user.userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Results fetched successfully',
        data: result
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET RESULT BY ID
// GET /results/:id
// ─────────────────────────────────────────────────────────────────────────────
const getResultById = catchAsync(async (req, res) => {
    const result = await ResultService.getResultById(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Result detail fetched successfully',
        data: result
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE CERTIFICATE (PDF download)
// GET /results/:id/certificate
// Only available when status === 'PASSED'
// ─────────────────────────────────────────────────────────────────────────────
const generateCertificate = catchAsync(async (req, res) => {
    const result = await ResultService.getResultById(req.params.id);

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Result not found.');
    }

    if (result.status !== 'PASSED') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Certificate is only available for students who have PASSED (minimum 11 correct answers).'
        );
    }

    const studentName = result.userId?.fullName || 'Valued Student';
    const iqScore = result.iqScore;

    // Fetch student's grade/class
    const studentInfo = await Student.findOne({ userId: result.userId?._id || result.userId });
    const grade = result.examId?.className || studentInfo?.grade || 'N/A';

    const pdfBuffer = await generateCertificatePDF({ studentName, iqScore, result, grade });

    // Mark certificate as generated
    await result.set({ certificateGenerated: true }).save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate_${result._id}.pdf`);
    res.send(pdfBuffer);
});

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE REPORT (PDF download)
// GET /results/:id/report
// Only available when status === 'PASSED'
// ─────────────────────────────────────────────────────────────────────────────
const generateReport = catchAsync(async (req, res) => {
    // For admin requests, skip userId check (pass null)
    const requestingUserId = req.user.role === 'admin' ? null : req.user.userId;

    const reportData = await ResultService.getResultReportData(req.params.id, requestingUserId);

    const pdfBuffer = await generateReportPDF(reportData);

    // Mark report as generated
    await reportData.result.set({ reportGenerated: true }).save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report_${req.params.id}.pdf`);
    res.send(pdfBuffer);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET MY CERTIFICATES
// GET /results/my-certificates
// ─────────────────────────────────────────────────────────────────────────────
const getMyCertificates = catchAsync(async (req, res) => {
    const result = await ResultService.getMyCertificates(req.user.userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Certificates fetched successfully',
        data: result
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL RESULTS (admin)
// GET /results
// ─────────────────────────────────────────────────────────────────────────────
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
    generateReport,
    getMyCertificates,
    getAllResults
};
