const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'testdb',
    port: process.env.DB_PORT || 5432,
});

app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Devops first project is running successfully!',
        timestamp: new Date()
    });
});

app.get('/db-health',async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            database: 'connected',
            dbTime: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({
            database: 'disconnected',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
