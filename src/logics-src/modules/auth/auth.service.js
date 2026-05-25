import httpStatus from 'http-status-codes';
import AppError from '../../../utils/AppError.js';
import { UserRepository } from '../user/user.repository.js';
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

export const AuthService = {
    loginUser
};
