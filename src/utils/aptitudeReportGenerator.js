import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INTEREST_PALETTE = [
  "#2E9E4C", // green      - Medical Science & Healthcare
  "#3E7CB1", // blue       - STEM
  "#F2994A", // orange     - Commerce, Business & Management
  "#8E5FC2", // purple     - Law, Politics & Social Work
  "#D6558C", // pink       - Teaching, Coaching, Counselling & Education
  "#3AA6A0", // teal       - Travel, Tourism, Hospitality, Aviation & Hotel Mgmt
  "#3E5C9A", // indigo     - Administrative & Civil Services
  "#3E7CB1", // blue       - Defence, Police, Sports & Yoga
  "#C0392B", // red/brown  - Design, Branding, Fine Arts & Creativity
  "#8A8F98", // slate      - Performing Arts, Media, Journalism & Languages
];

const ACADEMIC_PALETTE = ["#2E9E4C", "#3E7CB1", "#F2994A", "#8E5FC2", "#3AA6A0"];

function round2(n) {
  return Math.round(n * 100) / 100;
}

function computeInterestData(interestAreas) {
  const total = interestAreas.reduce((sum, a) => sum + Number(a.score || 0), 0) || 1;
  const withPct = interestAreas.map((a, i) => ({
    ...a,
    pct: round2((Number(a.score || 0) / total) * 100),
    color: INTEREST_PALETTE[i % INTEREST_PALETTE.length],
  }));
  return { rows: withPct, total: interestAreas.reduce((s, a) => s + Number(a.score || 0), 0) };
}

function computeAcademicData(academicSubjects) {
  const totalCorrect = academicSubjects.reduce((s, a) => s + Number(a.correct || 0), 0);
  const totalOutOf = academicSubjects.reduce((s, a) => s + Number(a.outOf || 0), 0) || 1;
  const withPct = academicSubjects.map((a, i) => ({
    ...a,
    pct: round2((Number(a.correct || 0) / (Number(a.outOf) || 1)) * 100),
    color: ACADEMIC_PALETTE[i % ACADEMIC_PALETTE.length],
  }));
  const grandAccuracy = round2(
    withPct.reduce((s, a) => s + a.pct, 0) / (withPct.length || 1)
  );
  return { rows: withPct, totalCorrect, totalOutOf, grandAccuracy };
}

function generateInterestInsight(rows) {
  if (!rows.length) return "";
  const sorted = [...rows].sort((a, b) => b.pct - a.pct);
  const top = sorted[0];
  const second = sorted[1];
  if (!second) {
    return `Your strongest inclination is towards ${top.label}.`;
  }
  return `Your strongest inclination is towards ${top.label}, followed by ${second.label}.`;
}

function generateAcademicInsight(rows) {
  if (!rows.length) return "";
  const sorted = [...rows].sort((a, b) => b.pct - a.pct);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  if (best.label === worst.label) {
    return `You have performed consistently in ${best.label}.`;
  }
  return `You have performed the best in ${best.label}, followed by ${sorted[1] ? sorted[1].label : ""}. Keep strengthening ${worst.label} to achieve a balanced overall performance.`;
}

