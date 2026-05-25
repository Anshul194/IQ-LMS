import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    grade: {
        type: String,
        required: true
    },
    durationInMinutes: {
        type: Number,
        required: true,
        default: 60
    },
    totalMarks: {
        type: Number,
        required: true
    },
    passingMarks: {
        type: Number,
        default: 0
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }],
    status: {
        type: String,
        enum: ["published", "draft", "archived"],
        default: "draft"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const Exam = mongoose.model("Exam", examSchema);
export default Exam;
