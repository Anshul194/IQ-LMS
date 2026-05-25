import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pass", "fail", "pending"],
        default: "pending"
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
        },
        selectedOptionId: mongoose.Schema.Types.ObjectId,
        isCorrect: Boolean
    }],
    completedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Result = mongoose.model("Result", resultSchema);
export default Result;
