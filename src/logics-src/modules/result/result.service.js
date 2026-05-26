import Result from '../../models/result.js';
import QuestionMaster from '../../models/questionMaster.js';
import Exam from '../../models/exam.js';
import User from '../../models/user.js';
import ExamType from '../../models/examType.js';
import AppError from '../../../utils/AppError.js';
import httpStatus from 'http-status-codes';

const submitResult = async (userId, payload) => {
    const { examId, answers } = payload;

    // 1. Fetch questions to verify answers
    const questionIds = answers.map(a => a.questionId);
    const questions = await QuestionMaster.find({ _id: { $in: questionIds } });

    if (!questions.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'Questions not found');
    }

    let correctCount = 0;
    const processedAnswers = answers.map(submitted => {
        const question = questions.find(q => q._id.toString() === submitted.questionId);
        const isCorrect = question ? question.correctAnswer === submitted.selectedOption : false;
        if (isCorrect) correctCount++;
        return {
            ...submitted,
            isCorrect
        };
    });

    const totalQuestions = questions.length;
    const percentage = (correctCount / totalQuestions) * 100;
    const status = percentage >= 40 ? 'pass' : 'fail'; // Standard passing mark

    const resultData = {
        userId,
        examId,
        score: correctCount, // Simplified score
        totalQuestions,
        correctAnswersCount: correctCount,
        percentage,
        status,
        answers: processedAnswers
    };

    const newResult = await Result.create(resultData);
    return newResult;
};


const getMyResults = async (userId) => {
    return await Result.find({ userId })
        .populate('examId', 'examType')
        .sort({ createdAt: -1 });
};

const getResultById = async (id) => {
    return await Result.findById(id)
        .populate('userId', 'fullName')
        .populate('examId', 'examType')
        .populate('answers.questionId');
};

const getMyCertificates = async (userId) => {
    return await Result.find({ userId, status: 'pass' })
        .populate('examId', 'examType')
        .sort({ createdAt: -1 });
};

export const ResultService = {
    submitResult,
    getMyResults,
    getResultById,
    getMyCertificates
};
