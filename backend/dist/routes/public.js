"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const store_1 = require("../store");
const bookings_1 = require("../validators/bookings");
const validateRequest_1 = require("../middleware/validateRequest");
const slots_1 = require("../utils/slots");
const router = (0, express_1.Router)();
router.get("/owner", (_req, res) => {
    if (!store_1.store.owner) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Owner not found" });
    }
    res.json(store_1.store.owner);
});
router.get("/event-types", (_req, res) => {
    res.json(Array.from(store_1.store.eventTypes.values()));
});
router.get("/event-types/:id", (req, res) => {
    const eventType = store_1.store.eventTypes.get(req.params.id);
    if (!eventType) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Event type not found" });
    }
    res.json(eventType);
});
router.get("/event-types/:id/slots", (req, res) => {
    const eventType = store_1.store.eventTypes.get(req.params.id);
    if (!eventType) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Event type not found" });
    }
    const { from, to } = req.query;
    const bookings = Array.from(store_1.store.bookings.values());
    const slots = (0, slots_1.generateSlots)(eventType, bookings, from, to);
    res.json(slots);
});
router.post("/bookings", (0, validateRequest_1.validateRequest)(bookings_1.createBookingSchema), (req, res) => {
    const body = req.body;
    // Check if slot is already booked (confirmed)
    const existing = Array.from(store_1.store.bookings.values()).find((b) => b.slotId === body.slotId && b.status === "confirmed");
    if (existing) {
        return res.status(409).json({ code: "CONFLICT", message: "Slot is already booked" });
    }
    const booking = {
        id: (0, uuid_1.v4)(),
        slotId: body.slotId,
        guestName: body.guestName,
        guestEmail: body.guestEmail,
        notes: body.notes,
        status: "confirmed",
        createdAt: new Date().toISOString(),
    };
    store_1.store.bookings.set(booking.id, booking);
    res.status(201).json(booking);
});
router.get("/bookings/:id", (req, res) => {
    const booking = store_1.store.bookings.get(req.params.id);
    if (!booking) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Booking not found" });
    }
    res.json(booking);
});
exports.default = router;
//# sourceMappingURL=public.js.map