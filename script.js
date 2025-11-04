// Solution data with calories
const solutions = {
    dextrose: {
        'D5W': { calories: 0.17 },      // kcal/ml
        'D10W': { calories: 0.34 },
        'D12.5W': { calories: 0.425 },
        'D20W': { calories: 0.68 },
        'D50W': { calories: 1.7 }
    },
    amino: {
        'Vamin': { calories: 0.4 },
        'Primene': { calories: 0.4 },
        'Aminoven': { calories: 0.4 },
        'Aminoplasmal': { calories: 0.4 }
    },
    lipid: {
        'Intralipid10': { calories: 1.1 },
        'Intralipid20': { calories: 2.0 },
        'SMOFlipid': { calories: 2.0 },
        'ClinOleic': { calories: 2.0 }
    }
};

// Calculate maintenance fluid using Holliday-Segar method
function calculateMaintenanceFluid(weight) {
    if (weight <= 0) return 0;
    
    let fluid = 0;
    if (weight <= 10) {
        fluid = weight * 100;
    } else if (weight <= 20) {
        fluid = 1000 + (weight - 10) * 50;
    } else {
        fluid = 1500 + (weight - 20) * 20;
    }
    return fluid;
}

// Calculate calories from solution
function calculateCalories(type, solution, volume) {
    if (!solution || !volume || volume <= 0) return 0;
    const caloriesPerMl = solutions[type][solution]?.calories || 0;
    return caloriesPerMl * volume;
}

// Update all calculations
function updateCalculations() {
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const oralIntake = parseFloat(document.getElementById('oralIntake').value) || 0;

    // Maintenance fluid
    const maintenanceFluid = calculateMaintenanceFluid(weight);
    document.getElementById('maintenanceFluid').textContent = `${maintenanceFluid.toFixed(1)} ml/day`;

    // Dextrose calories
    const dextroseType = document.getElementById('dextroseType').value;
    const dextroseVolume = parseFloat(document.getElementById('dextroseVolume').value) || 0;
    const dextroseCalories = calculateCalories('dextrose', dextroseType, dextroseVolume);
    document.getElementById('dextroseCalories').textContent = dextroseCalories.toFixed(1);

    // Amino acid calories
    const aminoType = document.getElementById('aminoType').value;
    const aminoVolume = parseFloat(document.getElementById('aminoVolume').value) || 0;
    const aminoCalories = calculateCalories('amino', aminoType, aminoVolume);
    document.getElementById('aminoCalories').textContent = aminoCalories.toFixed(1);

    // Lipid calories
    const lipidType = document.getElementById('lipidType').value;
    const lipidVolume = parseFloat(document.getElementById('lipidVolume').value) || 0;
    const lipidCalories = calculateCalories('lipid', lipidType, lipidVolume);
    document.getElementById('lipidCalories').textContent = lipidCalories.toFixed(1);

    // Total PN calories
    const totalPNCalories = dextroseCalories + aminoCalories + lipidCalories;
    document.getElementById('totalPNCalories').textContent = `${totalPNCalories.toFixed(1)} kcal`;

    // Total calories (PN + Oral)
    const totalCalories = totalPNCalories + oralIntake;
    document.getElementById('totalCalories').textContent = `${totalCalories.toFixed(1)} kcal`;

    // Total volume
    const sodiumVolume = parseFloat(document.getElementById('sodiumVolume').value) || 0;
    const potassiumVolume = parseFloat(document.getElementById('potassiumVolume').value) || 0;
    const totalVolume = dextroseVolume + aminoVolume + lipidVolume + sodiumVolume + potassiumVolume;
    document.getElementById('totalVolume').textContent = `${totalVolume.toFixed(1)} ml`;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all inputs
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', updateCalculations);
        input.addEventListener('change', updateCalculations);
    });

    // Submit button
    document.getElementById('submitBtn').addEventListener('click', function() {
        // Validate patient info
        const hn = document.getElementById('hn').value.trim();
        const patientName = document.getElementById('patientName').value.trim();
        const ward = document.getElementById('ward').value.trim();
        const weight = document.getElementById('weight').value;

        if (!hn || !patientName || !ward || !weight) {
            alert('กรุณากรอกข้อมูลผู้ป่วยให้ครบถ้วน');
            return;
        }

        // Collect all data
        const reportData = {
            hn: hn,
            patientName: patientName,
            ward: ward,
            weight: weight,
            oralIntake: document.getElementById('oralIntake').value || '0',
            dextroseType: document.getElementById('dextroseType').value,
            dextroseVolume: document.getElementById('dextroseVolume').value,
            dextroseCalories: document.getElementById('dextroseCalories').textContent,
            aminoType: document.getElementById('aminoType').value,
            aminoVolume: document.getElementById('aminoVolume').value,
            aminoCalories: document.getElementById('aminoCalories').textContent,
            lipidType: document.getElementById('lipidType').value,
            lipidVolume: document.getElementById('lipidVolume').value,
            lipidCalories: document.getElementById('lipidCalories').textContent,
            sodiumType: document.getElementById('sodiumType').value,
            sodiumVolume: document.getElementById('sodiumVolume').value,
            potassiumType: document.getElementById('potassiumType').value,
            potassiumVolume: document.getElementById('potassiumVolume').value,
            totalPNCalories: document.getElementById('totalPNCalories').textContent,
            totalCalories: document.getElementById('totalCalories').textContent,
            totalVolume: document.getElementById('totalVolume').textContent
        };

        // Save to localStorage and redirect
        localStorage.setItem('pnReportData', JSON.stringify(reportData));
        window.location.href = 'report.html';
    });
});
