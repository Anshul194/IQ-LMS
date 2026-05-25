import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
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
    options: [{
        optionText: String,
        optionImage: {
            fileName: String,
            fileUrl: String,
            publicId: String
        },
        isCorrect: {
            type: Boolean,
            default: false
        }
    }],
    explanation: {
        type: String,
        default: ""
    },
    marks: {
        type: Number,
        default: 1
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium"
    }
}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema);
export default Question;
