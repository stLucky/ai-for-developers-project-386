"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    console.error("[error]", err);
    res.status(500).json({
        code: "INTERNAL_ERROR",
        message: "Internal server error",
    });
}
//# sourceMappingURL=errorHandler.js.map