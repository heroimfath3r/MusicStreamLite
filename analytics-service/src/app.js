import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
// import morgan from 'morgan'; // COMENTADO TEMPORALMENTE

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ============================================================
// CORS Configuration
// ============================================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://musicstream-frontend-586011919703.us-central1.run.app'
];

// Middleware
app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
// app.use(morgan('dev')); // COMENTADO TEMPORALMENTE

// ============================================================
// Health check SIMPLE
// ============================================================
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'analytics-service',
    timestamp: new Date().toISOString(),
    port_used: PORT
  });
});

// ============================================================
// Placeholder routes
// ============================================================
app.post('/api/analytics/plays', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Play tracked (placeholder)',
    playId: 'temp-' + Date.now()
  });
});

app.get('/api/analytics/songs/:songId', (req, res) => {
  res.json({
    songId: req.params.songId,
    playCount: 0,
    message: 'Analytics placeholder'
  });
});

app.get('/api/analytics/trending', (req, res) => {
  res.json({
    trending: [],
    message: 'Trending placeholder'
  });
});

// ============================================================
// 404 handler
// ============================================================
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============================================================
// Error handler
// ============================================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ============================================================
// Start server
// ============================================================
try {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log(`📊 Analytics Service corriendo en puerto ${PORT}`);
    console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`📈 Analytics API: http://0.0.0.0:${PORT}/api/analytics`);
    console.log('='.repeat(60));
  });
} catch (error) {
  console.error('❌ Error fatal al iniciar el servicio:', error);
  process.exit(1);
}

export default app;