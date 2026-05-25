import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/index.js';

export const createToken = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
};

export const isPasswordMatched = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
