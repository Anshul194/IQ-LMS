import httpStatus from 'http-status-codes';
import AppError from '../../../utils/AppError.js';
import { UserRepository } from './user.repository.js';
import { hashPassword } from '../../../utils/auth.utils.js';
import mongoose from 'mongoose';

const createStudent = async (payload, file) => {
    // Map name to fullName if necessary
    if (!payload.fullName && payload.name) {
        payload.fullName = payload.name;
    }

    // Hash password if provided
    if (payload.password) {
        payload.password = await hashPassword(payload.password);
    }
    payload.role = 'student';

    if (file) {
        payload.idProof = {
            fileName: file.filename,
            fileUrl: file.path, // or URL if using cloudinary later
            publicId: file.filename
        };
    }

    const result = await UserRepository.createUser(payload);
    return result;
};

const createTeamMember = async (payload, file) => {
    // Map name to fullName if necessary
    if (!payload.fullName && payload.name) {
        payload.fullName = payload.name;
    }

    // Internal Parent Mapping
    if (payload.parentId) {
        const role = payload.role;
        if (role === 'Administrative Officer' || role === 'administrative_officer') {
            payload.parentCAO = payload.parentId;
        } else if (role === 'Chief Administrator' || role === 'chief_administrator') {
            payload.parentAdminOfficer = payload.parentId;
        } else {
            // Default fallback if role doesn't match specific logic but parentId is given
            payload.parentCAO = payload.parentId;
        }
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Map file for team
        if (file) {
            payload.idProof = {
                fileName: file.filename,
                fileUrl: file.path,
                publicId: file.filename
            };
        }

        // 1. Create Base User for Login
        const userData = {
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password ? await hashPassword(payload.password) : undefined,
            contactNumber: payload.contactNumber,
            role: payload.role, // cao, administrative_officer, etc.
            status: 'active'
        };

        const newUser = await UserRepository.createUser([userData], { session });

        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
        }

        // 2. Create Team Profile
        const teamData = {
            userId: newUser[0]._id,
            fullName: payload.fullName,
            contactNumber: payload.contactNumber,
            address: payload.address,
            role: payload.role,
            parentCAO: payload.parentCAO,
            parentAdminOfficer: payload.parentAdminOfficer,
            idProof: payload.idProof
        };

        const newTeam = await UserRepository.createTeamMember([teamData], { session });

        if (!newTeam.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create team profile');
        }

        await session.commitTransaction();
        await session.endSession();

        return newTeam[0];
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const getTeamByRole = async (role) => {
    const result = await UserRepository.getTeamByRole(role);
    return result;
};

const getTeamById = async (id) => {
    const result = await UserRepository.getTeamById(id);
    if (!result) {
        throw new AppError(404, 'Team member not found');
    }
    return result;
};

const updateTeam = async (id, payload, file) => {
    // Map name to fullName
    if (!payload.fullName && payload.name) {
        payload.fullName = payload.name;
    }

    // Parent mapping
    if (payload.parentId) {
        const role = payload.role;
        if (role === 'Administrative Officer' || role === 'administrative_officer') {
            payload.parentCAO = payload.parentId;
        } else if (role === 'Chief Administrator' || role === 'chief_administrator') {
            payload.parentAdminOfficer = payload.parentId;
        } else {
            payload.parentCAO = payload.parentId;
        }
    }

    // File update
    if (file) {
        payload.idProof = {
            fileName: file.filename,
            fileUrl: file.path,
            publicId: file.filename
        };
    }

    const result = await UserRepository.updateTeam(id, payload);
    if (!result) {
        throw new AppError(404, 'Team member not found');
    }
    return result;
};

const deleteTeam = async (id) => {
    const result = await UserRepository.deleteTeam(id);
    if (!result) {
        throw new AppError(404, 'Team member not found');
    }
    return result;
};

export const UserService = {
    createStudent,
    createTeamMember,
    getTeamByRole,
    getTeamById,
    updateTeam,
    deleteTeam
};
