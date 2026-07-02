import mongoose from 'mongoose';

const careerPairSchema = new mongoose.Schema({
    chapterSequence: { type: Number, required: true },
    career1: { type: String, required: true },
    career2: { type: String, required: true }
}, { _id: false });

const academicSubjectSchema = new mongoose.Schema({
    chapterSequence: { type: Number, required: true },
    subjectName: { type: String, required: true }
}, { _id: false });

const aptitudeConfigSchema = new mongoose.Schema({
    maxTimeMinutes: { type: Number, default: 120 },
    careerPairs: [careerPairSchema],
    academicSubjects: [academicSubjectSchema]
}, { timestamps: true });

const AptitudeConfig = mongoose.model('AptitudeConfig', aptitudeConfigSchema);
export default AptitudeConfig;
