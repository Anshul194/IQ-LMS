import catchAsync from '../../../utils/catchAsync.js';
import sendResponse from '../../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { SectionService } from './section.service.js';

const createSection = catchAsync(async (req, res) => {
    const result = await SectionService.createSection(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Section created successfully',
        data: result,
    });
});

const getAllSections = catchAsync(async (req, res) => {
    const result = await SectionService.getAllSections(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Sections retrieved successfully',
        data: result,
    });
});

const getSectionById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SectionService.getSectionById(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Section retrieved successfully',
        data: result,
    });
});

const updateSection = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SectionService.updateSection(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Section updated successfully',
        data: result,
    });
});

const deleteSection = catchAsync(async (req, res) => {
    const { id } = req.params;
    await SectionService.deleteSection(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Section deleted successfully',
        data: null,
    });
});

export const SectionController = {
    createSection,
    getAllSections,
    getSectionById,
    updateSection,
    deleteSection
};
