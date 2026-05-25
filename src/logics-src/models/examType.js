import mongoose from "mongoose";

const examTypeSchema = new mongoose.Schema({
    examType: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const ExamType = mongoose.model("ExamType", examTypeSchema);
export default ExamType;
