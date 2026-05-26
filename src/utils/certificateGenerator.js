import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificatePDF = (result, studentName) => {
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

            // 2. Overlay Content (Adjusted coordinates to fit typical certificate templates)

            const centerX = doc.page.width / 2;

            // Title
            doc.fillColor('#1a365d')
                .fontSize(42)
                .font('Helvetica-Bold')
                .text('CERTIFICATE OF MERIT', 0, 160, { align: 'center' });

            doc.moveDown(1.5);

            // Subtitle
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

            // Description
            const examTitle = result.examId?.examType || 'Diagnostic Assessment';
            doc.fontSize(16)
                .font('Helvetica')
                .fillColor('#4a5568')
                .text(`For achieving a score of ${result.percentage.toFixed(1)}% in the ${examTitle}`, 100, doc.y, {
                    width: doc.page.width - 200,
                    align: 'center',
                    lineGap: 5
                });

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

            // ID
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .text('VERIFICATION ID', doc.page.width - 250, footerY)
                .fontSize(10)
                .font('Helvetica')
                .text(result._id.toString().toUpperCase(), doc.page.width - 250, footerY + 20);

            // 3. Optional Seal / Signature (If template didn't have one)
            // doc.image(sealPath, doc.page.width/2 - 40, footerY - 20, { width: 80 });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
