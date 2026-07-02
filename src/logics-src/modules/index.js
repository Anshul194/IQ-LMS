import express from 'express';
import { UserRoutes } from './user/user.route.js';
import { AuthRoutes } from './auth/auth.route.js';
import { SchoolRoutes } from './school/school.route.js';
import { StudentRoutes } from './student/student.route.js';
import { ExamCenterRoutes } from './examCenter/examCenter.route.js';
import { ExamTypeRoutes } from './examType/examType.route.js';
import { SectionRoutes } from './section/section.route.js';
import { ChapterRoutes } from './chapter/chapter.route.js';
import { QuestionMasterRoutes } from './questionMaster/questionMaster.route.js';
import { ResultRoutes } from './result/result.route.js';
import { AptitudeRoutes } from './aptitude/aptitude.route.js';
import { DashboardRoutes } from './dashboard/dashboard.route.js';
import { ExportRoutes } from './export/export.route.js';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/schools',
        route: SchoolRoutes
    },
    {
        path: '/students',
        route: StudentRoutes
    },
    {
        path: '/exam-centers',
        route: ExamCenterRoutes
    },
    {
        path: '/exam-types',
        route: ExamTypeRoutes
    },
    {
        path: '/sections',
        route: SectionRoutes
    },
    {
        path: '/chapters',
        route: ChapterRoutes
    },
    {
        path: '/question-masters',
        route: QuestionMasterRoutes
    },
    {
        path: '/results',
        route: ResultRoutes
    },
    {
        path: '/aptitude-results',
        route: AptitudeRoutes
    },
    {
        path: '/dashboard',
        route: DashboardRoutes
    },
    {
        path: '/export',
        route: ExportRoutes
    }
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
