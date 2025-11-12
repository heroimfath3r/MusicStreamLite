//C:\Proyectos\MusicStreamLite\MusicStreamLite-backend\catalog-service\src\app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// ✅ Importa el router unificado (index.js)
import routes from './routes/index.js'; 

const app = express();
const PORT = process.env.PORT || 8080

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
// ✅ Monta TODAS las rutas del catalog-service bajo el prefijo /api
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'catalog-service' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎵 Catalog Service running on port ${PORT}`);
});