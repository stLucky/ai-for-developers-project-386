"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventTypeSchema = exports.createEventTypeSchema = void 0;
const zod_1 = require("zod");
exports.createEventTypeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional(),
    durationMinutes: zod_1.z.number().int().min(1).max(480),
});
exports.updateEventTypeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().max(500).optional(),
    durationMinutes: zod_1.z.number().int().min(1).max(480).optional(),
});
//# sourceMappingURL=eventTypes.js.map