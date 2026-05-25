import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    dob: {
        type: Date,
        required: false
    },
    role: {
        type: String,
        enum: [
            'admin', 'cao', 'administrative_officer', 'chief_administrator', 'administrator', 'coordinator', 'student',
            'Chief Administrative Officer', 'Administrative Officer', 'Chief Administrator', 'Administrator', 'Coordinator'
        ],
        default: 'student'
    },
    parentUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },

    address: {
        type: String,
        default: "",
    }, idProof: {
        fileName: String,
        fileUrl: String,
        publicId: String,
    },

    status: {
        type: String,
        enum: ["active", "inactive", "blocked"],
        default: "active",
    },

    isApproved: {
        type: Boolean,
        default: true,
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },

    lastLogin: Date,

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
    { timestamps: true }
);

const User = mongoose.model('User', userSchema)

export default User;