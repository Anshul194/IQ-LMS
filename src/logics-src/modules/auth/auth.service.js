import httpStatus from 'http-status-codes';
import AppError from '../../../utils/AppError.js';
import { UserRepository } from '../user/user.repository.js';
import { StudentRepository } from '../student/student.repository.js';
import { createToken, isPasswordMatched } from '../../../utils/auth.utils.js';
import config from '../../../config/index.js';

const loginUser = async (payload) => {
    const user = await UserRepository.findUserByContactNumber(payload.contactNumber);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
    }

    if (user.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    }

    const passwordMatch = await isPasswordMatched(payload.password, user.password);

    if (!passwordMatch) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
    }

    const jwtPayload = {
        userId: user._id,
        role: user.role
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt.secret,
        config.jwt.expires_in
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt.refresh_secret,
        config.jwt.refresh_expires_in
    );

    return {
        accessToken,
        refreshToken,
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        }
    };
};

const loginStudentByDob = async (payload) => {
    // Ensure dob is treated as a Date for comparison
    const searchDate = new Date(payload.dob);
    const student = await StudentRepository.findStudentByMobileAndDob(payload.mobileNumber, searchDate);

    if (!student) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Mobile Number or Date of Birth');
    }

    if (!student.isActive) {
        throw new AppError(httpStatus.FORBIDDEN, 'Student account is inactive');
    }

    const user = student.userId;

    const jwtPayload = {
        userId: user._id,
        role: user.role,
        studentId: student._id
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt.secret,
        config.jwt.expires_in
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt.refresh_secret,
        config.jwt.refresh_expires_in
    );

    return {
        accessToken,
        refreshToken,
        user: {
            _id: user._id,
            fullName: user.fullName,
            role: user.role,
            studentId: student._id,
            studentName: student.studentName,
            grade: student.grade
        }
    };
};

export const AuthService = {
    loginUser,
    loginStudentByDob
};
