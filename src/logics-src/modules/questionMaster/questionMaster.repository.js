import QuestionMaster from '../../models/questionMaster.js';

const createQuestion = async (payload) => {
    return await QuestionMaster.create(payload);
};

const getAllQuestions = async (query = {}) => {
    return await QuestionMaster.find({ ...query, isDeleted: false })
        .populate('examType')
        .populate('section')
        .populate('chapter');
};

const getQuestionById = async (id) => {
    return await QuestionMaster.findById(id)
        .populate('examType')
        .populate('section')
        .populate('chapter');
};

const updateQuestion = async (id, payload) => {
    return await QuestionMaster.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
        .populate('examType')
        .populate('section')
        .populate('chapter');
};

const deleteQuestion = async (id) => {
    return await QuestionMaster.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

const deleteQuestionsByChapter = async (chapterId) => {
    return await QuestionMaster.deleteMany({ chapter: chapterId });
};

export const QuestionMasterRepository = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    deleteQuestionsByChapter
};
