import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import catalogRoutes from './routes/catalog.js';
import streamRoutes from './routes/stream.js';

const app = express();
const PORT = process.env.PORT || 8080

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', catalogRoutes);
app.use('/api', streamRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'catalog-service' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Catalog Service running on port ${PORT}`);
});