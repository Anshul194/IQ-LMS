import { SectionRepository } from './section.repository.js';
import AppError from '../../../utils/AppError.js';
import httpStatus from 'http-status-codes';

const createSection = async (payload) => {
    return await SectionRepository.createSection(payload);
};

const getAllSections = async (query) => {
    return await SectionRepository.getAllSections(query);
};

const getSectionById = async (id) => {
    const result = await SectionRepository.getSectionById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Section not found');
    }
    return result;
};

const updateSection = async (id, payload) => {
    const result = await SectionRepository.updateSection(id, payload);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Section not found');
    }
    return result;
};

const deleteSection = async (id) => {
    const result = await SectionRepository.deleteSection(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Section not found');
    }
    return result;
};

export const SectionService = {
    createSection,
    getAllSections,
    getSectionById,
    updateSection,
    deleteSection
};
