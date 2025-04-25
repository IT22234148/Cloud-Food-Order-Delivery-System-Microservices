const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debugging log
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message); // Debugging log
    res.status(401).json({ msg: 'Invalid token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.error('Access denied for role:', req.user.role); // Debugging log
      return res.status(403).json({ msg: 'Access denied' });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
