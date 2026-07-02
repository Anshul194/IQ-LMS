import Result from '../../models/result.js';
import QuestionMaster from '../../models/questionMaster.js';
import User from '../../models/user.js';
import Student from '../../models/student.js';
import AppError from '../../../utils/AppError.js';
import httpStatus from 'http-status-codes';

// ─────────────────────────────────────────────────────────────────────────────
// IQ TEST CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_QUESTIONS = 40;
const MAX_TIME_MINUTES = 60;
const MIN_CORRECT_TO_PASS = 11;

/** Five intelligence areas, each with 8 questions (order matches question sequence). */
const AREA_NAMES = [
    'Analytical Reasoning',
    'Non-Verbal Comprehension',
    'Perceptual Reasoning',
    'Visual-Spatial Processing',
    'Logical Reasoning'
];
const QUESTIONS_PER_AREA = 8;

// ─────────────────────────────────────────────────────────────────────────────
// IQ SCORE FORMULA
// IQ = 40 + (3 × C) − (0.05 × (T − 1))
// Rounded to 3 decimal places.
// ─────────────────────────────────────────────────────────────────────────────
const calculateIQScore = (correctAnswers, timeTakenMinutes) => {
    const iq = 40 + (3 * correctAnswers) - (0.05 * (timeTakenMinutes - 1));
    return Number(iq.toFixed(3));
};

