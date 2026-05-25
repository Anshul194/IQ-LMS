import mongoose from 'mongoose';
import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';

async function main() {
    try {
        await mongoose.connect(config.database_url);
        logger.info('Connected to MongoDB');

        const server = app.listen(config.port, () => {
            logger.info(`Server is running on port ${config.port}`);
        });

        // Handle unhandled rejections
        process.on('unhandledRejection', (err) => {
            logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
            logger.error(err);
            server.close(() => {
                process.exit(1);
            });
        });
    } catch (err) {
        logger.error('Failed to connect to database', err);
    }
}

main();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger.error(err);
    process.exit(1);
});
