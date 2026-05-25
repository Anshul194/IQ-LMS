import Section from '../../models/section.js';

const createSection = async (payload) => {
    return await Section.create(payload);
};

const getAllSections = async (query = {}) => {
    return await Section.find({ ...query, isDeleted: false }).populate('examType');
};

const getSectionById = async (id) => {
    return await Section.findById(id).populate('examType');
};

const updateSection = async (id, payload) => {
    return await Section.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate('examType');
};

const deleteSection = async (id) => {
    return await Section.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const SectionRepository = {
    createSection,
    getAllSections,
    getSectionById,
    updateSection,
    deleteSection
};
