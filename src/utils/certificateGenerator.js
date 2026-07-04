import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates an IQ Test Certificate PDF.
 * Only called when correctAnswers >= 11 (PASSED).
 *
 * Populates: Student Name, IQ Score.
 * Handles dual layouts:
 * - Classes 1-5: Custom kid-friendly portrait HTML layout rendered via Puppeteer.
 * - Classes 6-12: Academic landscape/portrait layout rendered via PDFKit.
 *
 * @param {Object} params
 * @param {string} params.studentName
 * @param {number} params.iqScore
 * @param {Object} params.result  - full result document (for completedAt, _id)
 * @param {string} [params.grade] - student's grade/class
 * @returns {Promise<Buffer>}
 */
export const generateCertificatePDF = ({ studentName, iqScore, result, grade }) => {
    const gradeNum = parseInt(grade);
    const isClass1to5 = !isNaN(gradeNum) && gradeNum >= 1 && gradeNum <= 5;

    if (isClass1to5) {
        return new Promise(async (resolve, reject) => {
            try {
                // Load assets as base64 Data URIs
                const getAssetDataUri = (fileName) => {
                    try {
                        const filePath = path.join(__dirname, '..', 'assets', fileName);
                        if (fs.existsSync(filePath)) {
                            const bitmap = fs.readFileSync(filePath);
                            const base64 = Buffer.from(bitmap).toString('base64');
                            return `data:image/png;base64,${base64}`;
                        }
                    } catch (e) {
                        console.error(`Failed to read asset ${fileName}:`, e);
                    }
                    return '';
                };

                const logoSrc = getAssetDataUri('logo.png');
                const badgeSrc = getAssetDataUri('badge.png');
                const dhanashreeSrc = getAssetDataUri('dhanashree.png');
                const shrisagarSrc = getAssetDataUri('shrisagar.png');

                const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Certificate</title>
<style>
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    font-family: 'Arial', sans-serif;
  }

  .certificate {
    position: relative;
    width: 794px;
    height: 1123px;
    background: #fff;
    padding: 60px 45px;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid #ddd;
  }

  /* Orange corner triangles */
  .corner {
    position: absolute;
    width: 0;
    height: 0;
  }
  .corner.top-left {
    top: 0; left: 0;
    border-top: 130px solid #ff5a2d;
    border-right: 130px solid transparent;
  }
  .corner.bottom-right {
    bottom: 0; right: 0;
    border-bottom: 130px solid #ff5a2d;
    border-left: 130px solid transparent;
  }
  .thin-line {
    position: absolute;
    width: 180px;
    height: 5px;
    background: #b7d9d0;
  }
  .thin-line.top { top: 30px; left: 30px; transform: rotate(-45deg); }
  .thin-line.bottom { bottom: 30px; right: 30px; transform: rotate(-45deg); }

  .inner {
    position: relative;
    z-index: 2;
    text-align: center;
    border: 1px solid #ddd;
    padding: 45px 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .logo {
    width: 180px;
    margin: 0 auto 10px;
  }

  h1.this-word {
    letter-spacing: 6px;
    font-size: 26px;
    margin: 10px 0 5px;
    color: #222;
  }

  h1.certificate-word {
    font-size: 52px;
    letter-spacing: 8px;
    margin: 0 0 30px;
    color: #111;
    font-weight: 800;
  }

  .ribbon {
    background: #1c4fa1;
    color: #fff;
    display: inline-block;
    padding: 12px 60px;
    font-size: 18px;
    letter-spacing: 2px;
    clip-path: polygon(5% 0, 100% 0, 95% 100%, 0% 100%);
    margin: 0 auto 30px;
    width: fit-content;
  }

  .name {
    color: #ff5a2d;
    font-size: 42px;
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 30px;
  }

  .for-scoring {
    letter-spacing: 3px;
    font-size: 18px;
    color: #333;
    margin-bottom: 5px;
  }

  .score {
    color: #1c4fa1;
    font-size: 46px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .in-test {
    font-size: 20px;
    color: #1c4fa1;
    font-weight: 600;
    margin-bottom: 15px;
  }

  .conducted {
    color: #1c4fa1;
    font-weight: 700;
    font-size: 22px;
    line-height: 1.6;
    margin-bottom: 45px;
  }

  .signatures {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: auto;
  }

  .sig-block {
    text-align: center;
    width: 33%;
  }

  .sig-block img.signature {
    height: 65px;
    margin-bottom: 5px;
    object-fit: contain;
  }

  .sig-block .name-line {
    font-size: 16px;
    font-weight: 600;
    color: #222;
    border-top: 1px solid #ddd;
    padding-top: 5px;
    margin-top: 5px;
  }

  .sig-block .title-line {
    font-size: 13px;
    font-weight: 700;
    color: #333;
  }

  .badge img {
    width: 85px;
    object-fit: contain;
  }
</style>
</head>
<body>

<div class="certificate">
  <div class="corner top-left"></div>
  <div class="corner bottom-right"></div>
  <div class="thin-line top"></div>
  <div class="thin-line bottom"></div>

  <div class="inner">
    <div>
      <img src="${logoSrc}" alt="Logo" class="logo">

      <h1 class="this-word">THIS</h1>
      <h1 class="certificate-word">CERTIFICATE</h1>

      <div class="ribbon">IS AWARDED TO</div>

      <div class="name">${studentName.toUpperCase()}</div>

      <div class="for-scoring">FOR SCORING IQ</div>
      <div class="score">${Number(iqScore.toFixed(3))}</div>

      <div class="in-test">In INIQTEST</div>

      <div class="conducted">
        Conducted by NavodayaWala<br>
        During Academic Year<br>
        2026 - 2027
      </div>
    </div>

    <div class="signatures">
      <div class="sig-block">
        <img src="${dhanashreeSrc}" alt="Signature" class="signature"><br>
        <div class="name-line">Mrs. Dhanashree Mali</div>
        <div class="title-line">DIRECTOR<br>NavodayaWala</div>
      </div>

      <div class="sig-block badge">
        <img src="${badgeSrc}" alt="Badge">
      </div>

      <div class="sig-block">
        <img src="${shrisagarSrc}" alt="Signature" class="signature"><br>
        <div class="name-line">Mr. Shrisagar Mali</div>
        <div class="title-line">DIRECTOR<br>NavodayaWala</div>
      </div>
    </div>
  </div>
</div>

</body>
</html>`;

                const browser = await puppeteer.launch({
                    headless: 'new',
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--font-render-hinting=none'
                    ]
                });

                try {
                    const page = await browser.newPage();
                    await page.setViewport({
                        width: 794,
                        height: 1123,
                        deviceScaleFactor: 2
                    });
                    
                    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
                    
                    const pdfBuffer = await page.pdf({
                        format: 'A4',
                        landscape: false,
                        printBackground: true,
                        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
                    });
                    
                    resolve(pdfBuffer);
                } finally {
                    await browser.close();
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    // Default: Classes 6-12 (PDFKit template design)
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                layout: 'portrait',
                size: 'A4',
                margin: 0
            });

            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // 1. Background Image
            const backgroundImage = path.join(__dirname, '..', 'assets', 'certificate.png');

            // Draw background to fill the entire A4 portrait page
            doc.image(backgroundImage, 0, 0, {
                width: doc.page.width,
                height: doc.page.height
            });

            // 2. Overlay Content
            doc.fillColor('#1a365d')
                .fontSize(42)
                .font('Helvetica-Bold')
                .text('CERTIFICATE OF MERIT', 0, 200, { align: 'center' });

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
            const footerY = 650;

            // Date
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .text('DATE OF ISSUE', 100, footerY)
                .fontSize(12)
                .font('Helvetica')
                .text(new Date(result.completedAt).toLocaleDateString(), 100, footerY + 20);

            // Verification ID
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .text('VERIFICATION ID', doc.page.width - 260, footerY)
                .fontSize(10)
                .font('Helvetica')
                .text(result._id.toString().toUpperCase(), doc.page.width - 260, footerY + 20);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};
