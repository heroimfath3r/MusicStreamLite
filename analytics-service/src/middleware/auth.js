import admin from '../config/firebase-admin.js';

// Middleware para verificar tokens de Firebase
export const authenticateFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};

// Middleware para verificar si es admin
export const requireAdmin = async (req, res, next) => {
  try {
    // En una implementación real, verificarías roles específicos
    // Por ahora, asumimos que todos los usuarios autenticados pueden acceder
    if (!req.user) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    // Aquí iría la lógica para verificar roles de admin
    // Por ejemplo: req.user.roles.includes('admin')
    
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(403).json({ error: 'Admin access required' });
  }
};

// Middleware para verificar user ID en parámetros
export const validateUserParam = (req, res, next) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  // Si el usuario está autenticado, verificar que coincide con el parámetro
  if (req.user && req.user.uid !== userId) {
    return res.status(403).json({ error: 'Access denied to other user data' });
  }
  
  next();
};