import express from 'express';
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';
import multer from 'multer';
import cors from 'cors';
import JSZip from 'jszip';

import { readExcelFile, findHeaderCells, processData } from './services/excelProcess.js';
import { sortDistricts } from './services/sortDistricts.js';
import { createExcel } from './services/createExcel.js';

// emulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors())
// Multer setup
const upload = multer({ dest: 'Data/' }); // saved temporarily in /Data/

app.post('/process-excel', upload.single('excelFile'), async(req, res) => {
  
  try {
    
    const uploadedFilePath = req.file.path; // multer gives you the uploaded file path

    const { worksheet} = readExcelFile(uploadedFilePath);

    const headerGroup = [
      "Location", "Location Amount", "Grant#", "Fund Source Code", "Funding Source",
      "Type", "Title", "Comments", "District", "Amount", "From", "To", "Tracking#",
      "Contact", "Phone", "LogDate", "FS10_Project_Number", "Donor"
    ];
    const headerCells = findHeaderCells(worksheet);
    const baseData = processData(worksheet, headerGroup, headerCells);
    const sortData = sortDistricts(baseData);

    const {workbook,workbook2} = createExcel(
      sortData.schoolDistricts,
      sortData.centralDistricts,
      sortData.specialDistricts,
      sortData.masterFile
    );

    // Send workbook as response
    const buffer1 = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const buffer2 = xlsx.write(workbook2, { type: 'buffer', bookType: 'xlsx' });

//Create a Zip File
 const zip = new JSZip()
  zip.file('Daily_File_Report.xlsx',buffer1)
  zip.file('FY25_Central_TLUMP.xlsx',buffer2)

  const zipBuffer =  await zip.generateAsync({type:'nodebuffer'});

    res.setHeader('Content-Disposition', 'attachment; filename="Excel_Reports.zip"');
    res.setHeader('Content-Type','application/zip');
    res.send(zipBuffer);

    // Clean up uploaded file
    fs.unlinkSync(uploadedFilePath);

  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).send('An error occurred while processing the file.');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
