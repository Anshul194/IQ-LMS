import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
    jwt: {
        secret: process.env.JWT_SECRET || 'verysecretsecret',
        refresh_secret: process.env.JWT_REFRESH_SECRET || 'anothersecret',
        expires_in: process.env.JWT_EXPIRES_IN || '1d',
        refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },
};
