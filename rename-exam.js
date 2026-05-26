import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/iq-lms';

async function rename() {
    try {
        await mongoose.connect(dbUrl);

        // Update the name of the main exam type
        const result = await mongoose.connection.db.collection('examtypes').updateOne(
            { _id: new mongoose.Types.ObjectId('6a155e19485d7fb3a9e36413') },
            { $set: { examType: "Diagnostic Evaluation 2026" } }
        );

        console.log(`Renamed ExamType to "Diagnostic Evaluation 2026".`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

rename();
