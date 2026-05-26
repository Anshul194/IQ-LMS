import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import httpStatus from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const auth = (...requiredRoles) => {
    return catchAsync(async (req, res, next) => {
        let token = req.headers.authorization;
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized! Token is missing.");
        }

        // Handle "Bearer <token>" format
        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }

        // 2. Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt.secret);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new AppError(httpStatus.UNAUTHORIZED, "Token has expired. Please login again.");
            }
            throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Token or Unauthorized access");
        }

        const { role, userId } = decoded;

        // 3. Check if role is authorized
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to access this resource");
        }

        req.user = decoded;
        next();
    });
};

export default auth;
