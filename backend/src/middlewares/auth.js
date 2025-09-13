// ============== src/middlewares/auth.js ==============
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user to ensure they still exist and get their current role
    const user = await User.findById(decoded.userId).select('role');
    if (!user) {
      throw new Error();
    }

    req.userId = decoded.userId;
    req.userRole = user.role;  // Get role from database, not token
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Please authenticate' 
    });
  }
};

module.exports = auth;