import ExcelJS from 'exceljs';

/**
 * Generates an Excel buffer from JSON data
 * @param {Array} data - Array of objects to export
 * @param {Object} options - Configuration options (sheetName, fileName)
 * @returns {Buffer}
 */
export const generateExcelBuffer = async (data, options = {}) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(options.sheetName || 'Data');

    if (data.length > 0) {
        // Define columns based on the keys of the first object
        const columns = Object.keys(data[0]).map(key => ({
            header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'), // Simple camelCase to Title Case
            key: key,
            width: 20
        }));
        
        worksheet.columns = columns;

        // Add rows
        worksheet.addRows(data);

        // Styling the header
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F81BD' }
        };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    }

    return await workbook.xlsx.writeBuffer();
};
