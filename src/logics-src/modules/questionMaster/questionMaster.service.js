import { QuestionMasterRepository } from './questionMaster.repository.js';
import AppError from '../../../utils/AppError.js';
import httpStatus from 'http-status-codes';
import QuestionMaster from '../../models/questionMaster.js';

const createQuestion = async (payload) => {
    return await QuestionMasterRepository.createQuestion(payload);
};

const getAllQuestions = async (query) => {
    return await QuestionMasterRepository.getAllQuestions(query);
};

const getQuestionById = async (id) => {
    const result = await QuestionMasterRepository.getQuestionById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
    }
    return result;
};

const updateQuestion = async (id, payload) => {
    const result = await QuestionMasterRepository.updateQuestion(id, payload);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
    }
    return result;
};

const deleteQuestion = async (id) => {
    const result = await QuestionMasterRepository.deleteQuestion(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
    }
    return result;
};

const assignQuestions = async (fromData, toData) => {
    // 1. Fetch questions from source
    const questions = await QuestionMaster.find({
        examType: fromData.examType,
        section: fromData.section,
        chapter: fromData.chapter,
        isDeleted: false
    }).lean();

    if (!questions.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'No questions found in source chapter');
    }

    // 2. Map to destination
    const newQuestions = questions.map(q => {
        const { _id, createdAt, updatedAt, ...rest } = q;
        return {
            ...rest,
            examType: toData.examType,
            section: toData.section,
            chapter: toData.chapter
        };
    });

    // 3. Bulk insert
    return await QuestionMaster.insertMany(newQuestions);
};

export const QuestionMasterService = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    assignQuestions
};
