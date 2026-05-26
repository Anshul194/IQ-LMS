import Student from '../../models/student.js';
import User from '../../models/user.js';
import School from '../../models/school.js';
import Admission from '../../models/admission.js';

const getDashboardStats = async () => {
    const [
        totalStudents,
        activeStudents,
        totalCoordinators,
        totalSchools,
        recentStudents
    ] = await Promise.all([
        Student.countDocuments({ isDeleted: false }),
        Student.countDocuments({ isActive: true, isDeleted: false }),
        User.countDocuments({
            role: { $in: ['Coordinator', 'coordinator'] },
            isDeleted: false
        }),
        School.countDocuments({ isDeleted: false }),
        Student.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'fullName contactNumber')
    ]);

    return {
        totalStudents,
        activeStudents,
        totalCoordinators,
        totalSchools,
        recentStudents
    };
};

export const DashboardService = {
    getDashboardStats
};
