"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const store_1 = require("../store");
const eventTypes_1 = require("../validators/eventTypes");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
router.get("/owner", (_req, res) => {
    if (!store_1.store.owner) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Owner not found" });
    }
    res.json(store_1.store.owner);
});
router.post("/event-types", (0, validateRequest_1.validateRequest)(eventTypes_1.createEventTypeSchema), (req, res) => {
    if (!store_1.store.owner) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Owner not found" });
    }
    const body = req.body;
    const eventType = {
        id: (0, uuid_1.v4)(),
        ownerId: store_1.store.owner.id,
        name: body.name,
        description: body.description,
        durationMinutes: body.durationMinutes,
    };
    store_1.store.eventTypes.set(eventType.id, eventType);
    res.status(201).json(eventType);
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
router.put("/event-types/:id", (0, validateRequest_1.validateRequest)(eventTypes_1.updateEventTypeSchema), (req, res) => {
    const eventType = store_1.store.eventTypes.get(req.params.id);
    if (!eventType) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Event type not found" });
    }
    const body = req.body;
    const updated = {
        ...eventType,
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.durationMinutes !== undefined && { durationMinutes: body.durationMinutes }),
    };
    store_1.store.eventTypes.set(updated.id, updated);
    res.json(updated);
});
router.delete("/event-types/:id", (req, res) => {
    const eventType = store_1.store.eventTypes.get(req.params.id);
    if (!eventType) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Event type not found" });
    }
    store_1.store.eventTypes.delete(req.params.id);
    res.status(204).send();
});
router.get("/bookings", (req, res) => {
    const { eventTypeId, status } = req.query;
    let bookings = Array.from(store_1.store.bookings.values());
    if (eventTypeId) {
        const et = store_1.store.eventTypes.get(eventTypeId);
        if (et) {
            // Filter bookings by eventType via slotId prefix
            bookings = bookings.filter((b) => b.slotId.startsWith(et.id));
        }
    }
    if (status) {
        bookings = bookings.filter((b) => b.status === status);
    }
    res.json(bookings);
});
router.get("/bookings/:id", (req, res) => {
    const booking = store_1.store.bookings.get(req.params.id);
    if (!booking) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Booking not found" });
    }
    res.json(booking);
});
router.post("/bookings/:id/cancel", (req, res) => {
    const booking = store_1.store.bookings.get(req.params.id);
    if (!booking) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Booking not found" });
    }
    const updated = { ...booking, status: "cancelled" };
    store_1.store.bookings.set(updated.id, updated);
    res.json(updated);
});
exports.default = router;
//# sourceMappingURL=admin.js.map