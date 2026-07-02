import PDFDocument from 'pdfkit';

/**
 * generateAptitudeReportPDF
 *
 * Generates an A4 Career Aptitude Test Report PDF with two sections:
 *   Section 1 — Career / Interest Assessment
 *   Section 2 — Academic Proficiency Assessment
 *
 * @param {Object} reportData  — from AptitudeService.getAptitudeReportData()
 * @returns {Promise<Buffer>}
 */
export const generateAptitudeReportPDF = (reportData) => {
    return new Promise((resolve, reject) => {
        try {
            const {
                studentName,
                className,
                timeTaken,
                careerAssessment,
                academicAssessment,
                completedAt
            } = reportData;

            const doc = new PDFDocument({ size: 'A4', margin: 50 });

            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            const PAGE_W = doc.page.width;
            const MARGIN = 50;
            const CONT_W = PAGE_W - MARGIN * 2;

            // ── Helper: draw coloured rectangle banner ───────────────────────
            const banner = (text, y, bg = '#1E3A5F', fg = '#FFFFFF', fontSize = 10) => {
                doc.rect(MARGIN, y, CONT_W, 26).fill(bg);
                doc.fillColor(fg).fontSize(fontSize).font('Helvetica-Bold')
                    .text(text, MARGIN + 10, y + 7, { width: CONT_W - 20 });
                return y + 30;
            };

            // ── Helper: two-column table header ──────────────────────────────
            const tableHeader = (cols, colWidths, y, bg = '#334155') => {
                let x = MARGIN;
                doc.rect(MARGIN, y, CONT_W, 24).fill(bg);
                doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
                cols.forEach((col, i) => {
                    doc.text(col, x + 6, y + 7, { width: colWidths[i] - 6, align: i === 0 ? 'left' : 'center' });
                    x += colWidths[i];
                });
                return y + 24;
            };

            // ── Helper: table row ────────────────────────────────────────────
            const tableRow = (cells, colWidths, y, idx) => {
                const bg = idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
                doc.rect(MARGIN, y, CONT_W, 22).fill(bg).stroke('#E2E8F0');
                doc.fillColor('#1E293B').fontSize(9).font('Helvetica');
                let x = MARGIN;
                cells.forEach((cell, i) => {
                    doc.text(String(cell), x + 6, y + 6, { width: colWidths[i] - 10, align: i === 0 ? 'left' : 'center' });
                    x += colWidths[i];
                });
                return y + 22;
            };

            // ── Helper: grand total row ──────────────────────────────────────
            const totalRow = (cells, colWidths, y) => {
                doc.rect(MARGIN, y, CONT_W, 24).fill('#1E3A5F');
                doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
                let x = MARGIN;
                cells.forEach((cell, i) => {
                    doc.text(String(cell), x + 6, y + 7, { width: colWidths[i] - 10, align: i === 0 ? 'left' : 'center' });
                    x += colWidths[i];
                });
                return y + 24;
            };

            // ════════════════════════════════════════════════════════════════
            // PAGE HEADER
            // ════════════════════════════════════════════════════════════════
            doc.rect(0, 0, PAGE_W, 70).fill('#1E3A5F');
            doc.fillColor('#FFFFFF').fontSize(18).font('Helvetica-Bold')
                .text('CAREER APTITUDE TEST REPORT', MARGIN, 18, { width: CONT_W, align: 'center' });
            doc.fontSize(9).font('Helvetica').fillColor('#94A3B8')
                .text('Interest & Personality · Academic Proficiency', MARGIN, 42, { width: CONT_W, align: 'center' });

            doc.y = 85;

            // ── Student Info Box ─────────────────────────────────────────────
            doc.rect(MARGIN, doc.y, CONT_W, 64).fill('#F7F9FC').stroke('#E2E8F0');
            const infoY = doc.y + 10;
            const half = CONT_W / 2;

            doc.fillColor('#64748B').fontSize(8).font('Helvetica').text('Student Name', MARGIN + 10, infoY);
            doc.fillColor('#1E293B').fontSize(11).font('Helvetica-Bold').text(studentName, MARGIN + 10, infoY + 12);

            doc.fillColor('#64748B').fontSize(8).font('Helvetica').text('Class', MARGIN + half + 10, infoY);
            doc.fillColor('#1E293B').fontSize(11).font('Helvetica-Bold').text(className, MARGIN + half + 10, infoY + 12);

            doc.fillColor('#64748B').fontSize(8).font('Helvetica').text('Time Taken', MARGIN + 10, infoY + 32);
            doc.fillColor('#1E293B').fontSize(10).font('Helvetica-Bold').text(`${timeTaken} Minutes`, MARGIN + 10, infoY + 44);

            doc.fillColor('#64748B').fontSize(8).font('Helvetica').text('Date', MARGIN + half + 10, infoY + 32);
            doc.fillColor('#1E293B').fontSize(10).font('Helvetica-Bold')
                .text(new Date(completedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }), MARGIN + half + 10, infoY + 44);

            doc.y = doc.y + 80;

            // ════════════════════════════════════════════════════════════════
            // SECTION 1: Career / Interest Assessment
            // ════════════════════════════════════════════════════════════════
            doc.y = banner('SECTION 1 — INTEREST & PERSONALITY ASSESSMENT', doc.y, '#7C3AED');
            doc.moveDown(0.3);

            const careerColW = [CONT_W * 0.50, CONT_W * 0.25, CONT_W * 0.25];
            let rowY = tableHeader(['Career Discipline', 'Score', 'Percentage'], careerColW, doc.y, '#4C1D95');

            careerAssessment.areas.forEach((area, i) => {
                rowY = tableRow(
                    [area.name, area.score, `${area.percentage.toFixed(2)}%`],
                    careerColW, rowY, i
                );
            });

            rowY = totalRow(
                ['GRAND TOTAL', careerAssessment.grandTotal, '100.00%'],
                careerColW, rowY
            );

            doc.y = rowY + 18;

            // ════════════════════════════════════════════════════════════════
            // SECTION 2: Academic Proficiency Assessment
            // ════════════════════════════════════════════════════════════════
            // Add new page if we're running low
            if (doc.y > 680) doc.addPage();

            doc.y = banner('SECTION 2 — ACADEMIC PROFICIENCY ASSESSMENT', doc.y, '#0F766E');
            doc.moveDown(0.3);

            const acadColW = [CONT_W * 0.46, CONT_W * 0.27, CONT_W * 0.27];
            rowY = tableHeader(['Subject', 'Correct Answers', 'Percentage'], acadColW, doc.y, '#134E4A');

            academicAssessment.subjects.forEach((sub, i) => {
                rowY = tableRow(
                    [sub.name, sub.correctAnswers, `${sub.percentage.toFixed(2)}%`],
                    acadColW, rowY, i
                );
            });

            rowY = totalRow(
                ['GRAND TOTAL', academicAssessment.grandTotal, '100.00%'],
                acadColW, rowY
            );

            doc.y = rowY + 20;

            // ── Footer ────────────────────────────────────────────────────────
            doc.fillColor('#94A3B8').fontSize(8).font('Helvetica')
                .text(
                    `Report auto-generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`,
                    MARGIN, doc.y, { align: 'center', width: CONT_W }
                );

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};
