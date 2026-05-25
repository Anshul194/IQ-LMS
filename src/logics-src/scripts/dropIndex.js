import mongoose from 'mongoose';
import config from '../../config/index.js';

const dropEmailIndex = async () => {
    try {
        await mongoose.connect(config.database_url);
        console.log('Connected to MongoDB...');

        const collection = mongoose.connection.collection('users');
        
        // Use try-catch for dropping as index might not exist
        try {
            await collection.dropIndex('email_1');
            console.log('Successfully dropped non-sparse email index!');
        } catch (e) {
            console.log('Index email_1 not found, it might have been dropped already.');
        }

        console.log('Mongoose will now automatically recreate the sparse index on next startup.');
        process.exit(0);
    } catch (error) {
        console.error('Error dropping index:', error);
        process.exit(1);
    }
};

dropEmailIndex();
