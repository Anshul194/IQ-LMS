import config from '../config/index.js';
import AppError from '../utils/AppError.js';

const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorSources = [];

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof Error) {
        message = err.message;
    }

    // Final response
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config.env === 'development' ? err?.stack : undefined,
    });
};

export default globalErrorHandler;
