import { StudentRepository } from './student.repository.js';
import { UserRepository } from '../user/user.repository.js';
import { hashPassword } from '../../../utils/auth.utils.js';
import AppError from '../../../utils/AppError.js';
import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';

const createStudent = async (payload) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // 1. Create Base User
        const userData = {
            fullName: payload.studentName,
            contactNumber: payload.mobileNumber,
            role: 'student',
            status: 'active',
            password: payload.password ? await hashPassword(payload.password) : undefined,
        };

        const newUser = await UserRepository.createUser([userData], { session });

        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student user');
        }

        // 2. Create Student Profile
        const studentData = {
            ...payload,
            userId: newUser[0]._id
        };

        const newStudent = await StudentRepository.createStudent([studentData], { session });

        if (!newStudent.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student profile');
        }

        await session.commitTransaction();
        await session.endSession();

        return newStudent[0];
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const getAllStudents = async (query) => {
    return await StudentRepository.getAllStudents(query);
};

const getStudentById = async (id) => {
    const result = await StudentRepository.getStudentById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
    }
    return result;
};

const updateStudent = async (id, payload) => {
    const result = await StudentRepository.updateStudent(id, payload);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
    }
    return result;
};

const deleteStudent = async (id) => {
    const result = await StudentRepository.deleteStudent(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
    }
    return result;
};

export const StudentService = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};
