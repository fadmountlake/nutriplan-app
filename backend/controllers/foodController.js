const loadTkpiData = require('../seeders/importTkpi');
const loadUsdaData = require('../seeders/importUsda');

// Load dan gabungkan data TKPI + USDA
const tkpiFoods = loadTkpiData();
const usdaFoods = loadUsdaData();
const allFoodData = [...tkpiFoods, ...usdaFoods];

exports.getAllFoods = (req, res) => {
    res.status(200).json({
        success: true,
        total: allFoodData.length,
        data: allFoodData
    });
};

exports.searchFood = (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : '';
    const filtered = allFoodData.filter(food => food.name.toLowerCase().includes(query));

    res.status(200).json({
        success: true,
        total: filtered.length,
        data: filtered
    });
};