import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY); 

export const authMiddleware = ({ req }: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return req;

  try {
    const secretKey = process.env.JWT_SECRET_KEY || '';
    const user = jwt.verify(token, secretKey);
    return { user };
  } catch {
    return req;
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
