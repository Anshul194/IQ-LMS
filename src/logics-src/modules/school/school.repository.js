import School from '../../models/school.js';

const createSchool = async (payload) => {
    return await School.create(payload);
};

const getAllSchools = async (query = {}) => {
    return await School.find({ ...query, isDeleted: false })
        .populate('coordinator', 'fullName contactNumber email');
};

const getSchoolById = async (id) => {
    return await School.findById(id)
        .populate('coordinator', 'fullName contactNumber email');
};

const updateSchool = async (id, payload) => {
    return await School.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
        .populate('coordinator', 'fullName contactNumber email');
};

const deleteSchool = async (id) => {
    return await School.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const SchoolRepository = {
    createSchool,
    getAllSchools,
    getSchoolById,
    updateSchool,
    deleteSchool
};
