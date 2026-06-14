"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const zod_1 = require("zod");
function validateRequest(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const details = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
                res.status(422).json({
                    code: "VALIDATION_ERROR",
                    message: "Validation failed",
                    details,
                });
                return;
            }
            next(err);
        }
    };
}
//# sourceMappingURL=validateRequest.js.map