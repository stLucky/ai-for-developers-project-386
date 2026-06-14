"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingSchema = void 0;
const zod_1 = require("zod");
exports.createBookingSchema = zod_1.z.object({
    slotId: zod_1.z.string().min(1),
    guestName: zod_1.z.string().min(1).max(100),
    guestEmail: zod_1.z.string().email(),
    notes: zod_1.z.string().max(1000).optional(),
});
//# sourceMappingURL=bookings.js.map