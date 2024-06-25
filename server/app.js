import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Convert __filename and __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use('/images', express.static(path.join(__dirname, '../images')));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dashboard.html'));
});

export default app;