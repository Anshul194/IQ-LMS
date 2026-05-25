import User from '../../models/user.js';
import Team from '../../models/team.js';

const findUserByEmail = async (email) => {
    return await User.findOne({ email }).select('+password');
};

const findUserByContactNumber = async (contactNumber) => {
    return await User.findOne({ contactNumber }).select('+password');
};

const createUser = async (userData) => {
    return await User.create(userData);
};

const createTeamMember = async (teamData) => {
    return await Team.create(teamData);
};

const getTeamByRole = async (role) => {
    return await Team.find({ role })
        .populate('userId', 'email contactNumber status')
        .populate('parentCAO', 'fullName role contactNumber')
        .populate('parentAdminOfficer', 'fullName role contactNumber');
};

const getTeamById = async (id) => {
    return await Team.findById(id)
        .populate('userId', 'email contactNumber status')
        .populate('parentCAO', 'fullName role contactNumber')
        .populate('parentAdminOfficer', 'fullName role contactNumber');
};

const updateTeam = async (id, updateData) => {
    return await Team.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .populate('userId', 'email contactNumber status')
        .populate('parentCAO', 'fullName role contactNumber')
        .populate('parentAdminOfficer', 'fullName role contactNumber');
};

const deleteTeam = async (id) => {
    return await Team.findByIdAndDelete(id);
};

export const UserRepository = {
    findUserByEmail,
    findUserByContactNumber,
    createUser,
    createTeamMember,
    getTeamByRole,
    getTeamById,
    updateTeam,
    deleteTeam
};
