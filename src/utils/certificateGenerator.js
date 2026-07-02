import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates an IQ Test Certificate PDF.
 * Only called when correctAnswers >= 11 (PASSED).
 *
 * Populates: Student Name, IQ Score.
 * Everything else in the template remains unchanged.
 *
 * @param {Object} params
 * @param {string} params.studentName
 * @param {number} params.iqScore
 * @param {Object} params.result  - full result document (for completedAt, _id)
 * @returns {Promise<Buffer>}
 */
export const generateCertificatePDF = ({ studentName, iqScore, result }) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
                margin: 0 // Zero margin to allow background to fill
            });

            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // 1. Background Image
            const backgroundImage = path.join(__dirname, '..', 'assets', 'certificate.png');

            // Draw background to fill the entire A4 landscape page (841.89 x 595.28 points)
            doc.image(backgroundImage, 0, 0, {
                width: doc.page.width,
                height: doc.page.height
            });

            // 2. Overlay Content
            doc.fillColor('#1a365d')
                .fontSize(42)
                .font('Helvetica-Bold')
                .text('CERTIFICATE OF MERIT', 0, 160, { align: 'center' });

            doc.moveDown(1.5);

            doc.fontSize(18)
                .font('Helvetica')
                .fillColor('#4a5568')
                .text('PROUDLY PRESENTED TO', { align: 'center' });

            doc.moveDown(1);

            // Student Name
            doc.fontSize(36)
                .font('Helvetica-Bold')
                .fillColor('#2d3748')
                .text(studentName.toUpperCase(), { align: 'center' });

            doc.moveDown(1);

            // IQ Score description
            doc.fontSize(16)
                .font('Helvetica')
                .fillColor('#4a5568')
                .text(
                    `For achieving an IQ Score of ${Number(iqScore.toFixed(3))} in the IQ Diagnostic Assessment`,
                    100, doc.y,
                    { width: doc.page.width - 200, align: 'center', lineGap: 5 }
                );

            doc.moveDown(2);

            // Footer Info
            const footerY = 480;

            // Date
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .text('DATE OF ISSUE', 150, footerY)
                .fontSize(12)
                .font('Helvetica')
                .text(new Date(result.completedAt).toLocaleDateString(), 150, footerY + 20);

            // Verification ID
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .text('VERIFICATION ID', doc.page.width - 250, footerY)
                .fontSize(10)
                .font('Helvetica')
                .text(result._id.toString().toUpperCase(), doc.page.width - 250, footerY + 20);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
