import React from 'react';

function ExcelProcessButton() {

  const handleDownload = () => {
    fetch('/process-excel')
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Excel_Reports.zip";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(err => console.error('Download error:', err));
  };

  return (
    <button onClick={handleDownload}>
      Process Excel
    </button>
  );
}

export default ExcelProcessButton;
