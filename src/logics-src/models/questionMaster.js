import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    text: String,
    image: {
        fileName: String,
        fileUrl: String,
        publicId: String
    },
    traitMapping: {
        type: String,
        enum: ['CAREER_1', 'CAREER_2', 'BOTH', 'NONE'],
        default: 'NONE'
    }
}, { _id: false });

const questionMasterSchema = new mongoose.Schema({
    examType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExamType",
        required: true
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    questionImage: {
        fileName: String,
        fileUrl: String,
        publicId: String
    },
    options: {
        A: optionSchema,
        B: optionSchema,
        C: optionSchema,
        D: optionSchema
    },
    correctAnswer: {
        type: String, // A, B, C, or D
        required: true,
        enum: ["A", "B", "C", "D"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const QuestionMaster = mongoose.model("QuestionMaster", questionMasterSchema);
export default QuestionMaster;
