import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { ExportService } from './export.service.js';
import { generateExcelBuffer } from '../../../utils/excel.utils.js';
import ExcelJS from 'exceljs';

// ─── Helper: Send Excel or JSON ─────────────────────────────────────────
const handleExportResponse = async (req, res, result, fileName, sheetName) => {
    // Default to excel unless format=json is explicitly requested
    if (req.query.format !== 'json') {
        const buffer = await generateExcelBuffer(result.data, { sheetName });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        return res.send(buffer);
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `${sheetName} data exported successfully`,
        data: result,
    });
};

// GET /api/v1/export/students
const exportStudents = catchAsync(async (req, res) => {
    const result = await ExportService.exportStudents(req.query);
    await handleExportResponse(req, res, result, 'students_master', 'Students');
});

// GET /api/v1/export/coordinators
const exportCoordinators = catchAsync(async (req, res) => {
    const result = await ExportService.exportCoordinators(req.query);
    await handleExportResponse(req, res, result, 'coordinators_list', 'Coordinators');
});

// GET /api/v1/export/team
const exportTeamMembers = catchAsync(async (req, res) => {
    const result = await ExportService.exportTeamMembers(req.query);
    await handleExportResponse(req, res, result, 'team_members', 'Team Members');
});

// GET /api/v1/export/schools
const exportSchools = catchAsync(async (req, res) => {
    const result = await ExportService.exportSchools(req.query);
    await handleExportResponse(req, res, result, 'schools_list', 'Schools');
});

// GET /api/v1/export/exam-centers
const exportExamCenters = catchAsync(async (req, res) => {
    const result = await ExportService.exportExamCenters(req.query);
    await handleExportResponse(req, res, result, 'exam_centers', 'Exam Centers');
});

// GET /api/v1/export/exam-types
const exportExamTypes = catchAsync(async (req, res) => {
    const result = await ExportService.exportExamTypes(req.query);
    await handleExportResponse(req, res, result, 'exam_types', 'Exam Types');
});

// GET /api/v1/export/sections
const exportSections = catchAsync(async (req, res) => {
    const result = await ExportService.exportSections(req.query);
    await handleExportResponse(req, res, result, 'sections_list', 'Sections');
});

// GET /api/v1/export/chapters
const exportChapters = catchAsync(async (req, res) => {
    const result = await ExportService.exportChapters(req.query);
    await handleExportResponse(req, res, result, 'chapters_list', 'Chapters');
});

// GET /api/v1/export/questions
const exportQuestions = catchAsync(async (req, res) => {
    const result = await ExportService.exportQuestions(req.query);
    await handleExportResponse(req, res, result, 'questions_master', 'Questions');
});

// GET /api/v1/export/results
const exportResults = catchAsync(async (req, res) => {
    const result = await ExportService.exportResults(req.query);
    await handleExportResponse(req, res, result, 'exam_results', 'Results');
});

// GET /api/v1/export/admissions
const exportAdmissions = catchAsync(async (req, res) => {
    const result = await ExportService.exportAdmissions(req.query);
    await handleExportResponse(req, res, result, 'admissions_list', 'Admissions');
});

// GET /api/v1/export/all
const exportAll = catchAsync(async (req, res) => {
    const result = await ExportService.exportAll(req.query);

    if (req.query.format !== 'json') {
        const workbook = new ExcelJS.Workbook();
        
        // Helper to add sheet
        const addSheet = (wb, name, data) => {
            const ws = wb.addWorksheet(name);
            if (data.length > 0) {
                const cols = Object.keys(data[0]).map(k => ({ header: k, key: k, width: 20 }));
                ws.columns = cols;
                ws.addRows(data);
                ws.getRow(1).font = { bold: true };
            }
        };

        addSheet(workbook, 'Students', result.students.data);
        addSheet(workbook, 'Coordinators', result.coordinators.data);
        addSheet(workbook, 'Schools', result.schools.data);
        addSheet(workbook, 'Exam Centers', result.examCenters.data);
        addSheet(workbook, 'Exam Types', result.examTypes.data);
        addSheet(workbook, 'Sections', result.sections.data);
        addSheet(workbook, 'Chapters', result.chapters.data);
        addSheet(workbook, 'Questions', result.questions.data);
        addSheet(workbook, 'Results', result.results.data);
        addSheet(workbook, 'Admissions', result.admissions.data);

        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=all_data_export.xlsx');
        return res.send(buffer);
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All data exported successfully',
        data: result,
    });
});

export const ExportController = {
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
