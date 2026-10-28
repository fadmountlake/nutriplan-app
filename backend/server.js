const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy Route Test API
app.get('/', (req, res) => {
    res.json({ message: 'API NutriPlan Web App Capstone UT Berhasil Jalan!' });
});

// Import Routes
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});