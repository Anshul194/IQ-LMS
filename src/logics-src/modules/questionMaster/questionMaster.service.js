import { QuestionMasterRepository } from './questionMaster.repository.js';
import AppError from '../../../utils/AppError.js';
import httpStatus from 'http-status-codes';
import QuestionMaster from '../../models/questionMaster.js';
import ExamType from '../../models/examType.js';

const createQuestion = async (payload) => {
    return await QuestionMasterRepository.createQuestion(payload);
};

const getAllQuestions = async (query) => {
    const { grade, examType, section, chapter, ...remainingQuery } = query;
    const filter = { ...remainingQuery, isDeleted: false };

    if (grade) {
        // Find exam type that matches the grade ( className in model )
        const foundExamType = await ExamType.findOne({
            className: { $regex: new RegExp(`^${grade}`, 'i') }
        });
        if (foundExamType) {
            filter.examType = foundExamType._id;
        } else {
            // If grade requested but no exam type found, return empty set rather than all questions
            return [];
        }
    }

    if (examType) filter.examType = examType;
    if (section) filter.section = section;
    if (chapter) filter.chapter = chapter;

    const questions = await QuestionMasterRepository.getAllQuestions(filter);

    // If grade is specified, structure the response by section and chapter, and remove correct answers
    if (grade) {
        const sectionsMap = {};

        for (const q of questions) {
            const sectionObj = q.section;
            const chapterObj = q.chapter;

            if (!sectionObj || !chapterObj) continue;

            const sectionId = sectionObj._id.toString();
            const chapterId = chapterObj._id.toString();

            if (!sectionsMap[sectionId]) {
                sectionsMap[sectionId] = {
                    _id: sectionObj._id,
                    sectionName: sectionObj.sectionName,
                    description: sectionObj.description,
                    logo: sectionObj.logo,
                    chapters: {}
                };
            }

            if (!sectionsMap[sectionId].chapters[chapterId]) {
                sectionsMap[sectionId].chapters[chapterId] = {
                    _id: chapterObj._id,
                    chapterName: chapterObj.chapterName,
                    description: chapterObj.description,
                    sequence: chapterObj.sequence,
                    questions: []
                };
            }

            // Convert to object to delete correctAnswer
            const qObj = q.toObject ? q.toObject() : { ...q };
            delete qObj.correctAnswer;

            sectionsMap[sectionId].chapters[chapterId].questions.push(qObj);
        }

        // Convert maps to sorted arrays
        const structuredData = Object.values(sectionsMap).map(sec => {
            const chaptersArray = Object.values(sec.chapters).sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
            return {
                ...sec,
                chapters: chaptersArray
            };
        });

        return structuredData;
    }

    return questions;
};

const getQuestionById = async (id) => {
    const result = await QuestionMasterRepository.getQuestionById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
    }
    return result;
};

const updateQuestion = async (id, payload) => {
    const result = await QuestionMasterRepository.updateQuestion(id, payload);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
    }
    return result;
};

const deleteQuestion = async (id) => {
    const result = await QuestionMasterRepository.deleteQuestion(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
    }
    return result;
};

const createBatchQuestions = async (questions) => {
    return await QuestionMaster.insertMany(questions);
};

const assignQuestions = async (fromData, toData) => {
    // 1. Fetch questions from source
    const questions = await QuestionMaster.find({
        examType: fromData.examType,
        section: fromData.section,
        chapter: fromData.chapter,
        isDeleted: false
    }).lean();

    if (!questions.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'No questions found in source chapter');
    }

    // 2. Map to destination
    const newQuestions = questions.map(q => {
        const { _id, createdAt, updatedAt, ...rest } = q;
        return {
            ...rest,
            examType: toData.examType,
            section: toData.section,
            chapter: toData.chapter
        };
    });

    // 3. Bulk insert
    return await QuestionMaster.insertMany(newQuestions);
};

export const QuestionMasterService = {
    createQuestion,
    createBatchQuestions,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    assignQuestions
};
