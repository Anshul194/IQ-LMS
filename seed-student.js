import mongoose from 'mongoose';
import Student from './src/logics-src/models/student.js';
import User from './src/logics-src/models/user.js';
import dotenv from 'dotenv';
dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/iq-lms');

        // Remove existing test data to avoid duplicates
        await User.deleteMany({ contactNumber: "9876543210" });
        await Student.deleteMany({ mobileNumber: "9876543210" });

        // Create Base User
        const user = await User.create({
            fullName: "Test Student",
            contactNumber: "9876543210",
            role: "student",
            status: "active"
        });

        // Create Student Profile
        await Student.create({
            userId: user._id,
            mobileNumber: "9876543210",
            studentName: "Test Student",
            dob: new Date("2005-05-15"),
            grade: "10",
            isActive: true
        });

        console.log("✅ Test Student Seeded Success!");
        console.log("Credentials -> Mobile: 9876543210 | DOB: 2005-05-15");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seed();
