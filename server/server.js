import pkg from 'pg';
const { Pool } = pkg;

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'dbmasteruser',
    host: 'ls-801a010ba211ba2e70a772ea9be742cc63bc77c8.c3igyeqqodiz.us-east-1.rds.amazonaws.com',
    database: 'fullday',
    password: '3wW0n]om^<jY{A9[e7M^MLL_U_G&Kp8G',
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    }
  });

const app = express();

// Definir __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// *** Servir archivos estáticos (CSS, JS, imágenes) ***
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());
app.use(bodyParser.json());

// Ruta para servir el formulario (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Ruta para servir el dashboard (dashboard.html)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
});

// Ruta para servir el formulario de cada equipo
app.get('/formulario-equipo', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'formulario-equipo.html'));
});


// Ruta para manejar el envío del formulario
app.post('/submit-completo', async (req, res) => {
    const {
        numeroGrupo, llaveMinutos, alicateMinutos,
        fichasAmarillas, fichasAzules, fichasRojas, fichasBlancas, fichasOtrosColores,
        aguaConsumo, luzConsumo, internetConsumo
    } = req.body;

    try {
        const query = `
            INSERT INTO costos_completo (numero_grupo, llave_minutos, alicate_minutos, fichas_amarillas, fichas_azules, fichas_rojas, fichas_blancas, fichas_otros_colores, agua_consumo, luz_consumo, internet_consumo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
        const values = [
            numeroGrupo, llaveMinutos, alicateMinutos, fichasAmarillas, fichasAzules, fichasRojas, fichasBlancas, fichasOtrosColores,
            aguaConsumo, luzConsumo, internetConsumo
        ];

        const result = await pool.query(query, values);
        console.log('Costos registrados:', result.rows[0]);
        res.send('Costos registrados correctamente');
    } catch (error) {
        console.error('Error al registrar los costos:', error);
        res.status(500).send('Error al registrar los costos');
    }
});


// Ruta para obtener todos los ensambles
app.get('/ensambles', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT ON (numero_grupo) *
            FROM costos_completo
            ORDER BY numero_grupo, fecha_registro DESC
        `);
        res.json(result.rows);  // Devolver solo el último registro por equipo
    } catch (error) {
        console.error('Error al obtener los datos de ensambles:', error);
        res.status(500).send('Error al obtener los datos de ensambles');
    }
});




app.listen(3001, () => {
    console.log('Servidor ejecutándose en http://localhost:3001');
});
