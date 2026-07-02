/**
 * aptitude.service.js
 *
 * Business logic for Career Aptitude Test.
 * Controllers call this; helpers do the pure calculations.
 */

import AptitudeResult from '../../models/aptitudeResult.js';
import AptitudeConfig from '../../models/aptitudeConfig.js';
import QuestionMaster from '../../models/questionMaster.js';
import Student from '../../models/student.js';
import User from '../../models/user.js';
import AppError from '../../../utils/AppError.js';
import httpStatus from 'http-status-codes';

import {
    initCareerScores,
    applyInterestAnswer,
    getChapterPair,
    buildCareerReport,
    scoresToCareerDB,
    getSubjectForSequence,
    buildAcademicReport,
    subjectMapToAcademicDB,
    academicDBToSubjectMap,
    careerDBToScores
} from './aptitude.helpers.js';

const VALID_OPTIONS = ['A', 'B', 'C', 'D'];

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT APTITUDE RESULT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Process and persist a complete Career Aptitude submission.
 *
 * Payload shape:
 * {
 *   examId:          string,
 *   timeTaken:       number,               // minutes
 *   interestAnswers: [{ questionIndex, selectedOption }],  // 50 items, index 0-49
 *   academicAnswers: [{ questionId, selectedOption }]      // 50 items, position = subject
 * }
 */
