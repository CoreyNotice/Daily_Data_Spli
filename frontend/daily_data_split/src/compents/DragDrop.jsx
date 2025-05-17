import React, { useState } from "react";
import * as XLSX from "xlsx";

function DragDrop() {
  const [fileData, setFileData] = useState(null);
  const [file, setFile] = useState(null); // <<== ADD THIS

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];

    if (droppedFile && droppedFile.name.endsWith(".xlsx")) {
      setFile(droppedFile); // <<== SAVE the dropped file here
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        // Identify the header row and column indexes
        const headers = sheetData[0];
        const fromIndex = headers.indexOf("From");
        const toIndex = headers.indexOf("To");
        const logDateIndex = headers.indexOf("LogDate");

        const formatDate = (value) => {
          if (typeof value === "number") {
            return XLSX.SSF.format("yyyy-mm-dd", value);
          }
          return value;
        };

        const formattedData = sheetData.map((row, rowIndex) => {
          if (rowIndex === 0) return row;
          return row.map((cell, cellIndex) => {
            if (cellIndex === fromIndex || cellIndex === toIndex || cellIndex === logDateIndex) {
              return formatDate(cell);
            }
            return cell;
          });
        });

        setFileData(formattedData);
      };
      reader.readAsArrayBuffer(droppedFile);
    } else {
      alert("Please drop a valid Excel file!");
    }
  };

  const handleDownload = () => {
  if (!file) {
    alert("No file uploaded yet!");
    return;
  }

  const formData = new FormData();
  formData.append('excelFile', file);

  fetch('http://localhost:5000/process-excel', {
    method: 'POST',
    body: formData,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Server error!');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
      a.download = `Excel_Reports_${today}.zip`; // ✅ use .zip here
      document.body.appendChild(a); // Firefox fix
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch(err => console.error('Download error:', err));
};


  return (
    <div>
      <h4 className="card-header text-center bg-primary text-white">Drop Excel File Here</h4>

      <div
        className="card"
        onDrop={handleDrop}
        onDragOver={allowDrop}
        style={{
          border: "2px dashed #007bff",
          height: "25vh",
          width: "25vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
      </div>

      <div className="container-fluid">
        <h5 className="card-header text-center bg-primary text-white">
          Excel Preview
        </h5>
        <div>
          {fileData && (
            <table className="table table-striped-columns table-hover border border-dark border-5">
              <thead>
                <tr>
                  {fileData[0].map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fileData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 👇 BUTTON TO PROCESS */}
        {file && (
          <div className="text-center mt-4">
            <button onClick={handleDownload} className="btn btn-success">
              Process and Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DragDrop;
