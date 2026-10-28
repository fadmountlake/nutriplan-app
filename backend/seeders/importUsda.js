const path = require('path');
const fs = require('fs');

// Kamus terjemahan frasa populer USDA ke Bahasa Indonesia
const dictionary = {
    'chicken': 'Ayam',
    'egg': 'Telur',
    'rice': 'Nasi / Beras',
    'beef': 'Daging Sapi',
    'pork': 'Daging Babi',
    'fish': 'Ikan',
    'milk': 'Susu',
    'cheese': 'Keju',
    'bread': 'Roti',
    'potato': 'Kentang',
    'apple': 'Apel',
    'banana': 'Pisang',
    'water': 'Air',
    'butter': 'Mentega',
    'oil': 'Minyak',
    'sugar': 'Gula',
    'salt': 'Garam',
    'soup': 'Sup',
    'salad': 'Salad',
    'noodle': 'Mie',
    'whole': 'Utuh',
    'raw': 'Mentah',
    'cooked': 'Matang',
    'fried': 'Goreng',
    'boiled': 'Rebus',
    'roasted': 'Panggang',
    'fresh': 'Segar',
    'sweet': 'Manis',
    'dried': 'Kering'
};

function translateName(englishName) {
    if (!englishName) return 'Makanan Tanpa Nama';
    let translated = englishName;
    
    // Ganti kata-kata bahasa Inggris sesuai kamus
    Object.keys(dictionary).forEach(enKey => {
        const regex = new RegExp(`\\b${enKey}\\b`, 'gi');
        translated = translated.replace(regex, dictionary[enKey]);
    });

    return translated;
}

function loadUsdaData() {
    try {
        const filePath = path.join(__dirname, 'usda.json');
        if (!fs.existsSync(filePath)) {
            console.log('File usda.json tidak ditemukan, melewati data USDA.');
            return [];
        }

        const rawData = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(rawData);
        const foodList = parsed.FoundationFoods || parsed.Foods || (Array.isArray(parsed) ? parsed : []);

        const formatted = foodList
            .filter(item => item && typeof item === 'object')
            .map((item, idx) => {
                const nutrients = item.foodNutrients || [];
                
                const getNutrient = (ids, nameKeywords) => {
                    if (!Array.isArray(nutrients)) return 0;
                    const found = nutrients.find(n => {
                        if (!n) return false;
                        const idMatch = n.nutrient && ids.includes(n.nutrient.id);
                        const nameMatch = n.nutrient && n.nutrient.name && nameKeywords.some(k => n.nutrient.name.toLowerCase().includes(k));
                        return idMatch || nameMatch;
                    });
                    return found ? parseFloat(found.amount || found.value || 0) : 0;
                };

                const indoName = translateName(item.description);

                return {
                    id: `usda_${item.fdcId || idx}`,
                    name: `[USDA] ${indoName}`,
                    calories: Math.round(getNutrient([1008, 2047, 2048], ['energy', 'kcal'])),
                    proteins: Math.round(getNutrient([1003], ['protein'])),
                    fat: Math.round(getNutrient([1004], ['total lipid', 'fat'])),
                    carbohydrate: Math.round(getNutrient([1005], ['carbohydrate'])),
                    image: ''
                };
            });

        console.log(`Berhasil memuat ${formatted.length} data pangan dari USDA (Terjemahan Bahasa Indonesia).`);
        return formatted;
    } catch (error) {
        console.error('Gagal membaca file usda.json:', error.message);
        return [];
    }
}

module.exports = loadUsdaData;