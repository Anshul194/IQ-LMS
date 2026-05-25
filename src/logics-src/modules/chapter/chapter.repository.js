import Chapter from '../../models/chapter.js';

const createChapter = async (payload) => {
    return await Chapter.create(payload);
};

const getAllChapters = async (query = {}) => {
    return await Chapter.find({ ...query, isDeleted: false })
        .populate('examType')
        .populate('section');
};

const getChapterById = async (id) => {
    return await Chapter.findById(id)
        .populate('examType')
        .populate('section');
};

const updateChapter = async (id, payload) => {
    return await Chapter.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
        .populate('examType')
        .populate('section');
};

const deleteChapter = async (id) => {
    return await Chapter.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const ChapterRepository = {
    createChapter,
    getAllChapters,
    getChapterById,
    updateChapter,
    deleteChapter
};
