import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import AppError from './utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import router from './logics-src/modules/index.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/v1', router);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to IQ-LMS API' });
});

// Handle 404
app.use((req, res, next) => {
    next(new AppError(StatusCodes.NOT_FOUND, `Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
