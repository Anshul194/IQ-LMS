import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/iq-lms';

async function check() {
    try {
        await mongoose.connect(dbUrl);
        const results = await mongoose.connection.db.collection('results').find().toArray();
        console.log('--- RESULTS IN DB ---');
        console.log(JSON.stringify(results.map(r => ({ _id: r._id, examId: r.examId, status: r.status })), null, 2));

        const examTypes = await mongoose.connection.db.collection('examtypes').find().toArray();
        console.log('--- EXAM TYPES IN DB ---');
        console.log(JSON.stringify(examTypes.map(e => ({ _id: e._id, examType: e.examType })), null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
