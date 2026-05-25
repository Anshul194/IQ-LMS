import { SchoolRepository } from './school.repository.js';
import AppError from '../../../utils/AppError.js';
import httpStatus from 'http-status-codes';

const createSchool = async (payload) => {
    return await SchoolRepository.createSchool(payload);
};

const getAllSchools = async (query) => {
    return await SchoolRepository.getAllSchools(query);
};

const getSchoolById = async (id) => {
    const result = await SchoolRepository.getSchoolById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'School not found');
    }
    return result;
};

const updateSchool = async (id, payload) => {
    const result = await SchoolRepository.updateSchool(id, payload);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'School not found');
    }
    return result;
};

const deleteSchool = async (id) => {
    const result = await SchoolRepository.deleteSchool(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'School not found');
    }
    return result;
};

export const SchoolService = {
    createSchool,
    getAllSchools,
    getSchoolById,
    updateSchool,
    deleteSchool
};
