import ExamType from '../../models/examType.js';

const createExamType = async (payload) => {
    return await ExamType.create(payload);
};

const getAllExamTypes = async (query = {}) => {
    return await ExamType.find({ ...query, isDeleted: false });
};

const getExamTypeById = async (id) => {
    return await ExamType.findById(id);
};

const updateExamType = async (id, payload) => {
    return await ExamType.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
};

const deleteExamType = async (id) => {
    return await ExamType.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const ExamTypeRepository = {
    createExamType,
    getAllExamTypes,
    getExamTypeById,
    updateExamType,
    deleteExamType
};
