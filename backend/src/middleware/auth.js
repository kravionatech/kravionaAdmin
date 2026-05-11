import { verifyToken } from "../config/jwt.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Unauthorized - Invalid or expired token" });
  }

  req.user = decoded;
  next();
};

export default authMiddleware;