export const generateAptitudeReportPDF = async (reportData) => {
    const {
        studentName = 'Student',
        className = 'N/A',
        careerAssessment = { areas: [], grandTotal: 0 },
        academicAssessment = { subjects: [], grandTotal: 0 },
        completedAt = new Date(),
    } = reportData;

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

    const interestAreas = (careerAssessment.areas || []).map(a => ({ label: a.name, score: a.score }));
    const academicSubjects = (academicAssessment.subjects || []).map(s => ({ label: s.name, correct: s.correctAnswers, outOf: 10 }));

    const interest = computeInterestData(interestAreas);
    const academic = computeAcademicData(academicSubjects);
    const maxInterestPct = Math.max(...interest.rows.map((r) => r.pct), 1);
    const maxAcademicPct = Math.max(...academic.rows.map((r) => r.pct), 1);

    const brandName = "Navodaya Wale";
    const brandTagline = "Hum Hi Navodaya Hai";

    const directorLeft = { name: "Mrs. Dhanshree Mali", title: "DIRECTOR", org: "NavodayaWali", signatureSrc: dhanashreeSrc };
    const directorRight = { name: "Mr. Shrisagar Mali", title: "DIRECTOR", org: "NavodayaWali", signatureSrc: shrisagarSrc };

    // Render Interest Table Rows
    const interestTableRowsHtml = interest.rows.map((row, i) => `
        <tr style="background: ${i % 2 === 0 ? '#f5f7fb' : '#ffffff'};">
            <td style="padding: 4px 6px; border: 1px solid #ddd;">${i + 1}. ${row.label}</td>
            <td style="padding: 4px 6px; border: 1px solid #ddd; text-align: center;">${row.score}</td>
            <td style="padding: 4px 6px; border: 1px solid #ddd; text-align: center;">${row.pct.toFixed(1)}%</td>
        </tr>
    `).join('');

    // Render Interest Bar Chart (Compact label width to save horizontal space)
    const scaleMaxInterest = Math.max(20, Math.ceil(maxInterestPct / 5) * 5);
    const interestChartHtml = interest.rows.map((row) => `
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <div style="width: 120px; text-align: right; padding-right: 6px; color: #333; font-size: 9px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${row.label}
            </div>
            <div style="flex: 1; background: #f0f0f0; height: 10px; position: relative; border-radius: 2px;">
                <div style="width: ${(row.pct / scaleMaxInterest) * 100}%; background: ${row.color}; height: 100%; border-radius: 2px;"></div>
            </div>
            <div style="width: 32px; padding-left: 6px; color: #333; font-size: 9px;">${row.pct.toFixed(1)}</div>
        </div>
    `).join('');

    const interestAxisLabels = Array.from({ length: 5 }, (_, i) => `
        <div style="flex: 1; text-align: ${i === 0 ? 'left' : 'right'};">
            ${Math.round((scaleMaxInterest / 4) * i)}
        </div>
    `).join('');

    // Render Academic Table Rows
    const academicTableRowsHtml = academic.rows.map((row, i) => `
        <tr style="background: ${i % 2 === 0 ? '#f5f7fb' : '#ffffff'};">
            <td style="padding: 4px 6px; border: 1px solid #ddd;">${i + 1}. ${row.label}</td>
            <td style="padding: 4px 6px; border: 1px solid #ddd; text-align: center;">${row.correct}</td>
            <td style="padding: 4px 6px; border: 1px solid #ddd; text-align: center;">${row.pct.toFixed(1)}%</td>
        </tr>
    `).join('');

    // Render Academic Bar Chart (Vertical with slightly reduced height)
    const scaleMaxAcademic = Math.max(40, Math.ceil(maxAcademicPct / 10) * 10);
    const chartHeight = 110;
    const academicChartBarsHtml = academic.rows.map((row) => `
        <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
            <div style="font-size: 8.5px; margin-bottom: 2px; color: #333;">${row.pct.toFixed(1)}</div>
            <div style="width: 24px; height: ${(row.pct / scaleMaxAcademic) * (chartHeight - 20)}px; background: ${row.color}; border-radius: 2px 2px 0 0;"></div>
        </div>
    `).join('');

    const academicChartLabelsHtml = academic.rows.map((row) => `
        <div style="flex: 1; text-align: center; font-size: 8.5px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${row.label}</div>
    `).join('');

    const fullHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; box-sizing: border-box; }
      body { margin: 0; padding: 0; background: #ffffff; }
    </style>
  </head>
  <body>
    <div
      style="
        width: 794px;
        height: 1123px;
        margin: 0 auto;
        background: #ffffff;
        font-family: 'Segoe UI', Arial, sans-serif;
        color: #1a1a2e;
        padding: 24px 30px;
        box-sizing: border-box;
        border: 4px solid #1a3a6b;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      "
    >
      <div>
        <!-- ---------------- HEADER ---------------- -->
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 3px solid #f2994a;
            padding-bottom: 10px;
            margin-bottom: 12px;
          "
        >
          <div style="display: flex; align-items: center; gap: 8px; min-width: 150px;">
            ${logoSrc ? `<img src="${logoSrc}" alt="${brandName}" style="width: 48px; height: 48px; object-fit: contain;" />` : ''}
            <div>
              <div style="font-size: 13.5px; font-weight: 700; color: #1a3a6b; line-height: 1.1;">
                ${brandName}
              </div>
              <div style="font-size: 9.5px; color: #f2994a; font-weight: 600;">${brandTagline}</div>
            </div>
          </div>

          <div style="text-align: center; flex: 1;">
            <div style="font-size: 20px; font-weight: 600; color: #1a1a2e; letter-spacing: 0.2px; line-height: 1.1;">
              CAREER APTITUDE TEST REPORT
            </div>
          </div>

          <div style="min-width: 150px;"></div>
        </div>

        <!-- ---------------- STUDENT NAME BOX ---------------- -->
        <div
          style="
            border: 1.5px solid #1a3a6b;
            border-radius: 6px;
            padding: 8px 12px;
            text-align: center;
            margin-bottom: 12px;
            font-size: 13px;
            display: flex;
            justify-content: space-around;
            background: #fafafa;
          "
        >
          <div>
            <strong>Student Name: </strong>
            ${studentName}
          </div>
          <div>
            <strong>Class: </strong>
            ${className}
          </div>
        </div>

        <!-- ---------------- SECTION 1 ---------------- -->
        <div
          style="
            background: #1a3a6b;
            color: #fff;
            font-size: 11.5px;
            font-weight: 700;
            padding: 5px 10px;
            border-radius: 4px;
            letter-spacing: 0.3px;
          "
        >
          SECTION 1: INTEREST & PERSONALITY ASSESSMENT
        </div>
        <p style="font-size: 11px; color: #444; margin: 4px 0 8px;">
          Evaluates your core career inclinations based on personality mapping.
        </p>

        <div style="display: flex; gap: 20px; align-items: flex-start; margin-bottom: 8px;">
          <!-- Table -->
          <div style="flex: 0 0 46%;">
            <table style="width: 100%; border-collapse: collapse; font-size: 9.5px;">
              <thead>
                <tr style="background: #1a3a6b; color: #fff;">
                  <th style="padding: 5px 6px; text-align: left; font-weight: 600; border: 1px solid #1a3a6b;">Interest Areas</th>
                  <th style="padding: 5px 6px; text-align: center; font-weight: 600; border: 1px solid #1a3a6b; width: 60px;">Score</th>
                  <th style="padding: 5px 6px; text-align: center; font-weight: 600; border: 1px solid #1a3a6b; width: 70px;">Pct (%)</th>
                </tr>
              </thead>
              <tbody>
                ${interestTableRowsHtml}
                <tr style="background: #fdf3e3; font-weight: 700;">
                  <td style="padding: 4px 6px; border: 1px solid #ddd;">GRAND TOTAL</td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd; text-align: center;">${interest.total}</td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd; text-align: center;">100.0%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Bar chart -->
          <div style="flex: 1;">
            <div style="text-align: center; font-size: 11px; font-weight: 700; color: #1a3a6b; margin-bottom: 6px;">
              Interest &amp; Personality Profile
            </div>
            <div>
              ${interestChartHtml}
              <div style="display: flex; margin-left: 120px; margin-top: 4px; font-size: 8.5px; color: #888;">
                ${interestAxisLabels}
              </div>
            </div>
          </div>
        </div>

        <!-- Insight Box -->
        <div
          style="
            background: #eef7f0;
            border: 1px solid #cfe8d6;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 10.5px;
            margin-bottom: 12px;
            display: flex;
            gap: 6px;
            align-items: flex-start;
          "
        >
          <span>💡</span>
          <span>
            <strong>Insights:</strong> ${generateInterestInsight(interest.rows)}
          </span>
        </div>

        <!-- ---------------- SECTION 2 ---------------- -->
        <div
          style="
            background: #1a3a6b;
            color: #fff;
            font-size: 11.5px;
            font-weight: 700;
            padding: 5px 10px;
            border-radius: 4px;
            letter-spacing: 0.3px;
          "
        >
          SECTION 2: ACADEMIC PROFICIENCY ASSESSMENT
        </div>
        <p style="font-size: 11px; color: #444; margin: 4px 0 8px;">
          Evaluates correctness in core academic aptitude disciplines.
        </p>

        <div style="display: flex; gap: 20px; align-items: flex-start; margin-bottom: 8px;">
          <!-- Table -->
          <div style="flex: 0 0 46%;">
            <table style="width: 100%; border-collapse: collapse; font-size: 9.5px;">
              <thead>
                <tr style="background: #1a3a6b; color: #fff;">
                  <th style="padding: 5px 6px; text-align: left; font-weight: 600; border: 1px solid #1a3a6b;">Academic Subjects</th>
                  <th style="padding: 5px 6px; text-align: center; font-weight: 600; border: 1px solid #1a3a6b; width: 60px;">Correct</th>
                  <th style="padding: 5px 6px; text-align: center; font-weight: 600; border: 1px solid #1a3a6b; width: 70px;">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                ${academicTableRowsHtml}
                <tr style="background: #fdf3e3; font-weight: 700;">
                  <td style="padding: 4px 6px; border: 1px solid #ddd;">GRAND TOTAL</td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd; text-align: center;">${academic.totalCorrect}</td>
                  <td style="padding: 4px 6px; border: 1px solid #ddd; text-align: center;">${academic.grandAccuracy.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Vertical Bar Chart -->
          <div style="flex: 1;">
            <div style="text-align: center; font-size: 11px; font-weight: 700; color: #1a3a6b; margin-bottom: 6px;">
              Academic Proficiency Profile
            </div>
            <div>
              <div
                style="
                  display: flex;
                  align-items: flex-end;
                  height: ${chartHeight}px;
                  border-left: 1px solid #ccc;
                  border-bottom: 1px solid #ccc;
                  padding-left: 8px;
                  gap: 12px;
                "
              >
                ${academicChartBarsHtml}
              </div>
              <div style="display: flex; padding-left: 8px; gap: 12px; margin-top: 4px;">
                ${academicChartLabelsHtml}
              </div>
            </div>
          </div>
        </div>

        <!-- Insight Box -->
        <div
          style="
            background: #eef7f0;
            border: 1px solid #cfe8d6;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 10.5px;
            margin-bottom: 12px;
            display: flex;
            gap: 6px;
            align-items: flex-start;
          "
        >
          <span>💡</span>
          <span>
            <strong>Insights:</strong> ${generateAcademicInsight(academic.rows)}
          </span>
        </div>
      </div>

      <!-- ---------------- FOOTER ---------------- -->
      <div
        style="
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 0 10px;
          margin-top: auto;
        "
      >
        <div style="text-align: center; width: 160px;">
          ${directorLeft.signatureSrc ? `<img src="${directorLeft.signatureSrc}" alt="${directorLeft.name} signature" style="height: 35px; object-fit: contain; margin-bottom: 2px;" />` : ''}
          <div style="font-size: 10.5px; font-weight: 700; border-top: 1px solid #999; padding-top: 3px;">
            ${directorLeft.name}
          </div>
          <div style="font-size: 9px; letter-spacing: 0.5px;">${directorLeft.title}</div>
          <div style="font-size: 9px;">${directorLeft.org}</div>
        </div>
        ${badgeSrc ? `<img src="${badgeSrc}" alt="Seal" style="width: 56px; height: 56px; object-fit: contain;" />` : ''}
        <div style="text-align: center; width: 160px;">
          ${directorRight.signatureSrc ? `<img src="${directorRight.signatureSrc}" alt="${directorRight.name} signature" style="height: 35px; object-fit: contain; margin-bottom: 2px;" />` : ''}
          <div style="font-size: 10.5px; font-weight: 700; border-top: 1px solid #999; padding-top: 3px;">
            ${directorRight.name}
          </div>
          <div style="font-size: 9px; letter-spacing: 0.5px;">${directorRight.title}</div>
          <div style="font-size: 9px;">${directorRight.org}</div>
        </div>
      </div>
    </div>
  </body>
</html>`;

    // Launch Puppeteer headless browser
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
        
        // Render PDF buffer in portrait orientation with zero margins
        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: false,
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });
        
        return pdfBuffer;
    } finally {
        await browser.close();
    }
};
