import Student from '../../models/student.js';
import Team from '../../models/team.js';
import School from '../../models/school.js';
import ExamCenter from '../../models/examCenter.js';
import ExamType from '../../models/examType.js';
import Section from '../../models/section.js';
import Chapter from '../../models/chapter.js';
import QuestionMaster from '../../models/questionMaster.js';
import Result from '../../models/result.js';
import Admission from '../../models/admission.js';

// ─── Shared: Apply date range filter on createdAt ───────────────────────
const applyDateFilter = (query, filters) => {
    if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
            query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
            // Set endDate to end-of-day so the full day is included
            const end = new Date(filters.endDate);
            end.setHours(23, 59, 59, 999);
            query.createdAt.$lte = end;
        }
    }
    return query;
};

// ─── Student Master Export ──────────────────────────────────────────────
const getAllStudentsForExport = async (filters = {}) => {
    const query = { isDeleted: false };

    if (filters.coordinator) query.coordinator = filters.coordinator;
    if (filters.school) query.school = filters.school;
    if (filters.grade) query.grade = filters.grade;
    if (filters.language) query.language = filters.language;
    
    // Case-insensitive gender
    if (filters.gender) {
        query.gender = { $regex: '^' + filters.gender + '$', $options: 'i' };
    }

    if (filters.isActive !== undefined) query.isActive = filters.isActive === 'true';
    if (filters.isSubscribed !== undefined) query.isSubscribed = filters.isSubscribed === 'true';
    applyDateFilter(query, filters);

    return await Student.find(query)
        .populate('userId', 'fullName email contactNumber status')
        .populate('coordinator', 'fullName contactNumber role')
        .populate('school', 'schoolName address contactNumber')
        .sort({ createdAt: -1 })
        .lean();
};

// ─── Coordinator List Export ────────────────────────────────────────────
const getAllCoordinatorsForExport = async (filters = {}) => {
    // Match both 'coordinator' and 'Coordinator' as per team model enum
    const query = { role: { $in: ['coordinator', 'Coordinator'] } };

    if (filters.status) {
        query.status = { $regex: '^' + filters.status + '$', $options: 'i' };
    }
    applyDateFilter(query, filters);

    return await Team.find(query)
        .populate('userId', 'fullName email contactNumber status')
        .populate('parentCAO', 'fullName role contactNumber')
        .populate('parentAdminOfficer', 'fullName role contactNumber')
        .sort({ createdAt: -1 })
        .lean();
};

// ─── All Team Members Export ────────────────────────────────────────────
const getAllTeamMembersForExport = async (filters = {}) => {
    const query = {};

    if (filters.role) {
        query.role = { $regex: '^' + filters.role + '$', $options: 'i' };
    }
    if (filters.status) {
        query.status = { $regex: '^' + filters.status + '$', $options: 'i' };
    }
    applyDateFilter(query, filters);

    return await Team.find(query)
        .populate('userId', 'fullName email contactNumber status')
        .populate('parentCAO', 'fullName role contactNumber')
        .populate('parentAdminOfficer', 'fullName role contactNumber')
        .sort({ createdAt: -1 })
        .lean();
};

// ─── School List Export ─────────────────────────────────────────────────
const getAllSchoolsForExport = async (filters = {}) => {
    const query = { isDeleted: false };

    if (filters.coordinator) query.coordinator = filters.coordinator;
    applyDateFilter(query, filters);

    return await School.find(query)
        .populate('coordinator', 'fullName contactNumber role')
        .sort({ createdAt: -1 })
        .lean();
};

// ─── Exam Center List Export ────────────────────────────────────────────
const getAllExamCentersForExport = async (filters = {}) => {
    const query = { isDeleted: false };

    if (filters.school) query.school = filters.school;
    applyDateFilter(query, filters);

    return await ExamCenter.find(query)
        .populate('school', 'schoolName address contactNumber')
        .sort({ createdAt: -1 })
        .lean();
};

// ─── Exam Type Export ───────────────────────────────────────────────────
const getAllExamTypesForExport = async (filters = {}) => {
    const query = { isDeleted: false };

    if (filters.className) query.className = filters.className;
    if (filters.language) query.language = filters.language;
    applyDateFilter(query, filters);

    return await ExamType.find(query)
        .sort({ createdAt: -1 })
        .lean();
};

// ─── Section Export ─────────────────────────────────────────────────────
const getAllSectionsForExport = async (filters = {}) => {
    const query = { isDeleted: false };

    if (filters.examType) query.examType = filters.examType;
    applyDateFilter(query, filters);

    return await Section.find(query)
        .populate('examType', 'examType className language')
        .sort({ createdAt: -1 })
        .lean();
};

// ─── Chapter Export ─────────────────────────────────────────────────────
const getAllChaptersForExport = async (filters = {}) => {
    const query = { isDeleted: false };

    if (filters.examType) query.examType = filters.examType;
    if (filters.section) query.section = filters.section;
    applyDateFilter(query, filters);

    return await Chapter.find(query)
        .populate('examType', 'examType className language')
        .populate('section', 'sectionName')
        .sort({ sequence: 1, createdAt: -1 })
        .lean();
};

// ─── Question Master Export ─────────────────────────────────────────────
const getAllQuestionsForExport = async (filters = {}) => {
    const query = { isDeleted: false };

    if (filters.examType) query.examType = filters.examType;
    if (filters.section) query.section = filters.section;
    if (filters.chapter) query.chapter = filters.chapter;
    applyDateFilter(query, filters);

    return await QuestionMaster.find(query)
        .populate('examType', 'examType className language')
        .populate('section', 'sectionName')
        .populate('chapter', 'chapterName')
        .sort({ createdAt: -1 })
        .lean();
};

// ─── Result Export ──────────────────────────────────────────────────────
const getAllResultsForExport = async (filters = {}) => {
    const query = {};

    if (filters.status) {
        query.status = { $regex: '^' + filters.status + '$', $options: 'i' };
    }
    if (filters.examId) query.examId = filters.examId;
    if (filters.userId) query.userId = filters.userId;
    applyDateFilter(query, filters);

    return await Result.find(query)
        .populate('userId', 'fullName email contactNumber')
        .populate('examId', 'examType className language')
        .sort({ createdAt: -1 })
        .lean();
};

// ─── Admission Export ───────────────────────────────────────────────────
const getAllAdmissionsForExport = async (filters = {}) => {
    const query = {};

    if (filters.status) {
        query.status = { $regex: '^' + filters.status + '$', $options: 'i' };
    }
    if (filters.grade) query.grade = filters.grade;
    if (filters.academicYear) query.academicYear = filters.academicYear;
    applyDateFilter(query, filters);

    return await Admission.find(query)
        .populate('studentId', 'fullName email contactNumber')
        .populate('processedBy', 'fullName email')
        .sort({ createdAt: -1 })
        .lean();
};

export const ExportRepository = {
    getAllStudentsForExport,
    getAllCoordinatorsForExport,
    getAllTeamMembersForExport,
    getAllSchoolsForExport,
    getAllExamCentersForExport,
    getAllExamTypesForExport,
    getAllSectionsForExport,
    getAllChaptersForExport,
    getAllQuestionsForExport,
    getAllResultsForExport,
    getAllAdmissionsForExport,
};
