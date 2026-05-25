import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "cancelled"],
        default: "pending"
    },
    documents: [{
        docType: String,
        fileName: String,
        fileUrl: String,
        publicId: String
    }],
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const Admission = mongoose.model("Admission", admissionSchema);
export default Admission;