const submitAptitudeResult = async (userId, payload) => {
    const { examId, timeTaken, interestAnswers, academicAnswers } = payload;

    // Fetch dynamic configuration
    const config = await getAptitudeConfig();

    // ── Validation ────────────────────────────────────────────────────────────
    if (timeTaken === undefined || timeTaken === null) {
        throw new AppError(httpStatus.BAD_REQUEST, 'timeTaken is required.');
    }
    if (timeTaken < 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Time taken cannot be negative.');
    }
    if (timeTaken > config.maxTimeMinutes) {
        throw new AppError(httpStatus.BAD_REQUEST, `Time taken cannot exceed ${config.maxTimeMinutes} minutes.`);
    }
    if (!interestAnswers || interestAnswers.length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'interestAnswers are required.');
    }
    if (!academicAnswers || academicAnswers.length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'academicAnswers are required.');
    }

    // Validate option values in interest section
    for (const ans of interestAnswers) {
        if (!VALID_OPTIONS.includes(ans.selectedOption)) {
            throw new AppError(httpStatus.BAD_REQUEST, `Invalid option "${ans.selectedOption}" in interest answers. Must be A, B, C, or D.`);
        }
    }

    // ── SECTION 1: Interest Scoring ───────────────────────────────────────────
    const careerScoreArray = initCareerScores(config);

    // Validate and Extract Question IDs
    const interestQuestionIds = interestAnswers.map(a => a.questionId).filter(Boolean);
    const interestQuestions = await QuestionMaster.find({ _id: { $in: interestQuestionIds } }).populate('chapter');

    const processedInterestAnswers = interestAnswers.map(ans => {
        const question = interestQuestions.find(q => q._id.toString() === ans.questionId);
        if (!question) {
            throw new AppError(httpStatus.BAD_REQUEST, `Question ${ans.questionId} not found in DB.`);
        }

        const chapterSequence = question.chapter?.sequence;
        const chapterPair = getChapterPair(chapterSequence, config);
        if (!chapterPair) {
            throw new AppError(httpStatus.BAD_REQUEST, `Invalid chapter sequence ${chapterSequence} for question ${ans.questionId}.`);
        }

        const selectedOptionObj = question.options[ans.selectedOption];
        if (!selectedOptionObj) {
            throw new AppError(httpStatus.BAD_REQUEST, `Invalid option ${ans.selectedOption} for question ${ans.questionId}.`);
        }

        const traitMapping = selectedOptionObj.traitMapping || 'NONE';
        applyInterestAnswer(careerScoreArray, traitMapping, chapterPair, config);

        return { questionId: ans.questionId, selectedOption: ans.selectedOption };
    });

    const { grandTotal: careerGrandTotal, areas: careerAreas } = buildCareerReport(careerScoreArray, config);

    // ── SECTION 2: Academic Scoring ───────────────────────────────────────────

    // Validate academic option values
    for (const ans of academicAnswers) {
        if (ans.selectedOption && !VALID_OPTIONS.includes(ans.selectedOption)) {
            throw new AppError(httpStatus.BAD_REQUEST, `Invalid option "${ans.selectedOption}" in academic answers. Must be A, B, C, or D.`);
        }
    }

    // Fetch academic questions to evaluate correctness
    const questionIds = academicAnswers.map(a => a.questionId).filter(Boolean);
    const questions = await QuestionMaster.find({ _id: { $in: questionIds } }).populate('chapter');

    // Subject correct counters
    const subjectMap = {};

    const processedAcademicAnswers = academicAnswers.map((ans, idx) => {
        const question = questions.find(q => q._id.toString() === ans.questionId);
        const isCorrect = question ? question.correctAnswer === ans.selectedOption : false;

        if (isCorrect) {
            const subject = getSubjectForSequence(question.chapter?.sequence, config);
            subjectMap[subject] = (subjectMap[subject] ?? 0) + 1;
        }

        return {
            questionId: ans.questionId,
            selectedOption: ans.selectedOption || null,
            isCorrect
        };
    });

    const { grandTotal: academicGrandTotal, subjects } = buildAcademicReport(subjectMap, config);

    // ── Persist ────────────────────────────────────────────────────────────────
    const record = await AptitudeResult.create({
        userId,
        examId,
        timeTaken,
        interestAnswers: processedInterestAnswers,
        careerScores: scoresToCareerDB(careerScoreArray, config),
        careerGrandTotal,
        academicAnswers: processedAcademicAnswers,
        academicScores: subjectMapToAcademicDB(subjectMap, config),
        academicGrandTotal,
        status: 'COMPLETED'
    });

    // ── Response ────────────────────────────────────────────────────────────────
    return {
        resultId: record._id,
        timeTaken,
        careerAssessment: {
            grandTotal: careerGrandTotal,
            areas: careerAreas
        },
        academicAssessment: {
            grandTotal: academicGrandTotal,
            subjects
        }
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// GET RESULT BY ID  (for report generation & detail view)
// ─────────────────────────────────────────────────────────────────────────────
const getAptitudeResultById = async (id) => {
    const result = await AptitudeResult.findById(id)
        .populate('userId', 'fullName contactNumber email')
        .populate('examId', 'examType className language');

    if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Aptitude result not found.');
    return result;
};

// ─────────────────────────────────────────────────────────────────────────────
// BUILD REPORT DATA  (structured data for PDF generator)
// ─────────────────────────────────────────────────────────────────────────────
const getAptitudeReportData = async (id, requestingUserId) => {
    const result = await getAptitudeResultById(id);

    // Students can only view their own results; admin passes null
    if (requestingUserId && result.userId._id.toString() !== requestingUserId.toString()) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied.');
    }

    // Fetch dynamic configuration
    const config = await getAptitudeConfig();

    // Fetch student info for class/grade
    const studentInfo = await Student.findOne({ userId: result.userId._id }).select('grade');

    // Reconstruct career report from stored DB values
    const storedScores = careerDBToScores(result.careerScores, config);
    const careerReport = buildCareerReport(storedScores, config);

    // Reconstruct academic report from stored DB values
    const subjectMap = academicDBToSubjectMap(result.academicScores, config);
    const academicReport = buildAcademicReport(subjectMap, config);

    return {
        studentName: result.userId?.fullName || 'Student',
        className: result.examId?.className || studentInfo?.grade || 'N/A',
        timeTaken: result.timeTaken,
        careerAssessment: careerReport,
        academicAssessment: academicReport,
        completedAt: result.completedAt,
        resultId: result._id,
        rawResult: result
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// GET MY APTITUDE RESULTS
// ─────────────────────────────────────────────────────────────────────────────
const getMyAptitudeResults = async (userId) => {
    return await AptitudeResult.find({ userId })
        .populate('examId', 'examType className language')
        .sort({ createdAt: -1 });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL  (admin, paginated)
// ─────────────────────────────────────────────────────────────────────────────
const getAllAptitudeResults = async (query = {}) => {
    const { examId, studentName, studentId, page = 1, limit = 10 } = query;
    const filter = {};

    if (examId) filter.examId = examId;
    if (studentId) filter.userId = studentId;

    if (studentName) {
        const users = await User.find({ fullName: { $regex: studentName, $options: 'i' } }).select('_id');
        filter.userId = { $in: users.map(u => u._id) };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const data = await AptitudeResult.find(filter)
        .populate('userId', 'fullName email contactNumber')
        .populate('examId', 'examType className language')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await AptitudeResult.countDocuments(filter);

    return {
        data,
        meta: { total, page: Number(page), limit: Number(limit) }
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION (DYNAMIC SETTINGS)
// ─────────────────────────────────────────────────────────────────────────────
const getDefaultConfig = () => ({
    maxTimeMinutes: 120,
    careerPairs: [
        { chapterSequence: 1, career1: 'Medical Science & Healthcare', career2: 'Science, Technology, Engineering & Mathematics (STEM)' },
        { chapterSequence: 2, career1: 'Commerce, Business & Management', career2: 'Law, Politics & Social Work' },
        { chapterSequence: 3, career1: 'Teaching, Coaching, Counselling & Education', career2: 'Travel, Tourism, Hospitality, Aviation & Hotel Management' },
        { chapterSequence: 4, career1: 'Administrative & Civil Services', career2: 'Defence, Police, Sports & Yoga' },
        { chapterSequence: 5, career1: 'Design, Branding, Fine Arts & Creativity', career2: 'Performing Arts, Media, Journalism & Languages' }
    ],
    academicSubjects: [
        { chapterSequence: 1, subjectName: 'Science' },
        { chapterSequence: 2, subjectName: 'Mathematics' },
        { chapterSequence: 3, subjectName: 'Social Science' },
        { chapterSequence: 4, subjectName: 'Language' },
        { chapterSequence: 5, subjectName: 'Reasoning' }
    ]
});

const getAptitudeConfig = async () => {
    let config = await AptitudeConfig.findOne();
    if (!config) {
        config = await AptitudeConfig.create(getDefaultConfig());
    }
    return config;
};

const updateAptitudeConfig = async (payload) => {
    let config = await AptitudeConfig.findOne();
    if (!config) {
        config = await AptitudeConfig.create(getDefaultConfig());
    }

    // Only update allowed fields
    if (payload.maxTimeMinutes) config.maxTimeMinutes = payload.maxTimeMinutes;
    if (payload.careerPairs) config.careerPairs = payload.careerPairs;
    if (payload.academicSubjects) config.academicSubjects = payload.academicSubjects;

    await config.save();
    return config;
};

export const AptitudeService = {
    submitAptitudeResult,
    getAptitudeResultById,
    getAptitudeReportData,
    getMyAptitudeResults,
    getAllAptitudeResults,
    getAptitudeConfig,
    updateAptitudeConfig
};
