import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
    coordinator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    schoolName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    associateCoordinatorName: {
        type: String,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const School = mongoose.model("School", schoolSchema);

export default School;
