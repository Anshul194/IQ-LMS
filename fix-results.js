import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/iq-lms';

async function update() {
    try {
        await mongoose.connect(dbUrl);
        const targetExamId = new mongoose.Types.ObjectId('6a155e19485d7fb3a9e36413');

        // Try both string and ID just in case
        const result = await mongoose.connection.db.collection('results').updateMany(
            {},
            { $set: { examId: targetExamId } }
        );

        console.log(`Updated ${result.modifiedCount} total records to valid ExamType (Anshul).`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

update();
