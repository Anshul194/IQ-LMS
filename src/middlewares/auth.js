import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import httpStatus from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const auth = (...requiredRoles) => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization;

        // 1. Check if token is provided
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
        }

        // 2. Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt.secret);
        } catch (err) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
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
