// user-service/src/middleware/auth.js
// Middleware de autenticación JWT mejorado para microservicios
// Usa HS256 con secreto compartido

import jwt from 'jsonwebtoken';

// Configuración desde variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_ISSUER = process.env.JWT_ISSUER || null; // Opcional: validar issuer
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || null; // Opcional: validar audience

// Construir opciones de verificación
const buildVerifyOptions = () => {
  const opts = { algorithms: ['HS256'] };

  if (JWT_ISSUER) opts.issuer = JWT_ISSUER;
  if (JWT_AUDIENCE) opts.audience = JWT_AUDIENCE;

  return opts;
};

// Verifica el token usando HS256
const verifyToken = async (token) => {
  const verifyOptions = buildVerifyOptions();
  return jwt.verify(token, JWT_SECRET, verifyOptions);
};

// Middleware: forzar autenticación (requerido)
export const authenticateToken = async (req, res, next) => {
  try {
    // Obtener token del header Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    try {
      const decoded = await verifyToken(token);

      // Mapear claims esperados a req.user (normalizar)
      req.user = {
        userId: decoded.userId ?? decoded.sub ?? decoded.uid,
        email: decoded.email,
        uid: decoded.userId ?? decoded.sub ?? decoded.uid, // Alias para compatibilidad
        roles: decoded.roles || decoded.role || [],
        raw: decoded,
      };

      return next();
    } catch (verErr) {
      console.error('Token verification error:', verErr.message);
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Middleware opcional: intenta autenticar, pero deja pasar si no hay token
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return next();

    try {
      const decoded = await verifyToken(token);
      req.user = {
        userId: decoded.userId ?? decoded.sub ?? decoded.uid,
        email: decoded.email,
        uid: decoded.userId ?? decoded.sub ?? decoded.uid,
        roles: decoded.roles || decoded.role || [],
        raw: decoded,
      };
    } catch (err) {
      // Si token inválido, NO bloquear en optionalAuth: solo no setear req.user
      console.warn('Optional auth: invalid token (ignored):', err.message);
    }

    return next();
  } catch (error) {
    console.error('Optional auth error:', error);
    return next();
  }
};

// Middleware: validar userId en params (verifica que coincida con req.user.userId)
export const validateUserParam = (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'User ID is required'
    });
  }

  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  if (String(req.user.userId) !== String(userId)) {
    console.warn(`Access denied: User ${req.user.userId} tried to access data for user ${userId}`);
    return res.status(403).json({
      success: false,
      error: 'Access denied to other user data'
    });
  }

  return next();
};

// Export adicional: helper para tests/otros servicios
export const _verifyToken = verifyToken;
