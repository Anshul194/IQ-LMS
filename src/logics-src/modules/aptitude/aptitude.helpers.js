/**
 * aptitude.helpers.js
 *
 * Pure utility functions for Career Aptitude scoring, driven by dynamic DB Config.
 */

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — Career / Interest Scoring
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extract an ordered list of the 10 career disciplines exactly as configured.
 */
export const getCareerDisciplines = (config) => {
    // Flatten career1 and career2 from the 5 pairs sequentially
    const disciplines = [];
    config.careerPairs.sort((a, b) => a.chapterSequence - b.chapterSequence).forEach(pair => {
        disciplines.push(pair.career1);
        disciplines.push(pair.career2);
    });
    return disciplines;
};

/**
 * Find which chapter pairing a question belongs to based on its DB sequence.
 */
export const getChapterPair = (sequence, config) => {
    return config.careerPairs.find(c => c.chapterSequence === sequence);
};

/**
 * Build a zeroed score map for all career disciplines.
 * Since there are 5 pairs, this is always an array of 10 zeros.
 */
export const initCareerScores = (config) => {
    const list = getCareerDisciplines(config);
    return new Array(list.length).fill(0);
};

/**
 * Apply a single interest answer to the running discipline score counters using dynamic traitMapping.
 *
 * @param {number[]} scores       - mutable array
 * @param {string}   traitMapping - 'CAREER_1' | 'CAREER_2' | 'BOTH' | 'NONE'
 * @param {Object}   chapterPair  - { chapterSequence, career1, career2 }
 * @param {Object}   config       - aptitude DB config
 */
export const applyInterestAnswer = (scores, traitMapping, chapterPair, config) => {
    const disciplines = getCareerDisciplines(config);
    // Find the master index (0-9) of career1 and career2 for this specific chapter pair
    const idx1 = disciplines.indexOf(chapterPair.career1);
    const idx2 = disciplines.indexOf(chapterPair.career2);

    if (traitMapping === 'CAREER_1' || traitMapping === 'BOTH') scores[idx1]++;
    if (traitMapping === 'CAREER_2' || traitMapping === 'BOTH') scores[idx2]++;
};

/**
 * Given raw discipline score counters, build the final career assessment report.
 */
export const buildCareerReport = (scores, config) => {
    const disciplines = getCareerDisciplines(config);
    const grandTotal = scores.reduce((sum, s) => sum + s, 0);

    const areas = disciplines.map((name, i) => ({
        name,
        score: scores[i] || 0,
        percentage: grandTotal > 0
            ? Number((((scores[i] || 0) / grandTotal) * 100).toFixed(2))
            : 0
    }));

    return { grandTotal, areas };
};

/**
 * Convert raw score array to DB storage format.
 */
export const scoresToCareerDB = (scores, config) => {
    const disciplines = getCareerDisciplines(config);
    return disciplines.map((discipline, i) => ({ discipline, score: scores[i] }));
};

/**
 * Restore in-memory score array from DB documents.
 */
export const careerDBToScores = (dbScores, config) => {
    const disciplines = getCareerDisciplines(config);
    return disciplines.map(name => {
        const found = dbScores.find(d => d.discipline === name);
        return found ? found.score : 0;
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — Academic Scoring
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extract an ordered list of the academic subjects.
 */
export const getAcademicSubjects = (config) => {
    return config.academicSubjects.sort((a, b) => a.chapterSequence - b.chapterSequence).map(s => s.subjectName);
};

/**
 * Determine which academic subject a question belongs to based on its DB chapter sequence.
 */
export const getSubjectForSequence = (sequence, config) => {
    const found = config.academicSubjects.find(s => s.chapterSequence === sequence);
    return found ? found.subjectName : 'Unknown Subject';
};

/**
 * Build the academic assessment report from per-subject correct counts.
 */
export const buildAcademicReport = (subjectMap, config) => {
    const subjectsList = getAcademicSubjects(config);
    const grandTotal = subjectsList.reduce((sum, s) => sum + (subjectMap[s] ?? 0), 0);

    const subjects = subjectsList.map(name => {
        const correctAnswers = subjectMap[name] ?? 0;
        return {
            name,
            correctAnswers,
            percentage: grandTotal > 0
                ? Number(((correctAnswers / grandTotal) * 100).toFixed(2))
                : 0
        };
    });

    return { grandTotal, subjects };
};

/**
 * Convert subject map to DB storage format.
 */
export const subjectMapToAcademicDB = (subjectMap, config) => {
    const subjectsList = getAcademicSubjects(config);
    return subjectsList.map(subject => ({ subject, correctAnswers: subjectMap[subject] ?? 0 }));
};

/**
 * Restore subject map from DB documents.
 */
export const academicDBToSubjectMap = (dbScores, config) => {
    const map = {};
    const subjectsList = getAcademicSubjects(config);
    subjectsList.forEach(name => {
        const found = dbScores.find(d => d.subject === name);
        map[name] = found ? found.correctAnswers : 0;
    });
    return map;
};
