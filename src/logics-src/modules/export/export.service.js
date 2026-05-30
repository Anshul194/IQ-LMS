import { ExportRepository } from './export.repository.js';

// ─── Transform student data for export ──────────────────────────────────
const transformStudentData = (student) => ({
    _id: student._id,
    studentName: student.studentName,
    mobileNumber: student.mobileNumber,
    email: student.userId?.email || '',
    gender: student.gender || '',
    dob: student.dob ? new Date(student.dob).toLocaleDateString('en-IN') : '',
    grade: student.grade || '',
    language: student.language || '',
    address: student.address || '',
    coordinatorName: student.coordinator?.fullName || '',
    coordinatorContact: student.coordinator?.contactNumber || '',
    schoolName: student.school?.schoolName || '',
    schoolAddress: student.school?.address || '',
    paidAmount: student.paidAmount || 0,
    isActive: student.isActive,
    isSubscribed: student.isSubscribed,
    sendWhatsappAlert: student.sendWhatsappAlert,
    createdAt: new Date(student.createdAt).toLocaleDateString('en-IN'),
});

// ─── Transform coordinator / team data for export ───────────────────────
const transformCoordinatorData = (coordinator) => ({
    _id: coordinator._id,
    fullName: coordinator.fullName,
    contactNumber: coordinator.contactNumber,
    email: coordinator.userId?.email || '',
    role: coordinator.role,
    address: coordinator.address || '',
    parentCAO: coordinator.parentCAO?.fullName || '',
    parentAdminOfficer: coordinator.parentAdminOfficer?.fullName || '',
    status: coordinator.status,
    idProofUrl: coordinator.idProof?.fileUrl || '',
    createdAt: new Date(coordinator.createdAt).toLocaleDateString('en-IN'),
});

// ─── Transform school data for export ───────────────────────────────────
const transformSchoolData = (school) => ({
    _id: school._id,
    schoolName: school.schoolName,
    contactNumber: school.contactNumber,
    address: school.address,
    coordinatorName: school.coordinator?.fullName || '',
    coordinatorContact: school.coordinator?.contactNumber || '',
    associateCoordinatorName: school.associateCoordinatorName || '',
    createdAt: new Date(school.createdAt).toLocaleDateString('en-IN'),
});

// ─── Transform exam center data for export ──────────────────────────────
const transformExamCenterData = (center) => ({
    _id: center._id,
    firmName: center.firmName,
    respondentName: center.respondentName,
    contactNumber: center.contactNumber,
    address: center.address,
    computerCount: center.computerCount,
    schoolName: center.school?.schoolName || '',
    schoolAddress: center.school?.address || '',
    createdAt: new Date(center.createdAt).toLocaleDateString('en-IN'),
});

// ─── Transform exam type data for export ────────────────────────────────
const transformExamTypeData = (examType) => ({
    _id: examType._id,
    examType: examType.examType,
    className: examType.className,
    language: examType.language,
    createdAt: new Date(examType.createdAt).toLocaleDateString('en-IN'),
});

// ─── Transform section data for export ──────────────────────────────────
const transformSectionData = (section) => ({
    _id: section._id,
    sectionName: section.sectionName,
    chapterCount: section.chapterCount || 0,
    description: section.description || '',
    examType: section.examType?.examType || '',
    className: section.examType?.className || '',
    language: section.examType?.language || '',
    logoUrl: section.logo?.fileUrl || '',
    createdAt: new Date(section.createdAt).toLocaleDateString('en-IN'),
});

// ─── Transform chapter data for export ──────────────────────────────────
const transformChapterData = (chapter) => ({
    _id: chapter._id,
    chapterName: chapter.chapterName,
    sequence: chapter.sequence || 0,
    questionCount: chapter.questionCount || 0,
    description: chapter.description || '',
    examType: chapter.examType?.examType || '',
    className: chapter.examType?.className || '',
    sectionName: chapter.section?.sectionName || '',
    logoUrl: chapter.logo?.fileUrl || '',
    createdAt: new Date(chapter.createdAt).toLocaleDateString('en-IN'),
});

// ─── Transform question data for export ─────────────────────────────────
const transformQuestionData = (question) => ({
    _id: question._id,
    questionText: question.questionText,
    correctAnswer: question.correctAnswer,
    optionA: question.options?.A?.text || '',
    optionB: question.options?.B?.text || '',
    optionC: question.options?.C?.text || '',
    optionD: question.options?.D?.text || '',
    examType: question.examType?.examType || '',
    className: question.examType?.className || '',
    sectionName: question.section?.sectionName || '',
    chapterName: question.chapter?.chapterName || '',
    questionImageUrl: question.questionImage?.fileUrl || '',
    createdAt: new Date(question.createdAt).toLocaleDateString('en-IN'),
});

// ─── Transform result data for export ───────────────────────────────────
const transformResultData = (result) => ({
    _id: result._id,
    studentName: result.userId?.fullName || '',
    studentEmail: result.userId?.email || '',
    studentContact: result.userId?.contactNumber || '',
    examType: result.examId?.examType || '',
    className: result.examId?.className || '',
    score: result.score,
    totalQuestions: result.totalQuestions,
    correctAnswersCount: result.correctAnswersCount,
    percentage: result.percentage,
    status: result.status,
    completedAt: result.completedAt ? new Date(result.completedAt).toLocaleDateString('en-IN') : '',
    createdAt: new Date(result.createdAt).toLocaleDateString('en-IN'),
});

