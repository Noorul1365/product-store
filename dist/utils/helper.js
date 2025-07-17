"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = exports.asyncHandler = void 0;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
const responseHandler = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
        success: statusCode < 400,
        code: statusCode,
        message,
        data,
    });
};
exports.responseHandler = responseHandler;
