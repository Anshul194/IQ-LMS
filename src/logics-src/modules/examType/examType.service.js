import { ExamTypeRepository } from './examType.repository.js';
import AppError from '../../../utils/AppError.js';
import httpStatus from 'http-status-codes';

const createExamType = async (payload) => {
    return await ExamTypeRepository.createExamType(payload);
};

const getAllExamTypes = async (query) => {
    return await ExamTypeRepository.getAllExamTypes(query);
};

const getExamTypeById = async (id) => {
    const result = await ExamTypeRepository.getExamTypeById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Exam Type not found');
    }
    return result;
};

const updateExamType = async (id, payload) => {
    const result = await ExamTypeRepository.updateExamType(id, payload);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Exam Type not found');
    }
    return result;
};

const deleteExamType = async (id) => {
    const result = await ExamTypeRepository.deleteExamType(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Exam Type not found');
    }
    return result;
};

export const ExamTypeService = {
    createExamType,
    getAllExamTypes,
    getExamTypeById,
    updateExamType,
    deleteExamType
};
