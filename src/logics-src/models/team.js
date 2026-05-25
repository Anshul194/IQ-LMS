import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: [
            'cao', 'administrative_officer', 'chief_administrator', 'administrator', 'coordinator',
            'Chief Administrative Officer', 'Administrative Officer', 'Chief Administrator', 'Administrator', 'Coordinator'
        ],
        required: true
    },
    // Hierarchy Management
    parentCAO: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null
    },
    parentAdminOfficer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null
    },
    idProof: {
        fileName: String,
        fileUrl: String,
        publicId: String
    },
    status: {
        type: String,
        enum: ["active", "inactive", "blocked"],
        default: "active"
    }
}, { timestamps: true });

const Team = mongoose.model("Team", teamSchema);

export default Team;
