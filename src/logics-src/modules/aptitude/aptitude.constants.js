/**
 * aptitude.constants.js
 *
 * Single source of truth for all Career Aptitude Test business rules.
 * Import constants from here — never hard-code values in services or controllers.
 */

// ── Test Structure ────────────────────────────────────────────────────────────
export const APTITUDE_TOTAL_QUESTIONS = 100;
export const APTITUDE_INTEREST_QUESTIONS = 50;
export const APTITUDE_ACADEMIC_QUESTIONS = 50;
export const APTITUDE_MAX_TIME_MINUTES = 120;
export const APTITUDE_QUESTIONS_PER_CHAPTER = 10;

// ── Career Disciplines (10 total) ─────────────────────────────────────────────
// Order matters: index is used internally.
export const CAREER_DISCIPLINES = [
    'Medical Science & Healthcare',                                     // 0
    'Science, Technology, Engineering & Mathematics (STEM)',            // 1
    'Commerce, Business & Management',                                  // 2
    'Law, Politics & Social Work',                                      // 3
    'Teaching, Coaching, Counselling & Education',                      // 4
    'Travel, Tourism, Hospitality, Aviation & Hotel Management',        // 5
    'Administrative & Civil Services',                                  // 6
    'Defence, Police, Sports & Yoga',                                   // 7
    'Design, Branding, Fine Arts & Creativity',                         // 8
    'Performing Arts, Media, Journalism & Languages'                    // 9
];

/**
 * INTEREST_CHAPTER_MAP
 * Five chapters, identified by their sequence (1-5) in the DB.
 * Each chapter maps:
 *   - chapterSequence: 1 to 5
 *   - optionA: index into CAREER_DISCIPLINES (CAREER_1 mapping)
 *   - optionB: index into CAREER_DISCIPLINES (CAREER_2 mapping)
 */
export const INTEREST_CHAPTER_MAP = [
    { chapterSequence: 1, optionA: 0, optionB: 1 },   // Chapter 1: Medical & STEM
    { chapterSequence: 2, optionA: 2, optionB: 3 },   // Chapter 2: Commerce & Law
    { chapterSequence: 3, optionA: 4, optionB: 5 },   // Chapter 3: Teaching & Travel
    { chapterSequence: 4, optionA: 6, optionB: 7 },   // Chapter 4: Admin & Defence
    { chapterSequence: 5, optionA: 8, optionB: 9 }    // Chapter 5: Design & Performing Arts
];

// ── Academic Subjects (5 total) ───────────────────────────────────────────────
// Order matches question sequence; 10 questions per subject.
export const ACADEMIC_SUBJECTS = [
    'Science',
    'Mathematics',
    'Social Science',
    'Language',
    'Reasoning'
];

export const ACADEMIC_QUESTIONS_PER_SUBJECT = 10;

// ── Valid option values ────────────────────────────────────────────────────────
export const VALID_OPTIONS = ['A', 'B', 'C', 'D'];