// ─── Transform admission data for export ────────────────────────────────
const transformAdmissionData = (admission) => ({
    _id: admission._id,
    studentName: admission.studentId?.fullName || '',
    studentEmail: admission.studentId?.email || '',
    studentContact: admission.studentId?.contactNumber || '',
    grade: admission.grade,
    academicYear: admission.academicYear,
    enrollmentDate: admission.enrollmentDate ? new Date(admission.enrollmentDate).toLocaleDateString('en-IN') : '',
    status: admission.status,
    processedBy: admission.processedBy?.fullName || '',
    documentCount: admission.documents?.length || 0,
    createdAt: new Date(admission.createdAt).toLocaleDateString('en-IN'),
});

// ═══════════════════════════════════════════════════════════════════════
// Service Methods
// ═══════════════════════════════════════════════════════════════════════

const exportStudents = async (filters) => {
    const students = await ExportRepository.getAllStudentsForExport(filters);
    return {
        total: students.length,
        exportedAt: new Date().toISOString(),
        data: students.map(transformStudentData),
    };
};

const exportCoordinators = async (filters) => {
    const coordinators = await ExportRepository.getAllCoordinatorsForExport(filters);
    return {
        total: coordinators.length,
        exportedAt: new Date().toISOString(),
        data: coordinators.map(transformCoordinatorData),
    };
};

const exportTeamMembers = async (filters) => {
    const members = await ExportRepository.getAllTeamMembersForExport(filters);
    return {
        total: members.length,
        exportedAt: new Date().toISOString(),
        data: members.map(transformCoordinatorData),
    };
};

const exportSchools = async (filters) => {
    const schools = await ExportRepository.getAllSchoolsForExport(filters);
    return {
        total: schools.length,
        exportedAt: new Date().toISOString(),
        data: schools.map(transformSchoolData),
    };
};

const exportExamCenters = async (filters) => {
    const centers = await ExportRepository.getAllExamCentersForExport(filters);
    return {
        total: centers.length,
        exportedAt: new Date().toISOString(),
        data: centers.map(transformExamCenterData),
    };
};

const exportExamTypes = async (filters) => {
    const examTypes = await ExportRepository.getAllExamTypesForExport(filters);
    return {
        total: examTypes.length,
        exportedAt: new Date().toISOString(),
        data: examTypes.map(transformExamTypeData),
    };
};

const exportSections = async (filters) => {
    const sections = await ExportRepository.getAllSectionsForExport(filters);
    return {
        total: sections.length,
        exportedAt: new Date().toISOString(),
        data: sections.map(transformSectionData),
    };
};

const exportChapters = async (filters) => {
    const chapters = await ExportRepository.getAllChaptersForExport(filters);
    return {
        total: chapters.length,
        exportedAt: new Date().toISOString(),
        data: chapters.map(transformChapterData),
    };
};

const exportQuestions = async (filters) => {
    const questions = await ExportRepository.getAllQuestionsForExport(filters);
    return {
        total: questions.length,
        exportedAt: new Date().toISOString(),
        data: questions.map(transformQuestionData),
    };
};

const exportResults = async (filters) => {
    const results = await ExportRepository.getAllResultsForExport(filters);
    return {
        total: results.length,
        exportedAt: new Date().toISOString(),
        data: results.map(transformResultData),
    };
};

const exportAdmissions = async (filters) => {
    const admissions = await ExportRepository.getAllAdmissionsForExport(filters);
    return {
        total: admissions.length,
        exportedAt: new Date().toISOString(),
        data: admissions.map(transformAdmissionData),
    };
};

const exportAll = async (filters) => {
    const [students, coordinators, schools, examCenters, examTypes, sections, chapters, questions, results, admissions] = await Promise.all([
        ExportRepository.getAllStudentsForExport(filters),
        ExportRepository.getAllCoordinatorsForExport(filters),
        ExportRepository.getAllSchoolsForExport(filters),
        ExportRepository.getAllExamCentersForExport(filters),
        ExportRepository.getAllExamTypesForExport(filters),
        ExportRepository.getAllSectionsForExport(filters),
        ExportRepository.getAllChaptersForExport(filters),
        ExportRepository.getAllQuestionsForExport(filters),
        ExportRepository.getAllResultsForExport(filters),
        ExportRepository.getAllAdmissionsForExport(filters),
    ]);

    return {
        exportedAt: new Date().toISOString(),
        students: {
            total: students.length,
            data: students.map(transformStudentData),
        },
        coordinators: {
            total: coordinators.length,
            data: coordinators.map(transformCoordinatorData),
        },
        schools: {
            total: schools.length,
            data: schools.map(transformSchoolData),
        },
        examCenters: {
            total: examCenters.length,
            data: examCenters.map(transformExamCenterData),
        },
        examTypes: {
            total: examTypes.length,
            data: examTypes.map(transformExamTypeData),
        },
        sections: {
            total: sections.length,
            data: sections.map(transformSectionData),
        },
        chapters: {
            total: chapters.length,
            data: chapters.map(transformChapterData),
        },
        questions: {
            total: questions.length,
            data: questions.map(transformQuestionData),
        },
        results: {
            total: results.length,
            data: results.map(transformResultData),
        },
        admissions: {
            total: admissions.length,
            data: admissions.map(transformAdmissionData),
        },
    };
};

export const ExportService = {
    exportStudents,
    exportCoordinators,
    exportTeamMembers,
    exportSchools,
    exportExamCenters,
    exportExamTypes,
    exportSections,
    exportChapters,
    exportQuestions,
    exportResults,
    exportAdmissions,
    exportAll,
};
