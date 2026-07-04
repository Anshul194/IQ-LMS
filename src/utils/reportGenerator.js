import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates an IQ Test Result PDF Report.
 * Handles dual layouts:
 * - Classes 1-5: Custom child-friendly portrait HTML report rendered via Puppeteer.
 * - Classes 6-12: Academic portrait report rendered via PDFKit.
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
    const gradeNum = parseInt(reportData.className);
    const isClass1to5 = !isNaN(gradeNum) && gradeNum >= 1 && gradeNum <= 5;

    if (isClass1to5) {
        return new Promise(async (resolve, reject) => {
            try {
                const { studentName, className, correctAnswers, iqScore, areas } = reportData;

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

                // Dynamic intelligence area emoji/color mappings
                const areaMeta = {
                    'ANALYTICAL REASONING': { emoji: '&#129504;', bg: '#2196f3', textCol: '#1a237e' },
                    'NON-VERBAL COMPREHENSION': { emoji: '&#128214;', bg: '#009688', textCol: '#00838f' },
                    'PERCEPTUAL REASONING': { emoji: '&#128065;', bg: '#4caf50', textCol: '#2e7d32' },
                    'VISUAL-SPATIAL PROCESSING': { emoji: '&#128257;', bg: '#5e35b1', textCol: '#4527a0' },
                    'LOGICAL REASONING': { emoji: '&#128161;', bg: '#fb8c00', textCol: '#e65100' }
                };

                const getAreaMeta = (name) => {
                    const key = String(name).trim().toUpperCase();
                    for (const [k, v] of Object.entries(areaMeta)) {
                        if (key.includes(k) || k.includes(key)) {
                            return v;
                        }
                    }
                    return { emoji: '🧠', bg: '#2196f3', textCol: '#1a237e' };
                };

                const tableRowsHtml = areas.map((area, idx) => {
                    const meta = getAreaMeta(area.name);
                    const pctVal = Math.round(area.percentage);
                    return `
      <tr>
        <td>
          <div class="area-cell">
            <div class="icon-circle" style="background:${meta.bg};">${meta.emoji}</div>
            ${idx + 1}. ${area.name.toUpperCase()}
          </div>
        </td>
        <td><div class="num-box">${area.correctAnswers}</div></td>
        <td class="percent-cell" style="color:${meta.textCol};">
          ${area.percentage.toFixed(2)}%
          <div class="bar-bg"><div class="bar-fill" style="width:${Math.min(100, Math.max(0, pctVal))}%; background:${meta.textCol};"></div></div>
        </td>
      </tr>`;
                }).join('');

                const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>IQ Test Report</title>
<style>
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-sizing: border-box; margin: 0; padding: 0; }
  body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    font-family: 'Segoe UI', Arial, sans-serif;
  }
  .card {
    background: #fff;
    width: 794px;
    height: 1123px;
    border: 4px solid #1a237e;
    border-radius: 12px;
    padding: 40px 35px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .logo-wrap {
    text-align: center;
    margin-bottom: 10px;
  }
  .logo-wrap img {
    width: 140px;
  }
  h1 {
    text-align: center;
    font-size: 34px;
    letter-spacing: 1px;
    margin: 10px 0 20px;
    color: #1a237e;
  }
  .student-box {
    display: flex;
    align-items: center;
    gap: 20px;
    border: 2px solid #1a237e;
    border-radius: 10px;
    padding: 14px 20px;
    margin-bottom: 25px;
  }
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #1a237e;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }
  .student-box .info p { font-size: 16px; margin: 2px 0; }
  .student-box .info span.label { font-weight: 600; color: #222; }
  .student-box .name { color: #e64a19; font-weight: 700; }
  .student-box .score { color: #1a237e; font-weight: 700; font-size: 20px; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  thead tr { background: #1a237e; color: #fff; }
  thead th {
    padding: 12px 10px;
    font-size: 13px;
    text-align: left;
    font-weight: 600;
  }
  tbody td {
    padding: 14px 10px;
    border-bottom: 1px solid #eee;
    vertical-align: middle;
  }
  .area-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    color: #1a237e;
    font-size: 13px;
  }
  .icon-circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 15px;
    flex-shrink: 0;
  }
  .num-box {
    background: #eef1fb;
    text-align: center;
    padding: 8px;
    border-radius: 4px;
    font-weight: 700;
    color: #1a237e;
    width: 40px;
    margin: 0 auto;
  }
  .percent-cell { font-weight: 700; }
  .bar-bg {
    background: #e0e0e0;
    height: 6px;
    border-radius: 3px;
    margin-top: 6px;
    overflow: hidden;
    width: 100%;
  }
  .bar-fill { height: 100%; border-radius: 3px; }

  tfoot td {
    background: #1a237e;
    color: #fff;
    font-weight: 700;
    padding: 14px 10px;
  }
  tfoot td:first-child { border-radius: 0 0 0 6px; }
  tfoot td:last-child { border-radius: 0 0 6px 0; }

  .signatures {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: auto;
    padding-top: 30px;
  }
  .sig-block { text-align: center; width: 33%; }
  .sig-block img.sign { height: 65px; object-fit: contain; }
  .sig-block p { font-size: 13px; margin-top: 4px; }
  .sig-block .name { font-weight: 700; }
  .sig-block .role { font-size: 12px; color: #555; }
  .badge img { width: 80px; }
</style>
</head>
<body>

<div class="card">
  <div>
    <div class="logo-wrap">
      <img src="${logoSrc}" alt="Navodaya Wala Logo">
    </div>

    <h1>IQ TEST REPORT</h1>

    <div class="student-box">
      <div class="avatar">&#128100;</div>
      <div class="info">
        <p><span class="label">Student Name : </span><span class="name">${studentName}</span></p>
        <p><span class="label">IQ Score : </span><span class="score">${Number(iqScore.toFixed(3))}</span></p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>AREAS OF INTELLIGENCE</th>
          <th style="text-align:center; width: 120px;">ACCURACY IN NUMBERS</th>
          <th style="width: 180px;">ACCURACY IN %</th>
        </tr>
      </thead>
      <tbody>
        ${tableRowsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td>GRAND TOTAL</td>
          <td style="text-align:center;">${correctAnswers}</td>
          <td>100.00%</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div class="signatures">
    <div class="sig-block">
      <img class="sign" src="${dhanashreeSrc}" alt="Signature">
      <p class="name">Mrs. Dhanashree Mali</p>
      <p class="role">DIRECTOR</p>
      <p class="role">Navodaya Wala</p>
    </div>

    <div class="badge">
      <img src="${badgeSrc}" alt="Badge">
    </div>

    <div class="sig-block">
      <img class="sign" src="${shrisagarSrc}" alt="Signature">
      <p class="name">Mr. Shrisagar Mali</p>
      <p class="role">DIRECTOR</p>
      <p class="role">Navodaya Wala</p>
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
            const headers = ['Area', 'Correct Answers', 'Percentage', ''];
            const rowHeight = 36;

            // Table header row
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
