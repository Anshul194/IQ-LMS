import { ExamCenterRepository } from './examCenter.repository.js';
import AppError from '../../../utils/AppError.js';
import httpStatus from 'http-status-codes';

const createExamCenter = async (payload) => {
    return await ExamCenterRepository.createExamCenter(payload);
};

const getAllExamCenters = async (query) => {
    return await ExamCenterRepository.getAllExamCenters(query);
};

const getExamCenterById = async (id) => {
    const result = await ExamCenterRepository.getExamCenterById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Exam Center not found');
    }
    return result;
};

const updateExamCenter = async (id, payload) => {
    const result = await ExamCenterRepository.updateExamCenter(id, payload);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Exam Center not found');
    }
    return result;
};

const deleteExamCenter = async (id) => {
    const result = await ExamCenterRepository.deleteExamCenter(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Exam Center not found');
    }
    return result;
};

export const ExamCenterService = {
    createExamCenter,
    getAllExamCenters,
    getExamCenterById,
    updateExamCenter,
    deleteExamCenter
};
