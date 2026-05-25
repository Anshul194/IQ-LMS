import ExamCenter from '../../models/examCenter.js';

const createExamCenter = async (payload) => {
    return await ExamCenter.create(payload);
};

const getAllExamCenters = async (query = {}) => {
    return await ExamCenter.find({ ...query, isDeleted: false })
        .populate('school', 'schoolName address');
};

const getExamCenterById = async (id) => {
    return await ExamCenter.findById(id)
        .populate('school', 'schoolName address');
};

const updateExamCenter = async (id, payload) => {
    return await ExamCenter.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
        .populate('school', 'schoolName address');
};

const deleteExamCenter = async (id) => {
    return await ExamCenter.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const ExamCenterRepository = {
    createExamCenter,
    getAllExamCenters,
    getExamCenterById,
    updateExamCenter,
    deleteExamCenter
};
