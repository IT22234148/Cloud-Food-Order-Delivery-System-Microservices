import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error('No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debugging log
    req.user = decoded;

    // Allow customers to access GET /api/delivery/:id
    if (req.method === 'GET' && req.path.startsWith('/api/delivery/')) {
      return next();
    }

    // Restrict other routes to the 'delivery' role
    if (req.user.role !== 'delivery') {
      console.error(`Access denied for role: ${req.user.role}`);
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (err) {
    console.error('Token verification error:', err.message); // Debugging log
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};