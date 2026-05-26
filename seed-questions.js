import mongoose from 'mongoose';
import QuestionMaster from './src/logics-src/models/questionMaster.js';
import dotenv from 'dotenv';
dotenv.config();

const seedQuestions = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/iq-lms');

        const examTypeId = "6a155e19485d7fb3a9e36413";
        const sectionId = "6a155e2a485d7fb3a9e36415";
        const chapterId = "6a155e36485d7fb3a9e36417";

        // Sample Questions
        const questions = [
            {
                examType: examTypeId,
                section: sectionId,
                chapter: chapterId,
                questionText: "If 1=3, 2=5, 3=7, 4=9, then 5=?",
                options: {
                    A: { text: "10" },
                    B: { text: "11" },
                    C: { text: "12" },
                    D: { text: "13" }
                },
                correctAnswer: "B"
            },
            {
                examType: examTypeId,
                section: sectionId,
                chapter: chapterId,
                questionText: "Which number should come next in the pattern? 37, 34, 31, 28, ?",
                options: {
                    A: { text: "25" },
                    B: { text: "24" },
                    C: { text: "26" },
                    D: { text: "20" }
                },
                correctAnswer: "A"
            },
            {
                examType: examTypeId,
                section: sectionId,
                chapter: chapterId,
                questionText: "Find the odd one out.",
                options: {
                    A: { text: "Apple" },
                    B: { text: "Banana" },
                    C: { text: "Carrot" },
                    D: { text: "Mango" }
                },
                correctAnswer: "C"
            }
        ];

        await QuestionMaster.deleteMany({ examType: examTypeId });
        await QuestionMaster.insertMany(questions);

        console.log("✅ 10th Grade Questions Seeded Success!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedQuestions();
