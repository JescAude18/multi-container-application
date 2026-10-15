const express = require('express');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/tododb';

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Multi-Container Service API is running'
    });
});

async function startServer() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Connected to MongoDB');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
}

startServer();
