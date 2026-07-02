import mongoose from 'mongoose';

// ── Sub-schemas ──────────────────────────────────────────────────────────────

const careerScoreSchema = new mongoose.Schema({
    discipline: { type: String, required: true },
    score: { type: Number, default: 0 }
}, { _id: false });

const academicScoreSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    correctAnswers: { type: Number, default: 0 }
}, { _id: false });

const interestAnswerSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionMaster', required: true },
    selectedOption: { type: String, enum: ['A', 'B', 'C', 'D'], required: true }
}, { _id: false });

const academicAnswerSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionMaster' },
    selectedOption: { type: String, enum: ['A', 'B', 'C', 'D'] },
    isCorrect: { type: Boolean, default: false }
}, { _id: false });

// ── Main schema ──────────────────────────────────────────────────────────────

const aptitudeResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExamType',
        required: true
    },

    timeTaken: { type: Number, required: true }, // in minutes (max 120)

    // ── Section 1: Interest & Personality ───────────────────────────────────
    // Raw interest answers (50 items)
    interestAnswers: [interestAnswerSchema],

    // Computed per-discipline scores
    careerScores: [careerScoreSchema],
    careerGrandTotal: { type: Number, default: 0 }, // sum of all discipline scores (can exceed 50 if C chosen)

    // ── Section 2: Academic Proficiency ─────────────────────────────────────
    // Raw academic answers (50 items)
    academicAnswers: [academicAnswerSchema],

    // Computed per-subject correct counts
    academicScores: [academicScoreSchema],
    academicGrandTotal: { type: Number, default: 0 }, // sum of correct answers across all subjects

    // ── Metadata ─────────────────────────────────────────────────────────────
    reportGenerated: { type: Boolean, default: false },
    status: { type: String, enum: ['COMPLETED', 'PENDING'], default: 'COMPLETED' },

    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for common query patterns
aptitudeResultSchema.index({ userId: 1, createdAt: -1 });
aptitudeResultSchema.index({ examId: 1 });

const AptitudeResult = mongoose.model('AptitudeResult', aptitudeResultSchema);
export default AptitudeResult;
