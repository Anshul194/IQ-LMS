import PDFDocument from 'pdfkit';

/**
 * Generates an IQ Test Result PDF Report.
 *
 * @param {Object} reportData
 * @param {string} reportData.studentName
 * @param {string} reportData.className
 * @param {number} reportData.correctAnswers
 * @param {number} reportData.timeTaken        - in minutes
 * @param {number} reportData.iqScore
 * @param {Array}  reportData.areas            - [{ name, correctAnswers, percentage }]
 * @param {number} reportData.totalPercentage
 * @returns {Promise<Buffer>}
 */
export const generateReportPDF = (reportData) => {
    return new Promise((resolve, reject) => {
        try {
            const { studentName, className, correctAnswers, timeTaken, iqScore, areas, totalPercentage } = reportData;

            const doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });

            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            const PAGE_WIDTH = doc.page.width;
            const MARGIN = 50;
            const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

            // ── Header ──────────────────────────────────────────────────────────
            doc.rect(0, 0, PAGE_WIDTH, 80).fill('#1E3A5F');
            doc.fillColor('#FFFFFF')
                .fontSize(22)
                .font('Helvetica-Bold')
                .text('IQ TEST RESULT REPORT', MARGIN, 25, { width: CONTENT_WIDTH, align: 'center' });
            doc.fontSize(10)
                .font('Helvetica')
                .text('Intelligence Quotient Assessment', MARGIN, 52, { width: CONTENT_WIDTH, align: 'center' });

            doc.y = 100;

            // ── Student Info ──────────────────────────────────────────────────
            doc.fillColor('#1E3A5F')
                .fontSize(13)
                .font('Helvetica-Bold')
                .text('Student Information', MARGIN, doc.y);
            doc.moveDown(0.4);

            const infoY = doc.y;
            doc.rect(MARGIN, infoY, CONTENT_WIDTH, 90).fill('#F7F9FC').stroke('#E2E8F0');

            const col1X = MARGIN + 20;
            const col2X = MARGIN + CONTENT_WIDTH / 2 + 10;
            const infoTextY = infoY + 15;

            doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('Student Name', col1X, infoTextY);
            doc.fillColor('#1E293B').fontSize(11).font('Helvetica-Bold').text(studentName, col1X, infoTextY + 14);

            doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('Class', col2X, infoTextY);
            doc.fillColor('#1E293B').fontSize(11).font('Helvetica-Bold').text(className || 'N/A', col2X, infoTextY + 14);

            doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('Correct Answers', col1X, infoTextY + 48);
            doc.fillColor('#1E293B').fontSize(11).font('Helvetica-Bold').text(`${correctAnswers} / 40`, col1X, infoTextY + 62);

            doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('Time Taken', col2X, infoTextY + 48);
            doc.fillColor('#1E293B').fontSize(11).font('Helvetica-Bold').text(`${timeTaken} Minutes`, col2X, infoTextY + 62);

            doc.y = infoY + 105;

            // ── IQ Score Box ─────────────────────────────────────────────────
            const iqBoxY = doc.y;
            doc.rect(MARGIN, iqBoxY, CONTENT_WIDTH, 60).fill('#1E3A5F');
            doc.fillColor('#94A3B8').fontSize(10).font('Helvetica').text('IQ SCORE', MARGIN, iqBoxY + 12, { width: CONTENT_WIDTH, align: 'center' });
            doc.fillColor('#FFFFFF').fontSize(28).font('Helvetica-Bold').text(iqScore.toFixed(3), MARGIN, iqBoxY + 24, { width: CONTENT_WIDTH, align: 'center' });

            doc.y = iqBoxY + 80;

            // ── Area-wise Table ──────────────────────────────────────────────
            doc.fillColor('#1E3A5F').fontSize(13).font('Helvetica-Bold').text('Area-wise Performance', MARGIN, doc.y);
            doc.moveDown(0.5);

            const tableTop = doc.y;
            const colWidths = [230, 100, 120, 100];
            const headers = ['Area', 'Correct Answers', 'Percentage', ''];
            const rowHeight = 36;

            // Table header row
            let xPos = MARGIN;
            doc.rect(MARGIN, tableTop, CONTENT_WIDTH, rowHeight).fill('#1E3A5F');
            doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
            const headerLabels = ['Intelligence Area', 'Correct', 'Percentage'];
            const hColW = [CONTENT_WIDTH * 0.45, CONTENT_WIDTH * 0.27, CONTENT_WIDTH * 0.28];
            let hX = MARGIN + 10;
            headerLabels.forEach((label, i) => {
                doc.text(label, hX, tableTop + 12, { width: hColW[i], align: i === 0 ? 'left' : 'center' });
                hX += hColW[i];
            });

            // Table rows
            areas.forEach((area, idx) => {
                const rowY = tableTop + rowHeight + idx * rowHeight;
                const bgColor = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
                doc.rect(MARGIN, rowY, CONTENT_WIDTH, rowHeight).fill(bgColor).stroke('#E2E8F0');

                let rX = MARGIN + 10;
                doc.fillColor('#1E293B').fontSize(10).font('Helvetica').text(area.name, rX, rowY + 11, { width: hColW[0] - 10 });
                rX += hColW[0];
                doc.text(String(area.correctAnswers), rX, rowY + 11, { width: hColW[1], align: 'center' });
                rX += hColW[1];
                doc.text(`${area.percentage.toFixed(2)}%`, rX, rowY + 11, { width: hColW[2] - 10, align: 'center' });
            });

            // Grand Total row
            const totalRowY = tableTop + rowHeight + areas.length * rowHeight;
            doc.rect(MARGIN, totalRowY, CONTENT_WIDTH, rowHeight).fill('#1E3A5F');
            doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica-Bold');
            let tX = MARGIN + 10;
            doc.text('GRAND TOTAL', tX, totalRowY + 11, { width: hColW[0] - 10 });
            tX += hColW[0];
            doc.text(String(correctAnswers), tX, totalRowY + 11, { width: hColW[1], align: 'center' });
            tX += hColW[1];
            doc.text(`${totalPercentage.toFixed(2)}%`, tX, totalRowY + 11, { width: hColW[2] - 10, align: 'center' });

            doc.y = totalRowY + rowHeight + 30;

            // ── Footer ───────────────────────────────────────────────────────
            doc.fillColor('#94A3B8')
                .fontSize(9)
                .font('Helvetica')
                .text(
                    `Report generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`,
                    MARGIN,
                    doc.y,
                    { align: 'center', width: CONTENT_WIDTH }
                );

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
