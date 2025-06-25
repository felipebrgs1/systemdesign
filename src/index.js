const express = require('express');
const { createClient } = require('redis');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const redis = createClient({ url: process.env.REDIS_URL });
redis.connect().catch(console.error);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/', async (req, res) => {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();

    await redis.set('lastAccess', new Date().toISOString());

    res.json({
        message: 'API funcionando!',
        time: result.rows[0].now,
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
