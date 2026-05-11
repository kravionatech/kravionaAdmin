import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return null;
  }
};

export default { generateAccessToken, generateRefreshToken, verifyToken };
