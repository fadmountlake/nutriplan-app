const express = require('express');
const router = express.Router();

// Dummy route test Auth
router.get('/', (req, res) => {
    res.json({ message: 'Endpoint Auth NutriPlan' });
});

module.exports = router;