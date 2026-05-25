import mongoose from 'mongoose';
import config from '../../config/index.js';
import User from '../models/user.js';
import { hashPassword } from '../../utils/auth.utils.js';
import logger from '../../utils/logger.js';

const seedAdmin = async () => {
    try {
        await mongoose.connect(config.database_url);
        logger.info('Connected to MongoDB for seeding...');

        const adminExists = await User.findOne({ role: 'admin' });

        if (adminExists) {
            logger.info('Admin already exists. Skipping seeding.');
            process.exit(0);
        }

        const hashedPassword = await hashPassword('427428');

        const adminData = {
            fullName: 'Super Admin',
            email: 'admin@iniqtest.com',
            password: hashedPassword,
            contactNumber: '8669764055',
            dob: new Date('1990-01-01'),
            role: 'admin',
            status: 'active',
            isApproved: true
        };

        await User.create(adminData);
        logger.info('Admin user created successfully!');
        logger.info('Phone: 8669764055');
        logger.info('Password: 427428');
        
        process.exit(0);
    } catch (error) {
        logger.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
