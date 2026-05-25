import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    examType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExamType",
        required: true
    },
    sectionName: {
        type: String,
        required: true
    },
    chapterCount: {
        type: Number,
        default: 0
    },
    logo: {
        fileName: String,
        fileUrl: String,
        publicId: String
    },
    description: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Section = mongoose.model("Section", sectionSchema);
export default Section;
