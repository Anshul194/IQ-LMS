import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    studentName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    coordinator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: false
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: false
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: false
    },
    dob: {
        type: Date,
        required: false
    },
    grade: {
        type: String,
        required: false
    },
    language: {
        type: String,
        required: false
    },
    sendWhatsappAlert: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

export default Student;
