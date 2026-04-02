import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: 'fail',
        message: 'Missing authentication',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      status: 'fail',
      message: 'Token tidak valid',
    });
  }
};

export default authMiddleware;