// ─────────────────────────────────────────────────────────────────────────────
// AREA PERCENTAGE
// Formula: (areaCorrect / totalCorrect) * 100  — avoids divide-by-zero
// ─────────────────────────────────────────────────────────────────────────────
const calculateAreaReport = (processedAnswers, totalCorrect) => {
    return AREA_NAMES.map((name, areaIndex) => {
        const start = areaIndex * QUESTIONS_PER_AREA;
        const end = start + QUESTIONS_PER_AREA;
        const areaAnswers = processedAnswers.slice(start, end);
        const areaCorrect = areaAnswers.filter(a => a.isCorrect).length;

        // Avoid divide-by-zero: if totalCorrect is 0, percentage is 0
        const percentage = totalCorrect > 0
            ? Number(((areaCorrect / totalCorrect) * 100).toFixed(2))
            : 0;

        return { name, correctAnswers: areaCorrect, percentage };
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT RESULT  (main entry point)
// Payload: { examId, timeTaken, answers: [{ questionId, selectedOption }] }
// ─────────────────────────────────────────────────────────────────────────────
const submitResult = async (userId, payload) => {
    const { examId, timeTaken, answers } = payload;

    // ── Validation ──────────────────────────────────────────────────────────
    if (timeTaken === undefined || timeTaken === null) {
        throw new AppError(httpStatus.BAD_REQUEST, 'timeTaken is required.');
    }
    if (timeTaken < 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Time taken cannot be negative.');
    }
    if (timeTaken > MAX_TIME_MINUTES) {
        throw new AppError(httpStatus.BAD_REQUEST, `Time taken cannot exceed ${MAX_TIME_MINUTES} minutes.`);
    }
    if (!answers || answers.length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Answers are required.');
    }
    if (answers.length > TOTAL_QUESTIONS) {
        throw new AppError(httpStatus.BAD_REQUEST, `Cannot submit more than ${TOTAL_QUESTIONS} answers.`);
    }

    // ── Fetch questions & evaluate answers ───────────────────────────────────
    const questionIds = answers.map(a => a.questionId);
    const questions = await QuestionMaster.find({ _id: { $in: questionIds } });

    if (!questions.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'Questions not found.');
    }

    let correctCount = 0;
    const processedAnswers = answers.map(submitted => {
        const question = questions.find(q => q._id.toString() === submitted.questionId);
        const isCorrect = question ? question.correctAnswer === submitted.selectedOption : false;
        if (isCorrect) correctCount++;
        return { ...submitted, isCorrect };
    });

    // Validate correctCount (edge case guard)
    if (correctCount < 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Correct answers cannot be negative.');
    }

    // ── Area-wise scores (for DB storage) ────────────────────────────────────
    const areaReport = calculateAreaReport(processedAnswers, correctCount);
    const areaScores = areaReport.map(a => ({ areaName: a.name, correctAnswers: a.correctAnswers }));

    // ── Eligibility check ────────────────────────────────────────────────────
    const passed = correctCount >= MIN_CORRECT_TO_PASS;

    let iqScore = null;
    let status;
    let enableRetest;

    if (passed) {
        iqScore = calculateIQScore(correctCount, timeTaken);
        status = 'PASSED';
        enableRetest = false;
    } else {
        status = 'RETEST_REQUIRED';
        enableRetest = true;
    }

    // ── Persist result ────────────────────────────────────────────────────────
    const resultData = {
        userId,
        examId,
        // Legacy fields (kept for backward compatibility)
        score: correctCount,
        totalQuestions: TOTAL_QUESTIONS,
        correctAnswersCount: correctCount,
        percentage: Number(((correctCount / TOTAL_QUESTIONS) * 100).toFixed(2)),
        // IQ-specific fields
        correctAnswers: correctCount,
        timeTaken,
        iqScore,
        status,
        enableRetest,
        reportGenerated: false,
        certificateGenerated: false,
        areaScores,
        answers: processedAnswers
    };

    const newResult = await Result.create(resultData);

    // ── Build response ────────────────────────────────────────────────────────
    if (!passed) {
        return {
            status: 'RETEST_REQUIRED',
            enableRetest: true,
            message: 'Student must score at least 11 correct answers.'
        };
    }

    return {
        status: 'PASSED',
        enableRetest: false,
        correctAnswers: correctCount,
        timeTaken,
        iqScore,
        areas: areaReport,
        totalPercentage: 100.00,
        resultId: newResult._id
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// GET RESULT REPORT DATA  (for generating PDF report)
// ─────────────────────────────────────────────────────────────────────────────
const getResultReportData = async (resultId, userId) => {
    const result = await Result.findById(resultId)
        .populate('userId', 'fullName')
        .populate('examId', 'examType className language');

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Result not found.');
    }

    // Ensure only the owning student or admin can access
    if (userId && result.userId._id.toString() !== userId.toString()) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied.');
    }

    if (result.status !== 'PASSED') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Report is only available for passed results.');
    }

    // Fetch student info for class
    const studentInfo = await Student.findOne({ userId: result.userId._id }).select('grade');

    const totalCorrect = result.correctAnswers;

    // Re-derive area report from stored areaScores
    const areas = result.areaScores.map(area => {
        const percentage = totalCorrect > 0
            ? Number(((area.correctAnswers / totalCorrect) * 100).toFixed(2))
            : 0;
        return { name: area.areaName, correctAnswers: area.correctAnswers, percentage };
    });

    return {
        studentName: result.userId?.fullName || 'Student',
        className: result.examId?.className || studentInfo?.grade || 'N/A',
        correctAnswers: result.correctAnswers,
        timeTaken: result.timeTaken,
        iqScore: result.iqScore,
        areas,
        totalPercentage: 100.00,
        result // full result for marking reportGenerated
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// GET MY RESULTS
// ─────────────────────────────────────────────────────────────────────────────
const getMyResults = async (userId) => {
    return await Result.find({ userId })
        .populate('examId', 'examType className language')
        .sort({ createdAt: -1 });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET RESULT BY ID
// ─────────────────────────────────────────────────────────────────────────────
const getResultById = async (id) => {
    return await Result.findById(id)
        .populate('userId', 'fullName contactNumber email')
        .populate('examId', 'examType className language')
        .populate('answers.questionId');
};

// ─────────────────────────────────────────────────────────────────────────────
// GET MY CERTIFICATES  (only PASSED results)
// ─────────────────────────────────────────────────────────────────────────────
const getMyCertificates = async (userId) => {
    return await Result.find({ userId, status: 'PASSED' })
        .populate('examId', 'examType className language')
        .sort({ createdAt: -1 });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL RESULTS  (admin)
// ─────────────────────────────────────────────────────────────────────────────
const getAllResults = async (query = {}) => {
    const { status, examId, studentName, studentId, page = 1, limit = 10 } = query;
    const filter = {};

    if (status) filter.status = status;
    if (examId) filter.examId = examId;
    if (studentId) filter.userId = studentId;

    if (studentName) {
        const users = await User.find({ fullName: { $regex: studentName, $options: 'i' } }).select('_id');
        filter.userId = { $in: users.map(u => u._id) };
    }

    const skip = (page - 1) * limit;

    const data = await Result.find(filter)
        .populate('userId', 'fullName email contactNumber')
        .populate('examId', 'examType className language')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Result.countDocuments(filter);

    return {
        data,
        meta: {
            total,
            page: Number(page),
            limit: Number(limit)
        }
    };
};

export const ResultService = {
    submitResult,
    getMyResults,
    getResultById,
    getMyCertificates,
    getAllResults,
    getResultReportData
};
