document.addEventListener('DOMContentLoaded', function() {
    // Load data from localStorage
    const reportDataStr = localStorage.getItem('pnReportData');
    if (!reportDataStr) {
        alert('ไม่พบข้อมูล กรุณากรอกข้อมูลใหม่');
        window.location.href = 'index.html';
        return;
    }

    const data = JSON.parse(reportDataStr);

    // Display patient info
    document.getElementById('reportHN').textContent = data.hn;
    document.getElementById('reportName').textContent = data.patientName;
    document.getElementById('reportWard').textContent = data.ward;
    document.getElementById('reportWeight').textContent = data.weight;
    
    // Format Thai date
    const today = new Date();
    const thaiDate = today.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('reportDate').textContent = thaiDate;

    // Build solutions table (only selected items)
    const tableBody = document.getElementById('solutionsTableBody');
    const solutions = [];

    if (data.dextroseType && parseFloat(data.dextroseVolume) > 0) {
        solutions.push({
            name: 'Dextrose',
            type: data.dextroseType,
            volume: data.dextroseVolume,
            calories: data.dextroseCalories
        });
    }

    if (data.aminoType && parseFloat(data.aminoVolume) > 0) {
        solutions.push({
            name: 'Amino Acid',
            type: data.aminoType,
            volume: data.aminoVolume,
            calories: data.aminoCalories
        });
    }

    if (data.lipidType && parseFloat(data.lipidVolume) > 0) {
        solutions.push({
            name: 'Lipid',
            type: data.lipidType,
            volume: data.lipidVolume,
            calories: data.lipidCalories
        });
    }

    if (data.sodiumType && parseFloat(data.sodiumVolume) > 0) {
        solutions.push({
            name: 'Sodium',
            type: data.sodiumType,
            volume: data.sodiumVolume,
            calories: '-'
        });
    }

    if (data.potassiumType && parseFloat(data.potassiumVolume) > 0) {
        solutions.push({
            name: 'Potassium',
            type: data.potassiumType,
            volume: data.potassiumVolume,
            calories: '-'
        });
    }

    // Add rows to table
    solutions.forEach(sol => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sol.name}</td>
            <td>${sol.type}</td>
            <td>${sol.volume}</td>
            <td>${sol.calories}</td>
        `;
        tableBody.appendChild(row);
    });

    // Display PN calories breakdown
    const breakdownDiv = document.getElementById('pnCaloriesBreakdown');
    let breakdownHTML = '';

    if (data.dextroseType && parseFloat(data.dextroseVolume) > 0) {
        breakdownHTML += `<div>Dextrose: ${data.dextroseCalories} kcal</div>`;
    }
    if (data.aminoType && parseFloat(data.aminoVolume) > 0) {
        breakdownHTML += `<div>Amino Acid: ${data.aminoCalories} kcal</div>`;
    }
    if (data.lipidType && parseFloat(data.lipidVolume) > 0) {
        breakdownHTML += `<div>Lipid: ${data.lipidCalories} kcal</div>`;
    }

    breakdownDiv.innerHTML = breakdownHTML;

    // Display summary
    document.getElementById('reportPNCalories').textContent = data.totalPNCalories.replace(' kcal', '');
    document.getElementById('reportOralCalories').textContent = data.oralIntake;
    document.getElementById('reportTotalCalories').textContent = data.totalCalories.replace(' kcal', '');
    document.getElementById('reportTotalVolume').textContent = data.totalVolume.replace(' ml', '');

    // Download PDF button
    document.getElementById('downloadPDF').addEventListener('click', async function() {
        try {
            const { jsPDF } = window.jspdf;
            
            // Use html2canvas to capture the report
            const reportContent = document.getElementById('reportContent');
            const canvas = await html2canvas(reportContent, {
                scale: 2,
                logging: false,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`PN_Report_${data.hn}_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('เกิดข้อผิดพลาดในการสร้าง PDF');
        }
    });

    // Back button
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});
