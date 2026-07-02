import mongoose from "mongoose";

const areaScoreSchema = new mongoose.Schema({
    areaName: { type: String, required: true },
    correctAnswers: { type: Number, default: 0 }
}, { _id: false });

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExamType",
        required: true
    },

    // --- Legacy fields (kept for backward compatibility) ---
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 40 },
    correctAnswersCount: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },

    // --- IQ Test fields ---
    correctAnswers: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 },      // in minutes
    iqScore: { type: Number, default: null },

    status: {
        type: String,
        enum: ["PASSED", "RETEST_REQUIRED", "pass", "fail", "pending"],
        default: "pending"
    },

    enableRetest: { type: Boolean, default: false },
    reportGenerated: { type: Boolean, default: false },
    certificateGenerated: { type: Boolean, default: false },

    // Area-wise scores: 5 chapters × 8 questions = 40
    areaScores: [areaScoreSchema],

    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuestionMaster"
        },
        selectedOption: String, // A, B, C, or D
        isCorrect: Boolean
    }],

    completedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Result = mongoose.model("Result", resultSchema);
export default Result;
