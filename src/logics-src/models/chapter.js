import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
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
    chapterName: {
        type: String,
        required: true
    },
    logo: {
        fileName: String,
        fileUrl: String,
        publicId: String
    },
    questionCount: {
        type: Number,
        default: 0
    },
    sequence: {
        type: Number,
        default: 0
    },
    description: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Chapter = mongoose.model("Chapter", chapterSchema);
export default Chapter;
