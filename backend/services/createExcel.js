import xlsx from 'xlsx';
import { today } from './date.js';

export function createExcel(schoolDistricts,centralDistricts,specialDistricts, masterFile) {
    // Create a new workbook object
    const workbook = xlsx.utils.book_new();
    const workbook2 = xlsx.utils.book_new();
    const workbook3 = xlsx.utils.book_new();
    // Define headers for each worksheet
    const headers = [["Allocation Category","Location","Location Amount","Tlump comments","Comments","SAM/CAM","District","Fund Source Code","Grant#","Type","Title", "Tracking#"]];
    const Daily_File_Formatted_headers=[["Location", "Location Amount", "Grant#", "Fund Source Code", "Funding Source", "Type", "Title" ,"Comments", "District", "Amount", "From","To","Tracking#", "Contact", "Phone","LogDate","FS10_Project_Number","Donor"]]
    const T_headers=[["Allocation Category","Location", "Amount","Comments","SAM/CAM","Comment"]]

    // Create sheets with headers and data
    const sheetA = xlsx.utils.aoa_to_sheet(
        [headers[0]].concat(
            Object.keys(schoolDistricts).map(key => 
                headers[0].map(header => schoolDistricts[key][header] || "") // Fill missing fields with blank
            )
        )
    );
    const sheetB = xlsx.utils.aoa_to_sheet(
        [headers[0]].concat(
            Object.keys(centralDistricts).map(key => 
                headers[0].map(header => centralDistricts[key][header] || "") // Fill missing fields with blank
            )
        )
    );
    const sheetC = xlsx.utils.aoa_to_sheet(
        [headers[0]].concat(
            Object.keys(specialDistricts).map(key => 
                headers[0].map(header => specialDistricts[key][header] || "") // Fill missing fields with blank
            )
        )
    );
    const sheetD = xlsx.utils.aoa_to_sheet(
        [headers[0]].concat(
            Object.keys(masterFile).map(key => 
                headers[0].map(header => masterFile[key][header] || "") // Fill missing fields with blank
            )
        )
    );

    const sheetE = xlsx.utils.aoa_to_sheet(
        [Daily_File_Formatted_headers[0]].concat(Object.keys(masterFile).map(key => Object.values(masterFile[key])))
    );
    const sheetTLump_Central = xlsx.utils.aoa_to_sheet(
        [T_headers[0]].concat(
            Object.keys(centralDistricts).map(key => 
                T_headers[0].map(header => centralDistricts[key][header] || "") // Fill missing fields with blank
            )
        )
    );
    const sheetTLump_schools = xlsx.utils.aoa_to_sheet(
        [T_headers[0]].concat(
            Object.keys(schoolDistricts).map(key => 
                T_headers[0].map(header => schoolDistricts[key][header] || "") // Fill missing fields with blank
            )
        )
    );

    // Append sheets to the workbook
    xlsx.utils.book_append_sheet(workbook, sheetA, 'Schools CSDs 1-32');
    xlsx.utils.book_append_sheet(workbook, sheetB, 'Central All Others');
    xlsx.utils.book_append_sheet(workbook, sheetC, 'Special CSDs 79 85 97');
    xlsx.utils.book_append_sheet(workbook, sheetD, 'Daily File_1');
    xlsx.utils.book_append_sheet(workbook, sheetE, 'Daily File Formatted');
    xlsx.utils.book_append_sheet(workbook2, sheetTLump_Central, `FY25 Central TLUMP`);
    xlsx.utils.book_append_sheet(workbook3, sheetTLump_schools, `FY25 Schools TLUMP`);


    // Write the workbook to a file
    // const date = today();
    // const filePath = `Daily File Report ${date}.xlsx`;
     return {workbook,workbook2,workbook3}
//  console.log(schoolsOfDistrictData)
    console.log(`Workbook with sheets created and saved as ${filePath}`);
}
