const path = require('path');
const xlsx = require('xlsx');

function loadNutritionData() {
    try {
        const filePath = path.join(__dirname, 'nutrition.xlsx');
        const workbook = xlsx.readFile(filePath);
        const sheetName = 'nutrition';
        const sheet = workbook.Sheets[sheetName];
        
        if (!sheet) {
            console.error(`Sheet '${sheetName}' tidak ditemukan!`);
            return [];
        }

        const rawData = xlsx.utils.sheet_to_json(sheet);
        const formattedData = rawData.map(item => ({
            id: item.id,
            name: item.name,
            calories: parseFloat(item.calories) || 0,
            proteins: parseFloat(item.proteins) || 0,
            fat: parseFloat(item.fat) || 0,
            carbohydrate: parseFloat(item.carbohydrate) || 0,
            image: item.image || ''
        }));

        console.log(`Berhasil memuat ${formattedData.length} data pangan TKPI dari Excel.`);
        return formattedData;
    } catch (error) {
        console.error('Gagal membaca file nutrition.xlsx:', error.message);
        return [];
    }
}

// Tambahkan baris ini di paling bawah agar fungsi langsung dipanggil saat dijalankan
loadNutritionData();

module.exports = loadNutritionData;