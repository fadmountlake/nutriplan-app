const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// Route untuk data makanan
router.get('/foods', foodController.getAllFoods);
router.get('/foods/search', foodController.searchFood);

module.exports = router;