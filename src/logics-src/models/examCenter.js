import mongoose from "mongoose";

const examCenterSchema = new mongoose.Schema({
    firmName: {
        type: String,
        required: true
    },
    computerCount: {
        type: Number,
        required: true,
        default: 0
    },
    respondentName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const ExamCenter = mongoose.model("ExamCenter", examCenterSchema);

export default ExamCenter;
