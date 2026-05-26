import Student from '../../models/student.js';

const createStudent = async (payload) => {
    return await Student.create(payload);
};

const getAllStudents = async (query = {}) => {
    return await Student.find({ ...query, isDeleted: false })
        .populate('userId', 'fullName email contactNumber')
        .populate('coordinator', 'fullName contactNumber')
        .populate('school', 'schoolName address');
};

const getStudentById = async (id) => {
    return await Student.findById(id)
        .populate('userId', 'fullName email contactNumber')
        .populate('coordinator', 'fullName contactNumber')
        .populate('school', 'schoolName address');
};

const updateStudent = async (id, payload) => {
    return await Student.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
        .populate('userId', 'fullName email contactNumber')
        .populate('coordinator', 'fullName contactNumber')
        .populate('school', 'schoolName address');
};

const deleteStudent = async (id) => {
    return await Student.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

const findStudentByMobileAndDob = async (mobileNumber, dob) => {
    return await Student.findOne({ mobileNumber, dob, isDeleted: false })
        .populate('userId', 'fullName role status');
};

export const StudentRepository = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    findStudentByMobileAndDob
};
