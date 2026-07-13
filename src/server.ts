import { pool } from './config/database';
import express from 'express'
import carroRoutes from './routes/carroRoutes';
import leadRoutes from './routes/leadRoutes';
import chatRoutes from './routes/chatRoutes';

const app = express()

app.use(express.json());
app.use('/carros', carroRoutes);
app.use('/chat', chatRoutes);
app.use('/leads', leadRoutes);

app.listen(3000, async () => {
    console.log('Server is running on port 3000');

    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Conectado ao banco! Hora atual:', result.rows[0]);
    } catch (error) {
        console.error('Erro ao conectar no banco:', error);
    }
});